import asyncio
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.graph import app

async def main():
    print("Testing Trip Planner Graph...")
    initial_state = {"destination": "Bangalore"}
    
    try:
        result = await app.ainvoke(initial_state)
        print("\n--- Final Itinerary ---\n")
        print(result.get("final_itinerary", "No itinerary generated."))
        
        print("\n--- Debug Data ---\n")
        print(f"Weather: {result.get('weather', {}).get('current_weather', 'N/A')}")
        print(f"Places Found: {len(result.get('places', []))}")
        print(f"Route Calculated: {'Yes' if result.get('route') else 'No'}")
        
    except Exception as e:
        print(f"Error running graph: {e}")

if __name__ == "__main__":
    asyncio.run(main())
