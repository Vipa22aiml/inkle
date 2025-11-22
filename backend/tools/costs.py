import httpx
import os
from typing import List, Dict, Any

async def estimate_travel_costs(origins: List[Dict], destinations: List[Dict]) -> Dict[str, Any]:
    """
    Calculate travel costs/times using Google Distance Matrix.
    Note: This is a simplified estimation.
    """
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not api_key:
        return {}

    # Google Distance Matrix API (Legacy or New)
    # Using the new Routes API Matrix for better features if possible, 
    # but standard Distance Matrix is simpler for N x M.
    
    # Let's use the standard REST API for simplicity
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    
    origins_str = "|".join([f"{loc['lat']},{loc['lon']}" for loc in origins])
    destinations_str = "|".join([f"{loc['lat']},{loc['lon']}" for loc in destinations])
    
    params = {
        "origins": origins_str,
        "destinations": destinations_str,
        "mode": "transit", # Check transit first
        "key": api_key
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Distance Matrix error: {e}")
            return {}
