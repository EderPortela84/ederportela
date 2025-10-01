import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HeartIcon, MessageCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import type { Scrap } from "./types"
import { fetchScraps, createScrap, deleteScrap, toggleLike } from "@/services/scraps"

export function MuralRecados() {
  const { userId } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [filter, setFilter] = useState<"all" | "friends">("all")
  const [scraps, setScraps] = useState<Scrap[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScraps()
  }, [userId])

  const loadScraps = async () => {
    if (!userId && !user?.id) return
    
    try {
      setLoading(true)
      const data = await fetchScraps(userId || user?.id || '')
      setScraps(data)
    } catch (error) {
      console.error('Erro ao carregar recados:', error)
      toast({
        title: "Erro ao carregar recados",
        description: "Não foi possível carregar os recados. Tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendScrap = async () => {
    if (!message.trim()) return
    if (!userId && !user?.id) return

    try {
      await createScrap(userId || user?.id || '', message)
      setMessage("")
      loadScraps()
      toast({
        title: "Recado enviado",
        description: "Seu recado foi publicado com sucesso!",
      })
    } catch (error) {
      console.error('Erro ao enviar recado:', error)
      toast({
        title: "Erro ao enviar recado",
        description: "Não foi possível enviar seu recado. Tente novamente mais tarde.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteScrap = async (scrapId: string) => {
    try {
      await deleteScrap(scrapId)
      setScraps(scraps.filter(scrap => scrap.id !== scrapId))
      toast({
        title: "Recado apagado",
        description: "O recado foi apagado com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao apagar recado:', error)
      toast({
        title: "Erro ao apagar recado",
        description: "Não foi possível apagar o recado. Tente novamente mais tarde.",
        variant: "destructive"
      })
    }
  }

  const handleToggleLike = async (scrapId: string) => {
    try {
      const { liked, likes } = await toggleLike(scrapId)
      setScraps(scraps.map(scrap => 
        scrap.id === scrapId 
          ? { ...scrap, liked_by_me: liked, likes } 
          : scrap
      ))
    } catch (error) {
      console.error('Erro ao curtir/descurtir recado:', error)
      toast({
        title: "Erro ao interagir com o recado",
        description: "Não foi possível curtir/descurtir o recado. Tente novamente mais tarde.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Área de escrita */}
      <Card>
        <CardContent className="pt-4">
          <Textarea
            placeholder="Deixe um recado..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
        <CardFooter className="justify-between">
          <div className="flex gap-2">
            {/* TODO: Implementar seletor de emoji e GIF */}
          </div>
          <Button onClick={handleSendScrap} disabled={!message.trim()}>
            Deixar Recado
          </Button>
        </CardFooter>
      </Card>

      {/* Lista de recados */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="flex-row items-center gap-3 space-y-0">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-3 w-32 bg-muted rounded" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-2/3 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : scraps.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum recado ainda. Seja o primeiro a deixar uma mensagem!</p>
              </CardContent>
            </Card>
          ) : (
            scraps.map((scrap) => (
              <Card key={scrap.id}>
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <Avatar>
                    <AvatarImage src={scrap.author.avatar_url} />
                    <AvatarFallback>{scrap.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{scrap.author.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(scrap.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{scrap.content}</p>
                  {scrap.attachments?.map((attachment, index) => (
                    <div key={index} className="mt-2">
                      {attachment.type === 'image' && (
                        <img 
                          src={attachment.url} 
                          alt="Anexo" 
                          className="rounded-md max-h-[200px] object-cover"
                        />
                      )}
                      {/* TODO: Implementar visualização de GIF */}
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => handleToggleLike(scrap.id)}
                  >
                    <HeartIcon 
                      className={scrap.liked_by_me ? "fill-red-500 text-red-500" : ""} 
                      size={18} 
                    />
                    {scrap.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <MessageCircle size={18} />
                    {scrap.replies?.length || 0}
                  </Button>
                  {(user?.id === scrap.author.id || user?.id === (userId || user?.id)) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 ml-auto text-destructive hover:text-destructive"
                      onClick={() => handleDeleteScrap(scrap.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}