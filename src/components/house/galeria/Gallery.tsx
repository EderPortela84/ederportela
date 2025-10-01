import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Folder, 
  Upload, 
  Award, 
  Sparkles,
  Grid,
  List,
  Search,
  Filter,
  Plus,
  Image as ImageIcon,
  Film,
  Star,
  Heart,
  MessageCircle,
  Eye
} from 'lucide-react';
import { AlbumGrid } from './AlbumGrid';
import { PhotoGrid } from './PhotoGrid';
import { Lightbox } from './Lightbox';
import { UploadModal } from './UploadModal';
import { AlbumModal } from './AlbumModal';
import { GalleryFilters } from './GalleryFilters';
import { GalleryAchievements } from './GalleryAchievements';
import { SocialActions } from './SocialActions';
import { StickersPanel } from './StickersPanel';
import { useToast } from '@/hooks/use-toast';
import type { 
  GalleryAlbum, 
  GalleryItem, 
  GalleryStats, 
  GalleryAchievement,
  GalleryFilters as FiltersType
} from './types';
import './gallery-styles.css';

// Dados mock para desenvolvimento
const mockAlbums: GalleryAlbum[] = [
  {
    id: '1',
    title: 'Viagem à Praia',
    description: 'Férias incríveis com a família',
    cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
    privacy: 'friends',
    item_count: 24,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z',
    owner_id: 'user123',
    is_featured: true
  },
  {
    id: '2',
    title: 'Festa de Aniversário',
    description: 'Celebração especial com amigos',
    cover_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop',
    privacy: 'public',
    item_count: 18,
    created_at: '2024-02-10T14:00:00Z',
    updated_at: '2024-02-12T09:15:00Z',
    owner_id: 'user123',
    is_featured: false
  },
  {
    id: '3',
    title: 'Momentos do Dia a Dia',
    description: 'Fotos cotidianas e espontâneas',
    cover_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    privacy: 'private',
    item_count: 35,
    created_at: '2024-03-01T08:00:00Z',
    updated_at: '2024-03-05T16:45:00Z',
    owner_id: 'user123',
    is_featured: false
  }
];

const mockItems: GalleryItem[] = [
  {
    id: '1',
    album_id: '1',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
    title: 'Pôr do sol na praia',
    description: 'Momento mágico',
    location: 'Praia do Rosa, SC',
    tags: ['praia', 'pôr do sol', 'natureza'],
    likes: 15,
    comments: 3,
    is_liked: true,
    created_at: '2024-01-16T18:30:00Z',
    width: 800,
    height: 600
  },
  {
    id: '2',
    album_id: '1',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
    title: 'Ondas do mar',
    description: 'Som relaxante das ondas',
    duration: 30,
    likes: 8,
    comments: 1,
    is_liked: false,
    created_at: '2024-01-17T10:15:00Z',
    width: 1280,
    height: 720
  },
  {
    id: '3',
    album_id: '2',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop',
    title: 'Bolo de aniversário',
    description: 'Bolo colorido com velas',
    likes: 12,
    comments: 5,
    is_liked: true,
    created_at: '2024-02-11T15:20:00Z',
    width: 800,
    height: 600
  }
];

const mockStats: GalleryStats = {
  total_albums: 3,
  total_photos: 45,
  total_videos: 8,
  total_likes: 156,
  total_comments: 32,
  featured_albums: 1,
  most_liked_item: mockItems[0],
  recent_activity: 5
};

const mockAchievements: GalleryAchievement[] = [
  {
    id: '1',
    title: 'Fotógrafo Iniciante',
    description: 'Adicionou 10 fotos',
    icon: '📸',
    requirement: 10,
    current_progress: 10,
    is_unlocked: true,
    unlocked_at: '2024-01-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'Colecionador de Momentos',
    description: 'Criou 3 álbuns',
    icon: '📚',
    requirement: 3,
    current_progress: 3,
    is_unlocked: true,
    unlocked_at: '2024-03-01T08:00:00Z'
  },
  {
    id: '3',
    title: 'Estrela Pop',
    description: 'Recebeu 100 curtidas',
    icon: '⭐',
    requirement: 100,
    current_progress: 156,
    is_unlocked: true,
    unlocked_at: '2024-03-10T14:30:00Z'
  }
];

