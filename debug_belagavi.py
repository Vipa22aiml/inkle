import asyncio
import os
import sys
from dotenv import load_dotenv

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Load env vars
load_dotenv(dotenv_path="backend/.env")

from backend.tools.geocoding import get_coordinates
from backend.tools.places import search_attractions, search_restaurants

async def debug_belagavi():
    city = "Belagavi"
    print(f"--- Debugging for {city} ---")
    
    # 1. Test Geocoding
    print("\n1. Testing Geocoding...")
    coords = await get_coordinates(city)
    print(f"Coordinates: {coords}")
    
    if not coords:
        print("CRITICAL: Geocoding failed.")
        return

    lat = coords['lat']
    lon = coords['lon']

    # 2. Test Attractions (Foursquare)
    print(f"\n2. Testing Attractions (Foursquare) at {lat}, {lon}...")
    places = await search_attractions(lat, lon)
    print(f"Places Found: {len(places)}")
    for p in places:
        print(f" - {p['name']} ({p['address']})")

    # 3. Test Restaurants (Google)
    print(f"\n3. Testing Restaurants (Google) at {lat}, {lon}...")
    restaurants = await search_restaurants(lat, lon)
    print(f"Restaurants Found: {len(restaurants)}")
    for r in restaurants:
        print(f" - {r['name']} ({r['rating']} stars)")

if __name__ == "__main__":
    asyncio.run(debug_belagavi())
