import { useState, useEffect } from 'react';

export interface ItineraryResult {
  destination: string;
  coordinates?: { lat: number; lon: number; formatted?: string };
  final_itinerary: string;
  structured_itinerary?: any; // New structured data
  weather?: any;
  places?: any[];
  restaurants?: any[];
  route?: any;
  costs?: any;
}

export const useMCP = () => {
  const [result, setResult] = useState<ItineraryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const planTrip = async (destination: string) => {
    setLoading(true);
    setError(null);
    setLogs([]);
    setResult(null);

    try {
      // In a real MCP setup, we'd connect to the SSE stream.
      // For this web app, we'll use a simple API route proxy or direct fetch if CORS allows.
      // Since FastMCP runs on a port (e.g., 8000), we can fetch from it.
      // However, FastMCP's default SSE transport is for MCP clients (Claude/Cursor).
      // We might need to expose a simple HTTP endpoint in our server.py for the web app.

      // Let's assume we modify server.py to expose a standard HTTP endpoint or use a proxy.
      // For now, I will implement a mock fetch that calls our backend server if it were exposing HTTP.

      // ACTUALLY: FastMCP is designed for MCP clients. 
      // To make it work with a Web UI easily, we should add a standard FastAPI route to server.py
      // that invokes the tool.

      // Use environment variable for API URL, fallback to localhost for development
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/plan_trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { planTrip, result, loading, error, logs };
};
