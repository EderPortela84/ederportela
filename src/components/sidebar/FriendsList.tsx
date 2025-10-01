import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const mockFriends = [
  { id: 1, name: "Casa do João", avatar: "", online: true, level: 8 },
  { id: 2, name: "Vila da Maria", avatar: "", online: false, level: 12 },
  { id: 3, name: "Lar do Pedro", avatar: "", online: true, level: 5 },
  { id: 4, name: "Cantinho da Ana", avatar: "", online: true, level: 15 },
  { id: 5, name: "Residência Silva", avatar: "", online: false, level: 3 },
];

const FriendsList = () => {
  return (
    <Card className="shadow-card-soft bg-white border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>Vizinhança</span>
            <Badge variant="secondary" className="bg-gradient-park text-white">
              {mockFriends.filter(f => f.online).length} online
            </Badge>
          </CardTitle>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockFriends.map((friend) => (
          <div key={friend.id} className="flex items-center space-x-3 group">
            <div className="relative">
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarImage src={friend.avatar} alt={friend.name} />
                <AvatarFallback className="bg-gradient-city text-white text-xs">
                  {friend.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {friend.online && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{friend.name}</p>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-muted-foreground">
                  {friend.online ? "Online" : "Offline"}
                </p>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-xs text-muted-foreground">Nv. {friend.level}</p>
              </div>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-xs"
            >
              Visitar
            </Button>
          </div>
        ))}
        
        <Button variant="outline" className="w-full mt-4 text-sm">
          Ver todos os vizinhos
        </Button>
      </CardContent>
    </Card>
  );
};

export default FriendsList;