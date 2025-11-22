from typing import TypedDict, List, Dict, Any, Annotated
from langgraph.graph import StateGraph, END
from backend.tools.geocoding import get_coordinates
from backend.tools.weather import get_weather_forecast
from backend.tools.places import search_attractions, search_restaurants
from backend.tools.routing import calculate_route
from backend.tools.costs import estimate_travel_costs
from backend.llm_factory import get_llm
from langchain_core.messages import HumanMessage, SystemMessage
import json

class AgentState(TypedDict):
    destination: str
    coordinates: Dict[str, float]
    weather: Dict[str, Any]
    places: List[Dict[str, Any]]
    restaurants: List[Dict[str, Any]]
    route: Dict[str, Any]
    costs: Dict[str, Any]
    final_itinerary: str
    structured_itinerary: Dict[str, Any] # New field for JSON output

async def geocode_node(state: AgentState):
    print(f"Geocoding: {state['destination']}")
    coords = await get_coordinates(state['destination'])
    return {"coordinates": coords}

async def weather_node(state: AgentState):
    if not state.get("coordinates"):
        return {"weather": {"error": "No coordinates"}}
    lat = state["coordinates"]["lat"]
    lon = state["coordinates"]["lon"]
    print(f"Fetching weather for: {lat}, {lon}")
    weather = await get_weather_forecast(lat, lon)
    return {"weather": weather}

async def places_node(state: AgentState):
    if not state.get("coordinates"):
        return {"places": [], "restaurants": []}
    lat = state["coordinates"]["lat"]
    lon = state["coordinates"]["lon"]
    print(f"Fetching places for: {lat}, {lon}")
    places = await search_attractions(lat, lon, query_context=state["destination"])
    restaurants = await search_restaurants(lat, lon)
    return {"places": places, "restaurants": restaurants}

async def route_node(state: AgentState):
    places = state.get("places", [])
    if not places:
        return {"route": {}}
    
    # Prepare locations for routing: Origin (City Center) -> Place 1 -> ... -> Place N
    locations = [state["coordinates"]] + [{"lat": p["lat"], "lon": p["lon"]} for p in places]
    print("Calculating route...")
    route = await calculate_route(locations)
    
    # Apply optimization to places order immediately
    route_data = route.get("routes", [{}])[0]
    optimized_indices = route_data.get("optimizedIntermediateWaypointIndex", [])
    
    if optimized_indices and len(optimized_indices) == len(places):
        print(f"Reordering places based on optimized route: {optimized_indices}")
        optimized_places = [places[i] for i in optimized_indices]
        return {"route": route, "places": optimized_places}
        
    return {"route": route}

async def cost_node(state: AgentState):
    places = state.get("places", [])
    if not places:
        return {"costs": {}}
    
    # Simple cost estimation between sequential points
    origins = [state["coordinates"]] + [{"lat": p["lat"], "lon": p["lon"]} for p in places[:-1]]
    destinations = [{"lat": p["lat"], "lon": p["lon"]} for p in places]
    
    print("Estimating costs...")
    costs = await estimate_travel_costs(origins, destinations)
    return {"costs": costs}

async def synthesizer_node(state: AgentState):
    llm = get_llm()
    
    # Construct a prompt with all the gathered data
    data_summary = {
        "destination": state["destination"],
        "weather": state.get("weather"),
        "places": state.get("places"),
        "restaurants": state.get("restaurants"),
        "route_summary": state.get("route", {}).get("routes", [{}])[0].get("summary", "N/A"),
        "costs": state.get("costs")
    }
    
    prompt = f"""
    You are an expert Travel Agent. Create a detailed itinerary for a trip to {state['destination']}.
    
    Here is the real-time data I have gathered:
    {json.dumps(data_summary, default=str)}
    
    CRITICAL INSTRUCTIONS:
    1. **STRICTLY FORBIDDEN TO HALLUCINATE**: You must ONLY use the Attractions and Restaurants explicitly listed in the `places` and `restaurants` arrays above.
    2. **OUTPUT FORMAT**: You must return a valid JSON object. Do NOT return Markdown. Do NOT return code blocks. Just the raw JSON.
    
    The JSON structure must be exactly:
    {{
      "trip_title": "...",
      "weather_summary": "...",
      "attractions": [
        {{
          "name": "...",
          "description": "...",
          "rating": 4.5,
          "visit_order": 1
        }}
      ],
      "dining": [
        {{
          "name": "...",
          "description": "...",
          "cuisine": "...",
          "rating": 4.0
        }}
      ],
      "costs": {{
        "transport_estimate": "...",
        "total_estimate": "..."
      }},
      "daily_plan": [
        {{
          "day": 1,
          "activities": ["..."]
        }}
      ]
    }}
    
    Be enthusiastic in the descriptions but strictly factual based on the provided data.
    """
    
    response = await llm.ainvoke([HumanMessage(content=prompt)])
    
    # Clean up response to ensure valid JSON
    content = response.content.strip()
    if content.startswith("```json"):
        content = content[7:]
    if content.endswith("```"):
        content = content[:-3]
        
    try:
        structured_data = json.loads(content)
    except json.JSONDecodeError:
        print("Error decoding JSON from LLM")
        structured_data = {}

    return {"final_itinerary": response.content, "structured_itinerary": structured_data}

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("geocoder", geocode_node)
workflow.add_node("fetch_weather", weather_node)
workflow.add_node("fetch_places", places_node)
workflow.add_node("calculate_route", route_node)
workflow.add_node("calculate_cost", cost_node)
workflow.add_node("synthesizer", synthesizer_node)

workflow.set_entry_point("geocoder")
workflow.add_edge("geocoder", "fetch_weather")
workflow.add_edge("fetch_weather", "fetch_places")
workflow.add_edge("fetch_places", "calculate_route")
workflow.add_edge("calculate_route", "calculate_cost")
workflow.add_edge("calculate_cost", "synthesizer")
workflow.add_edge("synthesizer", END)

app = workflow.compile()
