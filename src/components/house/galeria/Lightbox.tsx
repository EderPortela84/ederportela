import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  MessageCircle, 
  Share2, 
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  MapPin,
  Tag,
  Clock,
  Calendar,
  User,
  Send,
  Smile,
  Star,
  Bookmark,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GalleryItem, GalleryComment } from './types';

interface LightboxProps {
  item: GalleryItem;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onLike: (itemId: string) => void;
  onComment: (itemId: string, comment: string) => void;
  onShare: (itemId: string) => void;
}

export function Lightbox({ 
  item, 
  onClose, 
  onNavigate, 
  onLike, 
  onComment, 
  onShare 
}: LightboxProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<GalleryComment[]>([
    {
      id: '1',
      item_id: item.id,
      user_id: 'user1',
      user_name: 'Maria Silva',
      user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face',
      content: 'Que foto linda! 😍',
      created_at: '2024-03-15T14:30:00Z',
      likes: 3,
      is_liked: false
    },
    {
      id: '2',
      item_id: item.id,
      user_id: 'user2',
      user_name: 'João Santos',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      content: 'Adorei esse momento!',
      created_at: '2024-03-15T15:45:00Z',
      likes: 1,
      is_liked: true
    }
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  function handleSubmitComment() {
    if (!commentText.trim()) return;

    const newComment: GalleryComment = {
      id: Date.now().toString(),
      item_id: item.id,
      user_id: 'current_user',
      user_name: 'Você',
      user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
      content: commentText,
      created_at: new Date().toISOString(),
      likes: 0,
      is_liked: false
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText('');
    onComment(item.id, commentText);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      {/* Botão Fechar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navegação */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigate('prev')}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigate('next')}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      <div className="w-full h-full flex">
        {/* Área Principal da Mídia */}
        <div className="flex-1 flex items-center justify-center relative">
          {item.type === 'photo' ? (
            <img
              src={item.url}
              alt={item.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MDAgMzAwTDQxMCAzMTBMNDAwIDMwMEwzOTAgMzEwTDQwMCAzMDBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0yMDAgMjAwTDYwMCA0MDAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cg==';
              }}
            />
          ) : (
            <div className="relative max-w-full max-h-full">
              <video
                src={item.url}
                className="max-w-full max-h-full rounded-lg"
                controls
                autoPlay
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                Seu navegador não suporta vídeos.
              </video>
              
              {/* Controles Customizados */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur rounded-full px-4 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                {item.duration && (
                  <span className="text-white text-sm">
                    {formatDuration(item.duration)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Informações sobre a Mídia */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur rounded-lg p-3 text-white max-w-sm">
            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
            {item.description && (
              <p className="text-sm text-gray-300 mb-2 line-clamp-2">{item.description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              {item.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                </div>
              )}
              
              {item.tags && item.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{item.tags.slice(0, 2).join(', ')}</span>
                  {item.tags.length > 2 && <span>+{item.tags.length - 2}</span>}
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(item.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Painel de Interações */}
        <div className="w-80 bg-white/95 backdrop-blur border-l flex flex-col">
          {/* Cabeçalho */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Interações</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="gap-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{comments.length}</span>
              </Button>
            </div>
            
            {/* Ações Principais */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLike(item.id)}
                className={cn(
                  "flex-1 gap-1",
                  item.is_liked && "text-red-500 border-red-200"
                )}
              >
                <Heart className={cn("h-4 w-4", item.is_liked && "fill-current")} />
                <span>{item.likes}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(item.id)}
                className="gap-1"
              >
                <Share2 className="h-4 w-4" />
                <span>Compartilhar</span>
              </Button>
              
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Comentários */}
          {showComments && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user_avatar} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{comment.user_name}</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <button className="flex items-center gap-1 hover:text-gray-700">
                          <Heart className="h-3 w-3" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="hover:text-gray-700">Responder</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulário de Comentário */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <Textarea
                  placeholder="Adicione um comentário..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[60px] resize-none"
                  rows={2}
                />
                
                <div className="flex items-center justify-between mt-2">
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                    className="gap-1"
                  >
                    <Send className="h-4 w-4" />
                    <span>Enviar</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}