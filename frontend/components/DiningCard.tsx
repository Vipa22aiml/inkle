import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Utensils, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Dining {
    name: string;
    description: string;
    cuisine: string;
    rating: number;
}

export function DiningCard({ place }: { place: Dining }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                            <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{place.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs font-normal">
                                    {place.cuisine}
                                </Badge>
                                <div className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                                    <Star className="w-3 h-3 fill-current" /> {place.rating}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-gray-600 text-sm">
                    {place.description}
                </CardDescription>
            </CardContent>
        </Card>
    );
}
