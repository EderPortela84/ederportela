import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users } from "lucide-react"
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { fetchFriends } from '@/services/friends'
import type { Friend } from "./types"

export function ListaAmigos() {
  const { userId } = useParams()
  const { toast } = useToast()
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function loadFriends() {
      try {
        if (!userId) return
        const friendsList = await fetchFriends(userId)
        setFriends(friendsList)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar amigos",
          description: "Não foi possível carregar a lista de amigos."
        })
      } finally {
        setLoading(false)
      }
    }

    loadFriends()
  }, [userId, toast])

  const displayedFriends = showAll ? friends : friends.slice(0, 8)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 mx-auto" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum amigo encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {displayedFriends.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
      
      {friends.length > 8 && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowAll(!showAll)}
          >
            <Users size={18} />
            {showAll ? 'Mostrar menos' : 'Ver todos os amigos'}
          </Button>
        </div>
      )}
    </div>
  )
}

function FriendCard({ friend }: { friend: Friend }) {
  return (
    <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
      <CardContent className="p-4 space-y-3">
        <div className="relative">
          <Avatar className="w-16 h-16 mx-auto">
            <AvatarImage src={friend.avatar_url} />
            <AvatarFallback>{friend.name[0]}</AvatarFallback>
          </Avatar>
          <div 
            className={`absolute bottom-0 right-4 w-3 h-3 rounded-full border-2 border-background ${
              friend.online ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        </div>

        <div className="text-center space-y-1">
          <div className="font-medium truncate">{friend.name}</div>
          <div className="flex flex-wrap gap-1 justify-center">
            {friend.is_best_friend && (
              <Badge variant="secondary" className="text-xs">
                ⭐ Melhor Amigo
              </Badge>
            )}
            {friend.mutual_friends > 0 && (
              <Badge variant="outline" className="text-xs">
                {friend.mutual_friends} em comum
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}