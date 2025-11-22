# Project Handoff: AI Tourist Planner

## 1. Project Overview
A multi-agent web application that generates personalized travel itineraries.
- **Goal**: Plan trips with real-time weather, attractions, dining, and optimized routes.
- **Current Status**: Fully functional MVP.

## 2. Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion, React Leaflet.
- **Backend**: Python 3.12, FastAPI, FastMCP, LangGraph.
- **AI**: Google Gemini 2.0 Flash (`gemini-2.0-flash`).
- **Orchestration**: LangGraph (StateGraph with nodes for Geocoding, Weather, Places, Routing, Cost).

## 3. APIs & Services
| Service | Purpose | Key Env Var | Status |
| :--- | :--- | :--- | :--- |
| **Google Gemini** | LLM (Planner/Synthesizer) | `GOOGLE_API_KEY` | Working |
| **Google Places** | Attractions & Restaurants | `GOOGLE_MAPS_API_KEY` | Working (Replaced Foursquare) |
| **Google Routes** | Route Optimization | `GOOGLE_MAPS_API_KEY` | Working |
| **Geoapify** | Geocoding (City -> Lat/Lon) | `GEOAPIFY_KEY` | Working |
| **Open-Meteo** | Weather Forecast | N/A | Working |

## 4. Key Files
- **Backend Entry**: `backend/server.py` (FastAPI wrapper around FastMCP).
- **Workflow Logic**: `backend/graph.py` (LangGraph definition).
- **Tools**: `backend/tools/` (`geocoding.py`, `weather.py`, `places.py`, `routing.py`, `costs.py`).
- **Frontend Page**: `frontend/app/page.tsx` (Main UI).
- **Map Component**: `frontend/components/MapComponent.tsx` (Leaflet logic).

## 5. Recent Changes & Fixes
1.  **API Switch**: Replaced Foursquare with **Google Places API** in `places.py` due to 410 Gone error.
2.  **Map Fixes**:
    - Added `RecenterAutomatically` to fix map getting stuck on London.
    - Implemented **Numbered Markers** (1, 2, 3...) to match the itinerary.
3.  **AI Robustness**: Updated `graph.py` prompt to prevent hallucinations when data is missing.
4.  **Spelling Handling**: Confirmed "Belagavi" works; added fallback logic in geocoder.

## 6. How to Run
### Backend (Port 8000)
```bash
cd /Users/viraatmpaldar/Desktop/inkle
source venv/bin/activate  # If using venv
python3 -m backend.server
```

### Frontend (Port 3000)
```bash
cd /Users/viraatmpaldar/Desktop/inkle/frontend
npm run dev
```

## 7. Known Issues / Notes
- **Foursquare Key**: The `FOURSQUARE_API_KEY` in `.env` is currently unused since we switched to Google.
- **FastMCP**: We are running it via a FastAPI wrapper (`server.py`) to expose HTTP endpoints for the web app, rather than using the native MCP transport (which is for IDEs).

## 8. Next Steps (for New Chat)
- **Deployment**: Dockerize the application.
- **Features**: Add Hotel search (Amadeus/Google), PDF Export, User Accounts.
- **Testing**: Add unit tests for the graph nodes.
