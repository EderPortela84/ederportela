import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Play, 
  Eye,
  Upload,
  Image as ImageIcon,
  Film,
  Clock,
  MapPin,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SocialActions } from './SocialActions';
import type { GalleryItem } from './types';

interface PhotoGridProps {
  items: GalleryItem[];
  viewMode: 'grid' | 'list';
  onItemClick: (item: GalleryItem) => void;
  onItemLike: (itemId: string) => void;
  onItemUpload: () => void;
  onItemComment?: (itemId: string, comment: string) => void;
  onItemShare?: (itemId: string, platform: string) => void;
  onItemBookmark?: (itemId: string) => void;
  onItemReport?: (itemId: string) => void;
  onItemDownload?: (itemId: string) => void;
}

export function PhotoGrid({ 
  items, 
  viewMode, 
  onItemClick, 
  onItemLike, 
  onItemUpload,
  onItemComment,
  onItemShare,
  onItemBookmark,
  onItemReport,
  onItemDownload
}: PhotoGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString('pt-BR');
  }

  if (items.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <ImageIcon className="h-12 w-12 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Nenhuma mídia encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando suas primeiras fotos ou vídeos!
              </p>
              <Button
                onClick={onItemUpload}
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Upload className="h-4 w-4" />
                Adicionar Mídia
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <Card 
            key={item.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="flex items-center p-4">
              {/* Miniatura */}
              <div 
                className="relative w-24 h-24 rounded-lg overflow-hidden mr-4 cursor-pointer group"
                onClick={() => onItemClick(item)}
              >
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00OCA0OEw1MyA1M0w0OCA0OEw0MyA1M0w0OCA0OFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTMzIDMzTDYzIDYzIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=';
                  }}
                />
                
                {/* Overlay para vídeos */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-2">
                      <Play className="h-4 w-4 text-gray-800" />
                    </div>
                    {item.duration && (
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                        {formatDuration(item.duration)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 cursor-pointer hover:text-purple-600 transition-colors"
                        onClick={() => onItemClick(item)}>
                      {item.title}
                    </h3>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Tags e Localização */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
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
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>

                    {/* Tipo */}
                    <Badge variant="outline" className="text-xs mb-2">
                      {item.type === 'photo' ? (
                        <><ImageIcon className="h-3 w-3 mr-1" />Foto</>
                      ) : (
                        <><Film className="h-3 w-3 mr-1" />Vídeo</>
                      )}
                    </Badge>
                  </div>

                  {/* Interações Sociais */}
                  <SocialActions
                    itemId={item.id}
                    likes={item.likes}
                    comments={item.comments}
                    views={item.views || 0}
                    isLiked={item.is_liked}
                    isBookmarked={item.is_bookmarked || false}
                    location={item.location}
                    tags={item.tags}
                    taggedUsers={item.tagged_users}
                    onLike={onItemLike}
                    onComment={onItemComment || (() => {})}
                    onShare={onItemShare || (() => {})}
                    onBookmark={onItemBookmark || (() => {})}
                    onReport={onItemReport || (() => {})}
                    onDownload={onItemDownload || (() => {})}
                    className="ml-4"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <div 
          key={item.id}
          className="relative group cursor-pointer"
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => onItemClick(item)}
        >
          {/* Container da Imagem/Vídeo */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTUwTDE2MCAxNjBMMTUwIDE1MEwxNDAgMTYwTDE1MCAxNTBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDIwMCAyMDAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cg==';
              }}
            />
            
            {/* Overlay com Informações */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
              hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* Título */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="text-white text-sm font-medium line-clamp-2 mb-1">
                  {item.title}
                </h4>
                
                {/* Interações Sociais Compactas */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white text-xs">
                    <div className="flex items-center gap-1">
                      <Heart className={cn("h-3 w-3", item.is_liked && "fill-current text-red-400")} />
                      <span>{item.likes}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{item.comments}</span>
                    </div>
                    
                    {item.type === 'video' && item.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(item.duration)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Botão de ações sociais expandidas */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemClick(item);
                    }}
                    className="text-white hover:text-white hover:bg-white/20 p-1 h-6 w-6"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Ícone de Tipo */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-black/70 text-white border-none text-xs">
                {item.type === 'photo' ? (
                  <ImageIcon className="h-3 w-3" />
                ) : (
                  <Film className="h-3 w-3" />
                )}
              </Badge>
            </div>

            {/* Botão de Play para Vídeos */}
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 text-gray-800" />
                </div>
                {item.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(item.duration)}
                  </div>
                )}
              </div>
            )}

            {/* Botão de Curtida Rápida */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onItemLike(item.id);
              }}
              className={cn(
                "absolute top-2 right-2 p-1 rounded-full transition-all",
                "bg-white/80 hover:bg-white",
                item.is_liked && "text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", item.is_liked && "fill-current")} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}