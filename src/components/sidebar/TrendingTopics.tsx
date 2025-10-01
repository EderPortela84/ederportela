import { TrendingUp, Hash, Calendar, Wrench, Music, Shield, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockTrends = [
  { id: 1, topic: "NovaFeira", posts: 127, category: "Eventos", color: "text-blue-500", bgColor: "bg-blue-50", icon: Calendar },
  { id: 2, topic: "ReformaPraça", posts: 89, category: "Urbanismo", color: "text-orange-500", bgColor: "bg-orange-50", icon: Wrench },
  { id: 3, topic: "FestivalVerão", posts: 234, category: "Cultura", color: "text-purple-500", bgColor: "bg-purple-50", icon: Music },
  { id: 4, topic: "SegurançaBairro", posts: 67, category: "Segurança", color: "text-red-500", bgColor: "bg-red-50", icon: Shield },
  { id: 5, topic: "ReciclagemLocal", posts: 45, category: "Sustentabilidade", color: "text-green-500", bgColor: "bg-green-50", icon: Leaf },
];

const TrendingTopics = () => {
  return (
    <Card className="shadow-card-soft bg-white border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          <span>Tendências na Cidade</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockTrends.map((trend, index) => {
          const TrendIcon = trend.icon;
          return (
            <div 
              key={trend.id}
              className={`flex items-center justify-between p-3 rounded-xl hover:${trend.bgColor} cursor-pointer transition-all group border border-transparent hover:border-${trend.color.replace('text-', 'border-')}`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`flex items-center justify-center w-10 h-10 ${trend.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
                  <TrendIcon className={`h-5 w-5 ${trend.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    <span className={`font-semibold text-sm group-hover:${trend.color} transition-colors`}>
                      {trend.topic}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${trend.color} border-current`}
                    >
                      {trend.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">
                      {trend.posts} posts
                    </span>
                  </div>
                </div>
              </div>
              <div className={`flex items-center justify-center w-6 h-6 ${trend.bgColor} rounded-full`}>
                <span className={`text-xs font-bold ${trend.color}`}>#{index + 1}</span>
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Tendências baseadas na sua vizinhança
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;