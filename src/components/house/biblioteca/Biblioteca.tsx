import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { LibraryStats } from './LibraryStats';
import { CollectionGrid } from './CollectionGrid';
import { AddItemDialog } from './AddItemDialog';
import { AchievementsDialog } from './AchievementsDialog';
import { RecommendationsDialog } from './RecommendationsDialog';
import {
  fetchLibraryItems,
  addLibraryItem,
  updateLibraryItem,
  deleteLibraryItem,
  likeLibraryItem,
  addLibraryItemComment,
  fetchLibraryRecommendations,
  updateLibraryRecommendation,
  deleteLibraryRecommendation,
  fetchLibraryAchievements
} from '@/services/library';
import type {
  LibraryItem,
  LibraryStats as LibraryStatsType,
  LibraryAchievement,
  LibraryRecommendation,
  LibraryItemType,
  ConsumptionStatus
} from './types';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables']

export function Biblioteca() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Estados
  const [stats, setStats] = useState<LibraryStatsType | null>(null);
  const [collections, setCollections] = useState<Record<LibraryItemType, LibraryItem[]>>({
    book: [],
    movie: [],
    series: [],
    music: [],
    link: [],
    note: []
  });
  const [achievements, setAchievements] = useState<LibraryAchievement[]>([]);
  const [recommendations, setRecommendations] = useState<LibraryRecommendation[]>([]);

  // Estados dos diálogos
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);

  // Carrega os dados iniciais
  useEffect(() => {
    if (user) {
      loadLibraryData();
    }
  }, [user]);

  async function loadLibraryData() {
    try {
      if (!user) return;

      const items = await fetchLibraryItems(user.id);
      const achievementsData = await fetchLibraryAchievements(user.id);
      const recommendationsData = await fetchLibraryRecommendations(user.id);

      // Calcula estatísticas
      const statsData: LibraryStatsType = {
        totalItems: items.length,
        byType: {
          book: items.filter(item => item.type === 'book').length,
          movie: items.filter(item => item.type === 'movie').length,
          series: items.filter(item => item.type === 'series').length,
          music: items.filter(item => item.type === 'music').length,
          link: items.filter(item => item.type === 'link').length,
          note: items.filter(item => item.type === 'note').length
        },
        favoritesByType: {
          book: items.filter(item => item.type === 'book' && item.is_favorite),
          movie: items.filter(item => item.type === 'movie' && item.is_favorite),
          series: items.filter(item => item.type === 'series' && item.is_favorite),
          music: items.filter(item => item.type === 'music' && item.is_favorite),
          link: items.filter(item => item.type === 'link' && item.is_favorite),
          note: items.filter(item => item.type === 'note' && item.is_favorite)
        },
        recentlyAdded: items.slice(0, 5),
        topRated: items.filter(item => item.rating).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5)
      };

      // Organiza itens por tipo
      const collectionsData: Record<LibraryItemType, LibraryItem[]> = {
        book: items.filter(item => item.type === 'book'),
        movie: items.filter(item => item.type === 'movie'),
        series: items.filter(item => item.type === 'series'),
        music: items.filter(item => item.type === 'music'),
        link: items.filter(item => item.type === 'link'),
        note: items.filter(item => item.type === 'note')
      };

      setStats(statsData);
      setCollections(collectionsData);
      setAchievements(achievementsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error("Error loading library data:", error);
      toast({
        title: 'Erro ao carregar biblioteca',
        description: 'Não foi possível carregar os dados da biblioteca.',
        variant: 'destructive'
      });
    }
  }

  // Handlers
  async function handleAddItem(data: Tables['library_items']['Insert']) {
    try {
      await addLibraryItem(data);
      await loadLibraryData();
      setAddItemOpen(false);
      toast({
        description: 'Item adicionado com sucesso!'
      });
    } catch (error) {
      toast({
        title: 'Erro ao adicionar item',
        description: 'Não foi possível adicionar o item à biblioteca.',
        variant: 'destructive'
      });
    }
  }

  async function handleLikeItem(itemId: string) {
    try {
      if (!user) return;
      await likeLibraryItem(itemId, user.id);
      await loadLibraryData();
    } catch (error) {
      toast({
        title: 'Erro ao curtir item',
        description: 'Não foi possível curtir o item.',
        variant: 'destructive'
      });
    }
  }

  async function handleCommentItem(itemId: string, content: string) {
    try {
      if (!user) return;
      await addLibraryItemComment({
        item_id: itemId,
        user_id: user.id,
        content
      });
      await loadLibraryData();
      toast({
        description: 'Comentário adicionado com sucesso!'
      });
    } catch (error) {
      toast({
        title: 'Erro ao adicionar comentário',
        description: 'Não foi possível adicionar o comentário.',
        variant: 'destructive'
      });
    }
  }

  async function handleUpdateItemStatus(itemId: string, status: ConsumptionStatus) {
    try {
      await updateLibraryItem(itemId, { status });
      await loadLibraryData();
      toast({
        description: 'Status atualizado com sucesso!'
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar status',
        description: 'Não foi possível atualizar o status do item.',
        variant: 'destructive'
      });
    }
  }

  async function handleDeleteItem(itemId: string) {
    try {
      await deleteLibraryItem(itemId);
      await loadLibraryData();
      toast({
        description: 'Item removido com sucesso!'
      });
    } catch (error) {
      toast({
        title: 'Erro ao remover item',
        description: 'Não foi possível remover o item.',
        variant: 'destructive'
      });
    }
  }

  async function handleAcceptRecommendation(recommendationId: string) {
    try {
      await updateLibraryRecommendation(recommendationId, 'accepted');
      await loadLibraryData();
      toast({
        description: 'Recomendação aceita com sucesso!'
      });
    } catch (error) {
      toast({
        title: 'Erro ao aceitar recomendação',
        description: 'Não foi possível aceitar a recomendação.',
        variant: 'destructive'
      });
    }
  }

  async function handleDeclineRecommendation(recommendationId: string) {
    try {
      await deleteLibraryRecommendation(recommendationId);
      await loadLibraryData();
      toast({
        description: 'Recomendação recusada'
      });
    } catch (error) {
      toast({
        title: 'Erro ao recusar recomendação',
        description: 'Não foi possível recusar a recomendação.',
        variant: 'destructive'
      });
    }
  }

  if (!user || !stats) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Biblioteca</h2>
          <p className="text-muted-foreground">
            Faça login para acessar sua biblioteca pessoal.
          </p>
        </div>
      </div>
    );
  }

  const pendingRecommendations = recommendations.filter(
    rec => rec.status === 'pending'
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Biblioteca</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setRecommendationsOpen(true)}
          >
            Recomendações
            {pendingRecommendations > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {pendingRecommendations}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setAchievementsOpen(true)}
          >
            Conquistas
          </Button>
          <Button onClick={() => setAddItemOpen(true)}>
            Adicionar Item
          </Button>
        </div>
      </div>

      <LibraryStats stats={stats} />

      <Tabs defaultValue="book" className="space-y-4">
        <TabsList>
          <TabsTrigger value="book">Livros</TabsTrigger>
          <TabsTrigger value="movie">Filmes</TabsTrigger>
          <TabsTrigger value="series">Séries</TabsTrigger>
          <TabsTrigger value="music">Músicas</TabsTrigger>
          <TabsTrigger value="link">Links</TabsTrigger>
          <TabsTrigger value="note">Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="book">
          <CollectionGrid
            items={collections.book}
            onLike={handleLikeItem}
            onComment={handleCommentItem}
            onUpdateStatus={handleUpdateItemStatus}
            onDelete={handleDeleteItem}
          />
        </TabsContent>

        <TabsContent value="movie">
          <CollectionGrid
            items={collections.movie}
            onLike={handleLikeItem}
            onComment={handleCommentItem}
            onUpdateStatus={handleUpdateItemStatus}
            onDelete={handleDeleteItem}
          />
        </TabsContent>

        <TabsContent value="series">
          <CollectionGrid
            items={collections.series}
            onLike={handleLikeItem}
            onComment={handleCommentItem}
            onUpdateStatus={handleUpdateItemStatus}
            onDelete={handleDeleteItem}
          />
        </TabsContent>

        <TabsContent value="music">
          <CollectionGrid
            items={collections.music}
            onLike={handleLikeItem}
            onComment={handleCommentItem}
            onUpdateStatus={handleUpdateItemStatus}
            onDelete={handleDeleteItem}
          />
        </TabsContent>

        <TabsContent value="link">
          <CollectionGrid
            items={collections.link}
            onLike={handleLikeItem}
            onComment={handleCommentItem}
            onUpdateStatus={handleUpdateItemStatus}
            onDelete={handleDeleteItem}
          />
        </TabsContent>

        <TabsContent value="note">
          <CollectionGrid
            items={collections.note}
            onLike={handleLikeItem}
            onComment={handleCommentItem}
            onUpdateStatus={handleUpdateItemStatus}
            onDelete={handleDeleteItem}
          />
        </TabsContent>
      </Tabs>

      <AddItemDialog
        open={addItemOpen}
        onOpenChange={setAddItemOpen}
        onSubmit={handleAddItem}
      />

      <AchievementsDialog
        open={achievementsOpen}
        onOpenChange={setAchievementsOpen}
        achievements={achievements}
      />

      <RecommendationsDialog
        open={recommendationsOpen}
        onOpenChange={setRecommendationsOpen}
        recommendations={recommendations}
        onAccept={handleAcceptRecommendation}
        onDecline={handleDeclineRecommendation}
      />
    </div>
  );
}