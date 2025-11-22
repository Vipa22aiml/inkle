'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WeatherCard } from "./WeatherCard";
import { AttractionCard } from "./AttractionCard";
import { DiningCard } from "./DiningCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Map, Utensils } from "lucide-react";

interface ItineraryCardsProps {
    data: any;
    weather: any;
}

export function ItineraryCards({ data, weather }: ItineraryCardsProps) {
    if (!data) return null;

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Title Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border">
                <h1 className="text-2xl font-bold text-gray-900">{data.trip_title || "Your Trip"}</h1>
            </div>

            {/* Visual Weather Card */}
            <WeatherCard weather={weather} />

            {/* Weather Summary Text Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                    Weather Forecast 🌤️
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {data.weather_summary}
                </p>
            </div>

            <Tabs defaultValue="attractions" className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="attractions" className="gap-2"><Map className="w-4 h-4" /> Explore</TabsTrigger>
                    <TabsTrigger value="dining" className="gap-2"><Utensils className="w-4 h-4" /> Dining</TabsTrigger>
                    <TabsTrigger value="plan" className="gap-2"><Calendar className="w-4 h-4" /> Plan</TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1 pr-4 -mr-4">
                    <TabsContent value="attractions" className="space-y-4 mt-0">
                        <div className="grid gap-4">
                            {data.attractions?.map((place: any, idx: number) => (
                                <AttractionCard key={idx} attraction={place} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="dining" className="space-y-4 mt-0">
                        <div className="grid gap-4">
                            {data.dining?.map((place: any, idx: number) => (
                                <DiningCard key={idx} place={place} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="plan" className="space-y-4 mt-0">
                        {/* Costs Card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <DollarSign className="w-5 h-5 text-green-600" /> Estimated Costs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Transport</span>
                                        <span className="font-medium">{data.costs?.transport_estimate || "N/A"}</span>
                                    </div>
                                    <div className="pt-2 border-t flex justify-between font-bold text-lg">
                                        <span>Total Estimate</span>
                                        <span>{data.costs?.total_estimate || "N/A"}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Daily Plan */}
                        <div className="space-y-4">
                            {data.daily_plan?.map((day: any, idx: number) => (
                                <Card key={idx}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">Day {day.day}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                            {day.activities?.map((act: string, i: number) => (
                                                <li key={i}>{act}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </ScrollArea>
            </Tabs>
        </div>
    );
}
