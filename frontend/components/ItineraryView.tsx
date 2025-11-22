'use client';

import { motion } from 'framer-motion';
import { Cloud, MapPin, Utensils, DollarSign, Navigation } from 'lucide-react';

interface ItineraryViewProps {
    data: any;
}

export default function ItineraryView({ data }: ItineraryViewProps) {
    if (!data) return null;

    const { weather, places, restaurants, costs, final_itinerary } = data;

    return (
        <div className="space-y-8 p-6 bg-white/50 backdrop-blur-md rounded-3xl shadow-xl border border-white/20">
            {/* Weather Card */}
            {weather && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Cloud className="w-6 h-6" /> Current Weather
                            </h3>
                            <p className="text-4xl font-bold mt-2">
                                {weather.current?.temperature_2m ?? '--'}°C
                            </p>
                            <p className="opacity-80">Wind: {weather.current?.wind_speed_10m ?? '--'} km/h</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium">Forecast</p>
                            <div className="flex gap-2 mt-2">
                                {weather.daily?.temperature_2m_max?.slice(0, 3).map((temp: number, i: number) => (
                                    <div key={i} className="bg-white/20 px-3 py-1 rounded-lg text-center">
                                        <div className="text-xs">Day {i + 1}</div>
                                        <div className="font-bold">{temp}°</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* AI Itinerary Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose prose-blue max-w-none bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4">
                    <Navigation className="w-5 h-5 text-blue-500" /> AI Travel Plan
                </h3>
                <div className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">
                    {final_itinerary}
                </div>
            </motion.div>

            {/* Places Grid */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" /> Top Attractions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {places?.map((place: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="font-bold text-gray-800">{place.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{place.address}</div>
                            <div className="flex gap-1 mt-2 flex-wrap">
                                {place.categories?.map((cat: string, j: number) => (
                                    <span key={j} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Restaurants Grid */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-orange-500" /> Nearby Dining
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {restaurants?.map((place: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                        >
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-gray-800">{place.name}</div>
                                <div className="text-xs font-bold text-orange-500">★ {place.rating}</div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{place.address}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Costs */}
            {costs && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg"
                >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-400" /> Estimated Travel Costs
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/10 p-3 rounded-lg">
                            <div className="opacity-60 text-xs">Walking Distance</div>
                            <div className="font-bold text-lg">~5 km</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg">
                            <div className="opacity-60 text-xs">Transit Cost</div>
                            <div className="font-bold text-lg">$5 - $10</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg">
                            <div className="opacity-60 text-xs">Taxi Estimate</div>
                            <div className="font-bold text-lg">$25 - $40</div>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg">
                            <div className="opacity-60 text-xs">Total Time</div>
                            <div className="font-bold text-lg">~45 mins</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
