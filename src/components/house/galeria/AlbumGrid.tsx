import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, 
  Lock, 
  Users, 
  Globe,
  Image as ImageIcon,
  Film,
  Star,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Pin,
  Share2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { GalleryAlbum } from './types';

interface AlbumGridProps {
  albums: GalleryAlbum[];
  viewMode: 'grid' | 'list';
  onAlbumClick: (album: GalleryAlbum) => void;
  onAlbumEdit: (album: GalleryAlbum) => void;
  onAlbumDelete: (albumId: string) => void;
  onAlbumFeature: (albumId: string) => void;
}

export function AlbumGrid({ 
  albums, 
  viewMode, 
  onAlbumClick, 
  onAlbumEdit, 
  onAlbumDelete,
  onAlbumFeature 
}: AlbumGridProps) {
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null);

  function getPrivacyIcon(privacy: GalleryAlbum['privacy']) {
    switch (privacy) {
      case 'private':
        return <Lock className="h-3 w-3" />;
      case 'friends':
        return <Users className="h-3 w-3" />;
      case 'public':
        return <Globe className="h-3 w-3" />;
    }
  }

  function getPrivacyLabel(privacy: GalleryAlbum['privacy']) {
    switch (privacy) {
      case 'private':
        return 'Privado';
      case 'friends':
        return 'Amigos';
      case 'public':
        return 'Público';
    }
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
    if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} meses`;
    return `Há ${Math.floor(diffDays / 365)} anos`;
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {albums.map((album) => (
          <Card 
            key={album.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur"
            onMouseEnter={() => setHoveredAlbum(album.id)}
            onMouseLeave={() => setHoveredAlbum(null)}
          >
            <div className="flex items-center p-4">
              {/* Capa do Álbum */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden mr-4">
                <img
                  src={album.cover_url}
                  alt={album.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEw0NSA0NUw0MCA0MEwzNSA0NUw0MCA0MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTI1IDI1TDU1IDU1IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=';
                  }}
                />
                {album.is_featured && (
                  <div className="absolute top-1 right-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 cursor-pointer hover:text-purple-600 transition-colors"
                        onClick={() => onAlbumClick(album)}>
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {album.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        <span>{album.item_count} itens</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(album.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {getPrivacyIcon(album.privacy)}
                        <span>{getPrivacyLabel(album.privacy)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu de Ações */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onAlbumFeature(album.id)}>
                        <Star className="h-4 w-4 mr-2" />
                        {album.is_featured ? 'Desfixar' : 'Fixar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAlbumEdit(album)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onAlbumDelete(album.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {albums.map((album) => (
        <Card 
          key={album.id}
          className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur"
          onMouseEnter={() => setHoveredAlbum(album.id)}
          onMouseLeave={() => setHoveredAlbum(null)}
        >
          {/* Capa do Álbum */}
          <div 
            className="relative h-48 cursor-pointer group"
            onClick={() => onAlbumClick(album)}
          >
            <img
              src={album.cover_url}
              alt={album.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDE2MCAxMTBMMTUwIDEwMEwxNDAgMTEwTDE1MCAxMDBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDIwMCAxNTAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cg==';
              }}
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
              hoveredAlbum === album.id ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* Ícones de Privacidade e Destaque */}
              <div className="absolute top-2 left-2 flex gap-1">
                <Badge variant="secondary" className="bg-black/50 text-white border-none">
                  {getPrivacyIcon(album.privacy)}
                  <span className="ml-1 text-xs">{getPrivacyLabel(album.privacy)}</span>
                </Badge>
                {album.is_featured && (
                  <Badge variant="secondary" className="bg-yellow-500/80 text-white border-none">
                    <Star className="h-3 w-3 fill-white" />
                  </Badge>
                )}
              </div>

              {/* Contador de Itens */}
              <div className="absolute bottom-2 left-2 flex items-center gap-2 text-white">
                <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full text-xs">
                  <ImageIcon className="h-3 w-3" />
                  <span>{album.item_count}</span>
                </div>
              </div>

              {/* Botão de Visualização */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                hoveredAlbum === album.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="bg-white/90 rounded-full p-3">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 cursor-pointer hover:text-purple-600 transition-colors line-clamp-1"
                    onClick={() => onAlbumClick(album)}>
                  {album.title}
                </h3>
                {album.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {album.description}
                  </p>
                )}
              </div>
              
              {/* Menu de Ações */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onAlbumFeature(album.id)}>
                    <Star className="h-4 w-4 mr-2" />
                    {album.is_featured ? 'Desfixar' : 'Fixar'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAlbumEdit(album)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onAlbumDelete(album.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardFooter className="p-4 pt-2">
            <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(album.created_at)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  <span>{album.item_count}</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}