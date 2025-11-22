# 🌍 Inkle - AI-Powered Travel Itinerary Planner

An intelligent travel planning application that generates personalized trip itineraries using AI agents, real-time data, and interactive maps.

## 📸 Preview

![Inkle App - Paris Itinerary](./screenshots/Screenshot%202025-11-23%20at%203.12.20%20AM.png)

*AI-generated 3-day Paris itinerary with interactive map, weather forecasts, and optimized routes*

---

![Project Banner](https://img.shields.io/badge/Status-Active-success) ![Python](https://img.shields.io/badge/Python-3.11+-blue) ![Next.js](https://img.shields.io/badge/Next.js-16.0-black) ![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [API Keys Setup](#-api-keys-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Future Enhancements](#-future-enhancements)

---

## ✨ Features

- 🤖 **AI-Powered Itinerary Generation** - Uses Google Gemini to create personalized travel plans
- 🗺️ **Interactive Map** - Visualize attractions, restaurants, and optimized routes
- 🌤️ **Real-Time Weather** - Get weather forecasts for your destination
- 🍽️ **Restaurant Recommendations** - Discover top-rated dining options
- 🚗 **Route Optimization** - Optimized travel routes using Google Routes API
- 💬 **AI Chatbot** - Ask questions about your itinerary
- 📱 **Responsive UI** - Beautiful, modern interface built with Next.js and Tailwind CSS

---

## 🛠️ Tech Stack

### **Backend**
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Python** | Core language | 3.11+ |
| **FastAPI** | Web framework for HTTP endpoints | Latest |
| **FastMCP** | Model Context Protocol server | Latest |
| **LangGraph** | Agent orchestration framework | Latest |
| **LangChain** | LLM integration | Latest |
| **Google Gemini** | Large Language Model | gemini-2.0-flash-exp |
| **Uvicorn** | ASGI server | Latest |

### **Frontend**
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js** | React framework | 16.0.3 |
| **React** | UI library | 19.2.0 |
| **TypeScript** | Type safety | 5.x |
| **Tailwind CSS** | Styling | 4.x |
| **Shadcn UI** | Component library | Latest |
| **Leaflet** | Interactive maps | 1.9.4 |
| **Framer Motion** | Animations | 12.23.24 |
| **Lucide React** | Icons | Latest |

### **APIs Used**
- **Geoapify** - Geocoding and place search
- **Open-Meteo** - Weather forecasts
- **Foursquare** - Attraction and restaurant data
- **Google Routes API** - Route optimization
- **Google Gemini API** - AI-powered content generation

---

## 🏗️ Architecture

The application uses a **multi-agent architecture** powered by LangGraph:

```
┌─────────────────────────────────────────────────────────────┐
│                        User Input                            │
│                    (Destination Name)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              LangGraph Agent Workflow                 │  │
│  │                                                       │  │
│  │  1. Geocoder Node      → Get coordinates             │  │
│  │  2. Weather Node       → Fetch weather forecast      │  │
│  │  3. Places Node        → Search attractions/restaurants│ │
│  │  4. Route Node         → Optimize travel route       │  │
│  │  5. Cost Node          → Estimate travel costs       │  │
│  │  6. Synthesizer Node   → Generate AI itinerary       │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
│  - Interactive Map (Leaflet)                                │
│  - Itinerary Cards (Shadcn UI)                              │
│  - AI Chatbot                                               │
└─────────────────────────────────────────────────────────────┘
```

### **Agent Workflow Explained**

The backend uses **LangGraph** to orchestrate a series of specialized agents:

1. **Geocoder Agent** - Converts destination name to coordinates
2. **Weather Agent** - Fetches 3-day weather forecast
3. **Places Agent** - Searches for attractions and restaurants (50km radius with fallback)
4. **Route Agent** - Calculates optimized route using Google Routes API
5. **Cost Agent** - Estimates travel costs
6. **Synthesizer Agent** - Uses Google Gemini to generate a structured JSON itinerary

Each agent is a **node** in the graph, and they execute sequentially, passing state between them.

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **pnpm** - Comes with Node.js

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/inkle.git
cd inkle
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
# or
pnpm install
```

---

## 🔑 API Keys Setup

You'll need to obtain API keys from the following services:

### **Required API Keys**

| Service | Purpose | Get API Key |
|---------|---------|-------------|
| **Google Gemini** | AI itinerary generation | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| **Geoapify** | Geocoding & place search | [Geoapify](https://www.geoapify.com/) |
| **Foursquare** | Attraction & restaurant data | [Foursquare Developers](https://foursquare.com/developers/) |
| **Google Routes API** | Route optimization | [Google Cloud Console](https://console.cloud.google.com/) |

### **Setup Instructions**

1. Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

2. Add your API keys to the `.env` file:

```env
# Google Gemini API Key
GOOGLE_API_KEY=your_gemini_api_key_here

# Geoapify API Key
GEOAPIFY_API_KEY=your_geoapify_api_key_here

# Foursquare API Key
FOURSQUARE_API_KEY=your_foursquare_api_key_here

# Google Routes API Key (from Google Cloud Console)
GOOGLE_ROUTES_API_KEY=your_google_routes_api_key_here
```

### **How to Get Each API Key**

#### **1. Google Gemini API Key**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` file

#### **2. Geoapify API Key**
1. Go to [Geoapify](https://www.geoapify.com/)
2. Sign up for a free account
3. Navigate to "My Projects" → "API Keys"
4. Copy your API key

#### **3. Foursquare API Key**
1. Go to [Foursquare Developers](https://foursquare.com/developers/)
2. Create a new app
3. Copy your API key from the app dashboard

#### **4. Google Routes API Key**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Routes API**
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key

---

## 🏃 Running the Application

### **1. Start the Backend Server**

```bash
# From the backend directory
cd backend
python -m backend.server
```

The backend will start on `http://localhost:8000`

### **2. Start the Frontend Server**

```bash
# From the frontend directory (in a new terminal)
cd frontend
npm run dev
# or
pnpm dev
```

The frontend will start on `http://localhost:3000`

### **3. Access the Application**

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📁 Project Structure

```
inkle/
├── backend/
│   ├── tools/
│   │   ├── geocoding.py       # Geoapify geocoding
│   │   ├── weather.py         # Open-Meteo weather API
│   │   ├── places.py          # Foursquare places search
│   │   ├── routing.py         # Google Routes API
│   │   └── costs.py           # Cost estimation
│   ├── graph.py               # LangGraph agent workflow
│   ├── server.py              # FastAPI + FastMCP server
│   ├── llm_factory.py         # Google Gemini LLM setup
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # API keys (not in repo)
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Main page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── MapComponent.tsx   # Leaflet map
│   │   ├── ItineraryCards.tsx # Itinerary display
│   │   ├── Chatbot.tsx        # AI chatbot
│   │   └── ui/                # Shadcn UI components
│   ├── lib/
│   │   └── useMCP.ts          # API client hook
│   └── package.json           # Node dependencies
│
└── README.md
```

---

## 🧠 How It Works

### **1. User Input**
User enters a destination (e.g., "Paris", "Tokyo", "Mysore")

### **2. Agent Workflow Execution**

The LangGraph workflow executes the following nodes sequentially:

```python
# Simplified workflow
workflow = StateGraph(AgentState)

workflow.add_node("geocoder", geocode_node)           # Get coordinates
workflow.add_node("fetch_weather", weather_node)      # Fetch weather
workflow.add_node("fetch_places", places_node)        # Search attractions
workflow.add_node("calculate_route", route_node)      # Optimize route
workflow.add_node("calculate_cost", cost_node)        # Estimate costs
workflow.add_node("synthesizer", synthesizer_node)    # Generate itinerary

workflow.set_entry_point("geocoder")
workflow.add_edge("geocoder", "fetch_weather")
workflow.add_edge("fetch_weather", "fetch_places")
workflow.add_edge("fetch_places", "calculate_route")
workflow.add_edge("calculate_route", "calculate_cost")
workflow.add_edge("calculate_cost", "synthesizer")
workflow.add_edge("synthesizer", END)
```

### **3. AI Synthesis**

The **Synthesizer Node** uses Google Gemini to:
- Analyze all gathered data (weather, places, routes, costs)
- Generate a structured JSON itinerary
- Create day-by-day plans with activities
- Provide descriptions for each attraction

### **4. Frontend Rendering**

The Next.js frontend:
- Displays itinerary in beautiful cards
- Renders an interactive Leaflet map with markers
- Shows optimized route as a polyline
- Provides an AI chatbot for questions

---

## 🔮 Future Enhancements

- [ ] **Hotel Search** - Integrate Amadeus or Google Hotels API
- [ ] **PDF Export** - Download itinerary as PDF
- [ ] **User Accounts** - Save and manage multiple trips
- [ ] **Docker Deployment** - Containerize the application
- [ ] **Multi-day Itineraries** - Support for longer trips
- [ ] **Budget Customization** - Filter by budget preferences

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **LangGraph** for the agent orchestration framework
- **FastMCP** for the Model Context Protocol implementation
- **Google Gemini** for AI-powered content generation
- **Shadcn UI** for beautiful React components
- **Leaflet** for interactive maps

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Happy Travels! 🌍✈️**
