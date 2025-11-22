# Implementation Plan - Tourist Planner Web App (FastMCP + LangGraph + Gemini)

## Goal Description
Build a premium "Tourist Planner" web application.
**Architecture**: MCP Server (FastMCP) + LangGraph Orchestration + **Google Gemini LLM**.
**Frontend**: Next.js.

## Tech Stack
- **LLM**: Google Gemini (Flash/Pro) via `langchain-google-genai`.
- **Server**: `FastMCP` (Python).
- **Orchestration**: `LangGraph`.
- **APIs**: Open-Meteo, Geoapify, Foursquare, Google Suite.

## Architecture Design

### 1. Modular LLM Layer (`backend/llm_factory.py`)
- **Purpose**: Abstract the LLM implementation to allow easy switching (e.g., Gemini -> OpenAI -> Anthropic).
- **Function**: `get_llm(model_name: str = "gemini-1.5-flash")`.
- **Integration**: Used by LangGraph nodes to process natural language and make decisions.

### 2. MCP Server (`backend/server.py`)
- Exposes **Atomic Tools** (Weather, Places, etc.).
- Exposes **Workflow Tool** (`plan_full_trip`).

### 3. LangGraph Workflow (`backend/graph.py`)
- **State**: `AgentState` (TypedDict).
- **Nodes**:
    - `planner_node`: **Uses Gemini** to break down the user request and decide parameters.
    - `tool_nodes`: Execute specific tools (Weather, Places, etc.).
    - `synthesizer_node`: **Uses Gemini** to generate the final natural language itinerary from the raw data.

## Detailed Components

### Backend Structure
- `backend/llm_factory.py`: LLM configuration.
- `backend/server.py`: FastMCP server.
- `backend/graph.py`: LangGraph definition.
- `backend/tools/`: Atomic tool implementations.

## Configuration (`.env`)
- `GOOGLE_API_KEY`: For Gemini.
- `GEOAPIFY_KEY`: For Geocoding.
- `FOURSQUARE_API_KEY`: For Attractions.
- `GOOGLE_MAPS_API_KEY`: For Routes/Places/Transit.

## Verification
1.  **Test LLM**: Verify `get_llm()` returns a working Gemini instance.
2.  **Test Workflow**: Verify Gemini correctly interprets "Rome" and calls the right tools.
