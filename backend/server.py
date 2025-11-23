from fastmcp import FastMCP
try:
    from backend.graph import app as graph_app
    from backend.tools.geocoding import get_coordinates
    from backend.tools.weather import get_weather_forecast
    from backend.tools.places import search_attractions, search_restaurants
    from backend.tools.routing import calculate_route
    from backend.tools.costs import estimate_travel_costs
    from backend.llm_factory import get_llm
except ImportError:
    # When running on Railway, imports are relative
    from graph import app as graph_app
    from tools.geocoding import get_coordinates
    from tools.weather import get_weather_forecast
    from tools.places import search_attractions, search_restaurants
    from tools.routing import calculate_route
    from tools.costs import estimate_travel_costs
    from llm_factory import get_llm
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
import json


# Initialize FastMCP Server (for MCP Clients)
mcp = FastMCP("TouristPlanner")

# --- Register Atomic Tools ---
@mcp.tool()
async def get_place_coordinates(place_name: str):
    """Get latitude and longitude for a place."""
    return await get_coordinates(place_name)

@mcp.tool()
async def get_weather(lat: float, lon: float):
    """Get weather forecast for coordinates."""
    return await get_weather_forecast(lat, lon)

@mcp.tool()
async def find_attractions(lat: float, lon: float):
    """Find top tourist attractions near coordinates."""
    return await search_attractions(lat, lon)

@mcp.tool()
async def find_restaurants(lat: float, lon: float):
    """Find restaurants near coordinates."""
    return await search_restaurants(lat, lon)

@mcp.tool()
async def optimize_route(locations: list):
    """Optimize driving route for a list of locations."""
    return await calculate_route(locations)

@mcp.tool()
async def plan_full_trip(destination: str):
    """
    Plan a complete trip to a destination.
    """
    initial_state = {"destination": destination}
    result = await graph_app.ainvoke(initial_state)
    return result["final_itinerary"]

# --- Expose HTTP Endpoint for Web App ---
# FastMCP doesn't easily expose custom HTTP routes mixed with MCP SSE.
# So we will mount FastMCP on a FastAPI app or just use FastAPI directly for the web.
# Since we want BOTH, let's create a FastAPI app that wraps the logic.

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TripRequest(BaseModel):
    destination: str

from langchain_core.messages import HumanMessage

class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any]

@app.post("/api/chat")
async def chat(request: ChatRequest):
    llm = get_llm()
    
    # Construct context string
    context_str = json.dumps(request.context, default=str)
    
    prompt = f"""
    You are a helpful Travel Assistant for a specific trip.
    
    Current Itinerary Context:
    {context_str}
    
    User Question: {request.message}
    
    Answer the user's question based ONLY on the provided itinerary context.
    If the answer is not in the context, say "I don't have that information in the current plan."
    Be concise and friendly.
    """
    
    response = await llm.ainvoke([HumanMessage(content=prompt)])
    return {"response": response.content}

@app.post("/api/plan_trip")
async def api_plan_trip(request: TripRequest):
    # ... (keep existing code)
    try:
        initial_state = {"destination": request.destination}
        result = await graph_app.ainvoke(initial_state)
        # Return structured data for the UI
        return {
            "destination": request.destination,
            "coordinates": result.get("coordinates"),  # Add coordinates for map centering
            "final_itinerary": result.get("final_itinerary"),
            "structured_itinerary": result.get("structured_itinerary"), # New JSON output
            "weather": result.get("weather"),
            "places": result.get("places"),
            "restaurants": result.get("restaurants"),
            "route": result.get("route"),
            "costs": result.get("costs")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # We can run FastMCP in a separate process or thread if needed, 
    # but for this Web App demo, we'll prioritize the HTTP server.
    # To run MCP, one would use `fastmcp run backend/server.py`
    # To run Web API, we use `python backend/server.py`
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
