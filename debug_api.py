import os
import google.generativeai as genai
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")

def list_gemini_models():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("No Google API Key found.")
        return
    
    genai.configure(api_key=api_key)
    print("\n--- Available Gemini Models ---")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e:
        print(f"Error listing models: {e}")

async def test_foursquare():
    api_key = os.getenv("FOURSQUARE_API_KEY")
    if not api_key:
        print("No Foursquare Key found.")
        return

    print("\n--- Testing Foursquare API ---")
    url = "https://api.foursquare.com/v3/places/search"
    headers = {
        "Authorization": api_key,
        "Accept": "application/json"
    }
    params = {
        "ll": "12.9716,77.5946",
        "limit": 1
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, params=params)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text[:200]}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    list_gemini_models()
    asyncio.run(test_foursquare())
