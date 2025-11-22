import httpx
import os
from typing import Dict, Optional

async def get_coordinates(place_name: str) -> Optional[Dict[str, float]]:
    """
    Get latitude and longitude for a place name using Geoapify.
    """
    api_key = os.getenv("GEOAPIFY_KEY")
    if not api_key:
        print("Warning: GEOAPIFY_KEY not found")
        return None
        
    base_url = "https://api.geoapify.com/v1/geocode/search"
    params = {
        "text": place_name,
        "apiKey": api_key,
        "limit": 1
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(base_url, params=params)
            response.raise_for_status()
            data = response.json()
            if data["features"]:
                props = data["features"][0]["properties"]
                return {
                    "lat": props["lat"],
                    "lon": props["lon"],
                    "formatted": props["formatted"]
                }
            else:
                print(f"Geocoding: No results for '{place_name}'. Response: {data}")
                # Fallback: Try appending "India" if not present (simple heuristic for this user context)
                if "india" not in place_name.lower():
                    print(f"Geocoding: Retrying with '{place_name}, India'...")
                    params["text"] = f"{place_name}, India"
                    response = await client.get(base_url, params=params)
                    data = response.json()
                    if data["features"]:
                        props = data["features"][0]["properties"]
                        return {
                            "lat": props["lat"],
                            "lon": props["lon"],
                            "formatted": props["formatted"]
                        }
                return None
        except Exception as e:
            print(f"Geocoding error: {e}")
            return None
    return None
