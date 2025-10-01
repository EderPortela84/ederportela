import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'
import type { Friend } from './types'

interface FriendCardProps {
  friend: Friend
}

export function FriendCard({ friend }: FriendCardProps) {
  return (
    <Link to={`/casa/${friend.id}`}>
      <Card className="group hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={friend.avatar_url || `https://avatar.vercel.sh/${friend.id}`} 
                  alt={friend.name}
                />
                <AvatarFallback>
                  {friend.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {friend.online && (
                <Badge 
                  className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"
                  variant="secondary"
                />
              )}
            </div>

            <div className="text-center space-y-1.5">
              <p className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                {friend.name}
              </p>
              
              <div className="flex flex-wrap gap-1 justify-center">
                {friend.is_best_friend && (
                  <Badge 
                    variant="secondary" 
                    className="animate-pulse"
                    title={`Score de interação: ${friend.interaction_score}`}
                  >
                    ⭐
                  </Badge>
                )}
                {friend.mutual_friends > 0 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    title={`${friend.mutual_friends} amigos em comum`}
                  >
                    {friend.mutual_friends} 👥
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}