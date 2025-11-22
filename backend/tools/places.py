import httpx
import os
from typing import List, Dict, Any

async def search_attractions(lat: float, lon: float, limit: int = 5, query_context: str = None) -> List[Dict[str, Any]]:
    """
    Fetches top rated tourist attractions using Google Places API with a 3-step fallback strategy:
    1. 5km radius (City Center)
    2. 50km radius (Surrounding Region)
    3. Text Search (District/Region fallback)
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not api_key:
        print("Warning: GOOGLE_MAPS_API_KEY not found")
        return []

    nearby_url = "https://places.googleapis.com/v1/places:searchNearby"
    text_url = "https://places.googleapis.com/v1/places:searchText"
    
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.priceLevel,places.rating,places.userRatingCount,places.location,places.primaryType"
    }
    
    all_results = {} # Use dict for deduplication by ID

    async def fetch_nearby(radius: int):
        body = {
            "includedTypes": ["tourist_attraction", "museum", "historical_landmark", "park"],
            "maxResultCount": limit,
            "locationRestriction": {
                "circle": {
                    "center": {"latitude": lat, "longitude": lon},
                    "radius": radius
                }
            },
            "rankPreference": "POPULARITY"
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(nearby_url, headers=headers, json=body)
                response.raise_for_status()
                return response.json().get("places", [])
            except Exception as e:
                print(f"Google Places Nearby ({radius}m) error: {e}")
                if 'response' in locals():
                    print(f"Response: {response.text}")
                return []

    async def fetch_text(query: str):
        body = {
            "textQuery": query,
            "maxResultCount": limit
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(text_url, headers=headers, json=body)
                response.raise_for_status()
                return response.json().get("places", [])
            except Exception as e:
                print(f"Google Places Text Search ({query}) error: {e}")
                return []

    def process_places(places):
        for place in places:
            place_id = place.get("id") # Need 'places.id' in FieldMask
            if place_id and place_id not in all_results:
                all_results[place_id] = {
                    "name": place.get("displayName", {}).get("text"),
                    "address": place.get("formattedAddress"),
                    "rating": place.get("rating"),
                    "lat": place.get("location", {}).get("latitude"),
                    "lon": place.get("location", {}).get("longitude"),
                    "categories": [place.get("primaryType", "attraction")]
                }

    # Step 1: 5km Radius
    print("Searching 5km radius...")
    places_5km = await fetch_nearby(5000)
    process_places(places_5km)
    
    # Step 2: 50km Radius (if < 5 results)
    if len(all_results) < 5:
        print("Expanding to 50km radius...")
        places_50km = await fetch_nearby(50000)
        process_places(places_50km)

    # Step 3: Text Search (if < 5 results and context provided)
    if len(all_results) < 5 and query_context:
        print(f"Falling back to Text Search for: {query_context}...")
        query = f"top tourist attractions in {query_context}"
        places_text = await fetch_text(query)
        process_places(places_text)

    return list(all_results.values())[:limit]

async def search_restaurants(lat: float, lon: float, radius: int = 1000) -> List[Dict[str, Any]]:
    """
    Fetches nearby restaurants using Google Places API (New).
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not api_key:
        print("Warning: GOOGLE_MAPS_API_KEY not found")
        return []

    url = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.priceLevel,places.rating,places.userRatingCount,places.location"
    }
    
    body = {
        "includedTypes": ["restaurant"],
        "maxResultCount": 5,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": lat,
                    "longitude": lon
                },
                "radius": radius
            }
        }
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=body)
            response.raise_for_status()
            data = response.json()
            results = []
            for place in data.get("places", []):
                results.append({
                    "name": place.get("displayName", {}).get("text"),
                    "address": place.get("formattedAddress"),
                    "rating": place.get("rating"),
                    "price_level": place.get("priceLevel"),
                    "lat": place.get("location", {}).get("latitude"),
                    "lon": place.get("location", {}).get("longitude")
                })
            return results
        except Exception as e:
            print(f"Google Places error: {e}")
            return []
