import { Heart, MessageCircle, Share2, Flag, MoreHorizontal, Star, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
  author: string;
  authorAvatar?: string;
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  userLevel: number;
  isLiked?: boolean;
}

const PostCard = ({ 
  author, 
  authorAvatar, 
  timeAgo, 
  content, 
  image, 
  likes, 
  comments,
  userLevel,
  isLiked = false 
}: PostCardProps) => {
  const getLevelBadge = (level: number) => {
    if (level >= 15) return { 
      label: "Prefeito", 
      color: "bg-gradient-to-r from-yellow-400 to-amber-500",
      icon: <Star className="h-3 w-3 fill-current" />
    };
    if (level >= 10) return { 
      label: "Líder Comunitário", 
      color: "bg-gradient-sunset",
      icon: <Shield className="h-3 w-3" />
    };
    if (level >= 5) return { 
      label: "Cidadão Ativo", 
      color: "bg-gradient-city",
      icon: <Sparkles className="h-3 w-3" />
    };
    return { 
      label: "Visitante", 
      color: "bg-gradient-park",
      icon: null
    };
  };

  const levelBadge = getLevelBadge(userLevel);

  return (
    <Card className="shadow-card-soft hover:shadow-building transition-all duration-300 bg-white border-border/50">
      <CardHeader className="pb-3 border-b border-border/30">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={authorAvatar} alt={author} />
              <AvatarFallback className="bg-gradient-city text-white">
                {author.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-base">{author}</h4>
                <Badge className={`${levelBadge.color} text-white text-xs px-2.5 py-1 flex items-center gap-1 shadow-sm`}>
                  {levelBadge.icon}
                  {levelBadge.label} {userLevel}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Flag className="h-4 w-4 mr-2" />
                Denunciar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4">
        <p className="text-base leading-relaxed text-foreground">{content}</p>
        
        {image && (
          <div className="rounded-xl overflow-hidden bg-muted shadow-md">
            <img 
              src={image} 
              alt="Post content" 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="lg"
              className={`flex items-center gap-2 rounded-full px-4 transition-all ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
                  : 'hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-semibold">{likes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="flex items-center gap-2 hover:text-primary hover:bg-primary/10 rounded-full px-4"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">{comments}</span>
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="lg" 
            className="hover:text-secondary hover:bg-secondary/10 rounded-full px-4"
          >
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Compartilhar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;