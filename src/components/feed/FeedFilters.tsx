import { Home, Users, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeedFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { 
    id: "all", 
    label: "Todos", 
    icon: Sparkles,
    count: 127,
    color: "text-primary"
  },
  { 
    id: "neighborhood", 
    label: "Minha Vizinhança", 
    icon: Home,
    count: 45,
    color: "text-secondary"
  },
  { 
    id: "friends", 
    label: "Amigos", 
    icon: Users,
    count: 23,
    color: "text-accent"
  },
  { 
    id: "events", 
    label: "Eventos", 
    icon: Calendar,
    count: 8,
    color: "text-purple-500"
  },
];

const FeedFilters = ({ activeFilter, onFilterChange }: FeedFiltersProps) => {
  return (
    <Card className="shadow-card-soft bg-white">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            
            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange(filter.id)}
                className={`
                  flex items-center gap-2 transition-all
                  ${isActive 
                    ? 'bg-gradient-city shadow-glow' 
                    : 'hover:bg-accent/10 hover:border-accent'
                  }
                `}
              >
                <Icon className={`h-4 w-4 ${!isActive && filter.color}`} />
                <span>{filter.label}</span>
                <Badge 
                  variant={isActive ? "secondary" : "outline"}
                  className={`ml-1 ${isActive ? 'bg-white/20 text-white border-0' : ''}`}
                >
                  {filter.count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedFilters;
