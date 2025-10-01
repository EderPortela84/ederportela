import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Flag,
  Eye,
  Download,
  User,
  Tag,
  MapPin,
  Clock,
  Send,
  Smile,
  MoreHorizontal,
  Users,
  Link,
  Mail,
  Facebook,
  Twitter,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialActionsProps {
  itemId: string;
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  location?: string;
  tags?: string[];
  taggedUsers?: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  onLike: (itemId: string) => void;
  onComment: (itemId: string, comment: string) => void;
  onShare: (itemId: string, platform: string) => void;
  onBookmark: (itemId: string) => void;
  onReport: (itemId: string) => void;
  onDownload: (itemId: string) => void;
  className?: string;
}

export function SocialActions({
  itemId,
  likes,
  comments,
  views,
  isLiked,
  isBookmarked,
  location,
  tags,
  taggedUsers,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onReport,
  onDownload,
  className
}: SocialActionsProps) {
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showTaggedUsers, setShowTaggedUsers] = useState(false);

  function handleLike() {
    onLike(itemId);
  }

  function handleComment() {
    if (commentText.trim()) {
      onComment(itemId, commentText);
      setCommentText('');
    }
  }

  function handleShare(platform: string) {
    onShare(itemId, platform);
    setShowShare(false);
  }

  function handleBookmark() {
    onBookmark(itemId);
  }

  function handleReport() {
    onReport(itemId);
  }

  function handleDownload() {
    onDownload(itemId);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Ações Principais */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Curtir */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              "gap-1 hover:text-red-500",
              isLiked && "text-red-500 bg-red-50"
            )}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            <span className="text-sm">{likes}</span>
          </Button>

          {/* Comentar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-1 hover:text-blue-500"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{comments}</span>
          </Button>

          {/* Compartilhar */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShare(!showShare)}
              className="gap-1 hover:text-green-500"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Compartilhar</span>
            </Button>

            {/* Menu de Compartilhamento */}
            {showShare && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  className="w-full justify-start gap-2"
                >
                  <Link className="h-4 w-4" />
                  Copiar Link
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="w-full justify-start gap-2"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="w-full justify-start gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('email')}
                  className="w-full justify-start gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Visualizações */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Eye className="h-4 w-4" />
            <span>{views}</span>
          </div>

          {/* Salvar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={cn(
              "hover:text-yellow-500",
              isBookmarked && "text-yellow-500 bg-yellow-50"
            )}
          >
            <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
          </Button>

          {/* Download */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="hover:text-blue-500"
          >
            <Download className="h-4 w-4" />
          </Button>

          {/* Mais Ações */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReport}
              className="hover:text-red-500"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Informações de Localização e Tags */}
      {(location || (tags && tags.length > 0) || (taggedUsers && taggedUsers.length > 0)) && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <div className="flex gap-1">
                {tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {taggedUsers && taggedUsers.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <button
                onClick={() => setShowTaggedUsers(!showTaggedUsers)}
                className="text-blue-500 hover:text-blue-600 underline"
              >
                {taggedUsers.length} pessoa{taggedUsers.length > 1 ? 's' : ''} marcada{taggedUsers.length > 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pessoas Marcadas */}
      {showTaggedUsers && taggedUsers && taggedUsers.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Pessoas Marcadas</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTaggedUsers(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {taggedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2 bg-white rounded-full px-3 py-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Área de Comentários */}
      {showComments && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Comentários</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Formulário de Comentário */}
          <div className="flex gap-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Adicione um comentário..."
                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <div className="flex items-center justify-between mt-2">
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="gap-1"
                >
                  <Send className="h-3 w-3" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de Comentários (Mock) */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=32&h=32&fit=crop&crop=face" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">Maria Silva</span>
                    <span className="text-xs text-gray-500">2h atrás</span>
                  </div>
                  <p className="text-sm">Que foto linda! Adorei o momento capturado. 😍</p>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <button className="hover:text-blue-500">Curtir</button>
                  <button className="hover:text-blue-500">Responder</button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">João Santos</span>
                    <span className="text-xs text-gray-500">1h atrás</span>
                  </div>
                  <p className="text-sm">Incrível! Onde foi tirada essa foto?</p>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <button className="hover:text-blue-500">Curtir</button>
                  <button className="hover:text-blue-500">Responder</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}