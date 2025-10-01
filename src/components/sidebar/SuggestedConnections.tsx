import { UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockSuggestions = [
  { 
    id: 1, 
    name: "Casa Amarela", 
    avatar: "", 
    mutualFriends: 5,
    level: 7,
    bio: "Amante de jardinagem e culinária"
  },
  { 
    id: 2, 
    name: "Loft Moderno", 
    avatar: "", 
    mutualFriends: 3,
    level: 9,
    bio: "Designer e fotógrafo urbano"
  },
  { 
    id: 3, 
    name: "Vila Serena", 
    avatar: "", 
    mutualFriends: 8,
    level: 11,
    bio: "Organizador de eventos comunitários"
  },
];

const SuggestedConnections = () => {
  return (
    <Card className="shadow-card-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Users className="h-5 w-5 text-secondary" />
          <span>Sugestões de Conexões</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockSuggestions.map((user) => (
          <div key={user.id} className="space-y-3 pb-4 border-b last:border-0 last:pb-0">
            <div className="flex items-start space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-secondary/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-park text-white">
                  {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <Badge variant="outline" className="text-xs">
                    Nv. {user.level}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {user.bio}
                </p>
                <p className="text-xs text-secondary font-medium mt-1 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {user.mutualFriends} amigos em comum
                </p>
              </div>
            </div>
            
            <Button 
              size="sm" 
              className="w-full bg-gradient-park hover:shadow-glow"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Conectar
            </Button>
          </div>
        ))}
        
        <Button variant="outline" className="w-full text-sm mt-2">
          Ver mais sugestões
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuggestedConnections;
