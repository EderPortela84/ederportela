import { useState } from "react";
import { Image, MapPin, Users, Lock, Globe, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");

  const getVisibilityIcon = (type: string) => {
    switch (type) {
      case "public": return <Globe className="h-4 w-4" />;
      case "friends": return <Users className="h-4 w-4" />;
      case "private": return <Lock className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Card className="shadow-card-soft bg-white border-border/50">
      <CardContent className="pt-6">
        <div className="flex space-x-3">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarImage src="" alt="Sua Casa" />
            <AvatarFallback className="bg-gradient-sunset text-white text-lg">MC</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="O que está acontecendo na sua vizinhança?"
              className="min-h-[100px] resize-none border-2 bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="default" 
                  className="flex items-center gap-2 hover:bg-muted hover:border-primary hover:text-primary transition-all"
                >
                  <Type className="h-5 w-5" />
                  <span className="font-medium">Texto</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="default" 
                  className="flex items-center gap-2 hover:bg-muted hover:border-secondary hover:text-secondary transition-all"
                >
                  <Image className="h-5 w-5" />
                  <span className="font-medium">Foto</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="default" 
                  className="flex items-center gap-2 hover:bg-muted hover:border-accent hover:text-accent transition-all"
                >
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">Local</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger className="w-32 h-8">
                    <div className="flex items-center space-x-1">
                      {getVisibilityIcon(visibility)}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Público</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="friends">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Amigos</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Privado</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  size="lg"
                  className="bg-gradient-city text-white hover:shadow-glow font-semibold px-8"
                  disabled={!content.trim()}
                >
                  Publicar na Praça
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;