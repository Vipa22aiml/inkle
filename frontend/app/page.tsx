'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useMCP } from '@/lib/useMCP';
import ItineraryView from '@/components/ItineraryView';
import { ItineraryCards } from '@/components/ItineraryCards';
import { Chatbot } from '@/components/Chatbot';
import { Search, Map as MapIcon, Loader2, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamically import Map to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />
});

export default function Home() {
  const [destination, setDestination] = useState('');
  const { planTrip, result, loading, error } = useMCP();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      planTrip(destination);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-gray-900 font-sans selection:bg-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden pb-12">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-600 to-indigo-900 opacity-10 -z-10 rounded-b-[3rem]" />

        <div className="container mx-auto px-4 pt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
              Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Perfect Trip</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              AI-powered itineraries, real-time weather, and optimized routes.
              Just type a city and let us handle the rest.
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-200" />
            <div className="relative flex items-center bg-white rounded-full shadow-xl p-2 pl-6 border border-gray-100">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where do you want to go? (e.g., Paris, Tokyo)"
                className="flex-1 bg-transparent outline-none text-lg placeholder:text-gray-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !destination}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plane className="w-5 h-5" />}
                {loading ? 'Planning...' : 'Go'}
              </button>
            </div>
          </motion.form>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg max-w-md mx-auto border border-red-100 text-sm"
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <>
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[800px]">
              {/* Left: Itinerary & Details (Scrollable) */}
              <div className="lg:col-span-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar h-full">
                {result.structured_itinerary ? (
                  <ItineraryCards data={result.structured_itinerary} weather={result.weather} />
                ) : (
                  <ItineraryView data={result} />
                )}
              </div>

              {/* Right: Map (Sticky/Fixed) */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative h-full">
                <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-xs font-bold text-gray-500 flex items-center gap-2">
                  <MapIcon className="w-4 h-4" /> Interactive Map
                </div>
                <MapComponent
                  places={result.places || []}
                  restaurants={result.restaurants || []}
                  route={result.route}
                  center={
                    result.coordinates
                      ? { lat: result.coordinates.lat, lon: result.coordinates.lon }
                      : result.places?.[0]
                        ? { lat: result.places[0].lat, lon: result.places[0].lon }
                        : null
                  }
                />
              </div>
            </div>
          </div>

          {/* Chatbot */}
          {result.structured_itinerary && (
            <Chatbot context={result.structured_itinerary} />
          )}
        </>
      )}
    </main>
  );
}
