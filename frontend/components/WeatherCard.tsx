import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";

interface WeatherData {
    current_weather?: {
        temperature: number;
        windspeed: number;
        weathercode: number;
    };
    daily?: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_probability_max: number[];
    };
}

export function WeatherCard({ weather }: { weather: WeatherData }) {
    if (!weather || !weather.current_weather) return null;

    const current = weather.current_weather;
    const todayMax = weather.daily?.temperature_2m_max[0];
    const todayMin = weather.daily?.temperature_2m_min[0];

    return (
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <Cloud className="w-5 h-5" /> Current Weather
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-4xl font-bold">{current.temperature}°C</div>
                        <div className="text-blue-100 mt-1 flex items-center gap-2">
                            <Wind className="w-4 h-4" /> {current.windspeed} km/h
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-semibold">{todayMax}° / {todayMin}°</div>
                        <div className="text-blue-100 text-sm">Today</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