export function Gallery() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(mockAlbums);
  const [items, setItems] = useState<GalleryItem[]>(mockItems);
  const [stats, setStats] = useState<GalleryStats>(mockStats);
  const [achievements, setAchievements] = useState<GalleryAchievement[]>(mockAchievements);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStickersPanel, setShowStickersPanel] = useState(false);
  const [filters, setFilters] = useState<FiltersType>({
    privacy: 'all',
    type: 'all',
    dateRange: 'all',
    sortBy: 'date_desc'
  });

  const { toast } = useToast();

  function handleCreateAlbum(albumData: Partial<GalleryAlbum>) {
    const newAlbum: GalleryAlbum = {
      id: Date.now().toString(),
      title: albumData.title!,
      description: albumData.description || '',
      cover_url: albumData.cover_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      privacy: albumData.privacy || 'friends',
      item_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: 'user123',
      is_featured: false
    };

    setAlbums(prev => [newAlbum, ...prev]);
    setStats(prev => ({ ...prev, total_albums: prev.total_albums + 1 }));
    
    toast({
      title: 'Álbum criado com sucesso!',
      description: `Seu álbum "${newAlbum.title}" foi criado.`,
      icon: <Sparkles className="h-4 w-4" />
    });
  }

  function handleUploadItems(files: File[], albumId: string) {
    // Simular upload de arquivos
    const newItems: GalleryItem[] = files.map((file, index) => ({
      id: `${Date.now()}_${index}`,
      album_id: albumId,
      type: file.type.startsWith('image/') ? 'photo' : 'video',
      url: URL.createObjectURL(file),
      thumbnail_url: URL.createObjectURL(file),
      title: file.name.split('.')[0],
      description: '',
      likes: 0,
      comments: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
      width: 800,
      height: 600
    }));

    setItems(prev => [...newItems, ...prev]);
    
    // Atualizar contador do álbum
    setAlbums(prev => prev.map(album => 
      album.id === albumId 
        ? { ...album, item_count: album.item_count + files.length, updated_at: new Date().toISOString() }
        : album
    ));

    // Atualizar estatísticas
    const photoCount = newItems.filter(item => item.type === 'photo').length;
    const videoCount = newItems.filter(item => item.type === 'video').length;
    
    setStats(prev => ({
      ...prev,
      total_photos: prev.total_photos + photoCount,
      total_videos: prev.total_videos + videoCount,
      recent_activity: prev.recent_activity + files.length
    }));

    toast({
      title: 'Upload concluído!',
      description: `${files.length} item(ns) foram adicionados.`,
      icon: <Camera className="h-4 w-4" />
    });
  }

  function handleLikeItem(itemId: string) {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newLikes = item.is_liked ? item.likes - 1 : item.likes + 1;
        return {
          ...item,
          likes: newLikes,
          is_liked: !item.is_liked
        };
      }
      return item;
    }));
  }

  function handleOpenLightbox(item: GalleryItem) {
    setSelectedItem(item);
    setShowLightbox(true);
  }

  function handleCloseLightbox() {
    setShowLightbox(false);
    setSelectedItem(null);
  }

  function handleNavigateLightbox(direction: 'prev' | 'next') {
    if (!selectedItem) return;
    
    const albumItems = items.filter(item => item.album_id === selectedItem.album_id);
    const currentIndex = albumItems.findIndex(item => item.id === selectedItem.id);
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex < albumItems.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : albumItems.length - 1;
    }
    
    setSelectedItem(albumItems[newIndex]);
  }

  // Funções de Interação Social
  function handleLike(itemId: string) {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            is_liked: !item.is_liked,
            likes: item.is_liked ? item.likes - 1 : item.likes + 1
          }
        : item
    ));
  }

  function handleComment(itemId: string, comment: string) {
    // Adicionar lógica para salvar comentário
    console.log(`Comentário adicionado ao item ${itemId}: ${comment}`);
  }

  function handleShare(itemId: string, platform: string) {
    // Adicionar lógica para compartilhar
    console.log(`Item ${itemId} compartilhado no ${platform}`);
  }

  function handleBookmark(itemId: string) {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, is_bookmarked: !item.is_bookmarked }
        : item
    ));
  }

  function handleReport(itemId: string) {
    // Adicionar lógica para denunciar
    console.log(`Item ${itemId} denunciado`);
  }

  function handleDownload(itemId: string) {
    // Adicionar lógica para download
    console.log(`Download do item ${itemId}`);
  }

  function handleStickerSelect(sticker: any) {
    // Adicionar lógica para selecionar sticker
    console.log('Sticker selecionado:', sticker);
    setShowStickersPanel(false);
  }

  const filteredAlbums = albums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         album.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filters.privacy !== 'all' && album.privacy !== filters.privacy) {
      return false;
    }
    
    return matchesSearch;
  });

  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    switch (filters.sortBy) {
      case 'date_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'date_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'title_asc':
        return a.title.localeCompare(b.title);
      case 'title_desc':
        return b.title.localeCompare(a.title);
      case 'items_desc':
        return b.item_count - a.item_count;
      case 'items_asc':
        return a.item_count - b.item_count;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Galeria Virtual
                </h1>
                <p className="text-muted-foreground">Suas memórias em um só lugar</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAchievements(true)}
                className="gap-2"
              >
                <Award className="h-4 w-4" />
                Conquistas
              </Button>
              <Button
                onClick={() => setShowAlbumModal(true)}
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="h-4 w-4" />
                Novo Álbum
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Folder className="h-8 w-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.total_albums}</div>
                    <div className="text-sm text-muted-foreground">Álbuns</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.total_photos}</div>
                    <div className="text-sm text-muted-foreground">Fotos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Film className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.total_videos}</div>
                    <div className="text-sm text-muted-foreground">Vídeos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-pink-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.total_likes}</div>
                    <div className="text-sm text-muted-foreground">Curtidas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar álbuns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="gap-2"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                {viewMode === 'grid' ? 'Lista' : 'Grid'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="albums" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="albums" className="gap-2">
              <Folder className="h-4 w-4" />
              Álbuns
            </TabsTrigger>
            <TabsTrigger value="photos" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Fotos
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Film className="h-4 w-4" />
              Vídeos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="albums" className="space-y-4">
            {sortedAlbums.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur">
                <CardContent className="p-12 text-center">
                  <Folder className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum álbum encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'Tente ajustar sua busca' : 'Crie seu primeiro álbum para começar!'}
                  </p>
                  <Button
                    onClick={() => setShowAlbumModal(true)}
                    className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Plus className="h-4 w-4" />
                    Criar Álbum
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <AlbumGrid
                albums={sortedAlbums}
                viewMode={viewMode}
                onAlbumClick={setSelectedAlbum}
                onAlbumEdit={(album) => {
                  // Implementar edição
                  console.log('Editar álbum:', album);
                }}
                onAlbumDelete={(albumId) => {
                  setAlbums(prev => prev.filter(album => album.id !== albumId));
                  setStats(prev => ({ ...prev, total_albums: prev.total_albums - 1 }));
                  toast({
                    title: 'Álbum excluído',
                    description: 'O álbum foi removido com sucesso.',
                    variant: 'destructive'
                  });
                }}
                onAlbumFeature={(albumId) => {
                  setAlbums(prev => prev.map(album => ({
                    ...album,
                    is_featured: album.id === albumId ? !album.is_featured : false
                  })));
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <PhotoGrid
              items={items.filter(item => item.type === 'photo')}
              viewMode={viewMode}
              onItemClick={handleOpenLightbox}
              onItemLike={handleLikeItem}
              onItemUpload={() => setShowUploadModal(true)}
              onItemComment={handleComment}
              onItemShare={handleShare}
              onItemBookmark={handleBookmark}
              onItemReport={handleReport}
              onItemDownload={handleDownload}
            />
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <PhotoGrid
              items={items.filter(item => item.type === 'video')}
              viewMode={viewMode}
              onItemClick={handleOpenLightbox}
              onItemLike={handleLikeItem}
              onItemUpload={() => setShowUploadModal(true)}
              onItemComment={handleComment}
              onItemShare={handleShare}
              onItemBookmark={handleBookmark}
              onItemReport={handleReport}
              onItemDownload={handleDownload}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showAlbumModal && (
        <AlbumModal
          onClose={() => setShowAlbumModal(false)}
          onCreate={handleCreateAlbum}
        />
      )}

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadItems}
          albums={albums}
        />
      )}

      {showFilters && (
        <GalleryFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {showAchievements && (
        <GalleryAchievements
          achievements={achievements}
          stats={stats}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showLightbox && selectedItem && (
        <Lightbox
          item={selectedItem}
          onClose={handleCloseLightbox}
          onNavigate={handleNavigateLightbox}
          onLike={handleLikeItem}
          onComment={(itemId, comment) => {
            setItems(prev => prev.map(item => 
              item.id === itemId 
                ? { ...item, comments: item.comments + 1 }
                : item
            ));
          }}
          onShare={(itemId) => {
            toast({
              title: 'Link copiado!',
              description: 'Link para compartilhamento copiado para a área de transferência.',
              icon: <Sparkles className="h-4 w-4" />
            });
          }}
        />
      )}
    </div>
  );
}