import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mockRanking = [
  { id: 1, name: "Cantinho da Ana", avatar: "", points: 892, badge: "🥇" },
  { id: 2, name: "Vila da Maria", avatar: "", points: 756, badge: "🥈" },
  { id: 3, name: "Casa do João", avatar: "", points: 634, badge: "🥉" },
  { id: 4, name: "Lar do Pedro", avatar: "", points: 521, badge: "" },
  { id: 5, name: "Residência Silva", avatar: "", points: 489, badge: "" },
];

const WeeklyRanking = () => {
  const getRankIcon = (position: number) => {
    switch(position) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-500" />;
      default: return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="shadow-card-soft bg-gradient-to-br from-white to-accent/5 border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-accent" />
          <span>🏆 Top Cidadãos da Semana</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockRanking.map((user, index) => (
          <div 
            key={user.id}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              index < 3 
                ? 'bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-accent' 
                : 'hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(index + 1)}
            </div>
            
            <Avatar className={`h-10 w-10 ${index < 3 ? 'ring-2 ring-accent' : 'ring-1 ring-border'}`}>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className={index < 3 ? "bg-gradient-sunset text-white" : "bg-muted"}>
                {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                {user.badge && <span className="text-lg">{user.badge}</span>}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.points} pontos
              </p>
            </div>
          </div>
        ))}
        
        <div className="pt-3 border-t">
          <p className="text-xs text-center text-muted-foreground">
            🎯 Ganhe pontos contribuindo com a comunidade!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyRanking;
