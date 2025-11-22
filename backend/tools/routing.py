import httpx
import os
from typing import List, Dict, Any

async def calculate_route(locations: List[Dict[str, float]]) -> Dict[str, Any]:
    """
    Optimizes route for a list of locations using Google Routes API.
    Input: List of dicts with 'lat' and 'lon'.
    First location is origin, last is destination (or round trip).
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not api_key or len(locations) < 2:
        return {}

    url = "https://routes.googleapis.com/directions/v2:computeRoutes"
    
    origin = locations[0]
    destination = locations[-1]
    intermediates = locations[1:-1]
    
    body = {
        "origin": {
            "location": {
                "latLng": {"latitude": origin["lat"], "longitude": origin["lon"]}
            }
        },
        "destination": {
            "location": {
                "latLng": {"latitude": destination["lat"], "longitude": destination["lon"]}
            }
        },
        "intermediates": [
            {"location": {"latLng": {"latitude": loc["lat"], "longitude": loc["lon"]}}}
            for loc in intermediates
        ],
        "travelMode": "DRIVE",
        "optimizeWaypointOrder": True, # Enable TSP
        "routingPreference": "TRAFFIC_AWARE",
        "computeAlternativeRoutes": False
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.optimizedIntermediateWaypointIndex"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=body)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Google Routes error: {e}")
            return {}
