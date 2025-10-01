import { MessageCircle, Heart, UserPlus, TrendingUp, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FeedNotificationProps {
  type: "comment" | "like" | "follow" | "trending";
  message: string;
  onDismiss?: () => void;
}

const FeedNotification = ({ type, message, onDismiss }: FeedNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const getIcon = () => {
    switch (type) {
      case "comment":
        return <MessageCircle className="h-5 w-5 text-primary" />;
      case "like":
        return <Heart className="h-5 w-5 text-red-500 fill-current" />;
      case "follow":
        return <UserPlus className="h-5 w-5 text-secondary" />;
      case "trending":
        return <TrendingUp className="h-5 w-5 text-accent" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case "comment":
        return "from-primary/10 to-transparent border-l-primary";
      case "like":
        return "from-red-500/10 to-transparent border-l-red-500";
      case "follow":
        return "from-secondary/10 to-transparent border-l-secondary";
      case "trending":
        return "from-accent/10 to-transparent border-l-accent";
    }
  };

  if (!isVisible) return null;

  return (
    <Card className={`shadow-card-soft bg-gradient-to-r ${getGradient()} border-l-4 animate-slide-up`}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <p className="text-sm font-medium">{message}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedNotification;
