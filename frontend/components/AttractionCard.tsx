import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Attraction {
    name: string;
    description: string;
    rating: number;
    visit_order: number;
}

export function AttractionCard({ attraction }: { attraction: Attraction }) {
    return (
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold shrink-0">
                            {attraction.visit_order}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{attraction.name}</CardTitle>
                            <div className="flex items-center gap-1 text-yellow-500 mt-1">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-medium text-gray-700">{attraction.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-gray-600 line-clamp-3">
                    {attraction.description}
                </CardDescription>
            </CardContent>
        </Card>
    );
}
