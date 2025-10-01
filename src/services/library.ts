import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables']
type LibraryItem = Tables['library_items']['Row']
type LibraryItemLike = Tables['library_item_likes']['Row']
type LibraryItemComment = Tables['library_item_comments']['Row']
type LibraryRecommendation = Tables['library_recommendations']['Row']
type LibraryAchievement = Tables['library_achievements']['Row']
type LibraryItemType = LibraryItem['type']

// === Itens da biblioteca ===
export async function fetchLibraryItems(userId: string): Promise<LibraryItem[]> {
  const { data, error } = await supabase
    .from('library_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addLibraryItem(
  item: Tables['library_items']['Insert']
): Promise<LibraryItem> {
  const { data, error } = await supabase
    .from('library_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLibraryItem(
  itemId: string,
  updates: Tables['library_items']['Update']
): Promise<LibraryItem> {
  const { data, error } = await supabase
    .from('library_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLibraryItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('library_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
}

// === Likes ===
export async function likeLibraryItem(
  itemId: string,
  userId: string
): Promise<LibraryItemLike> {
  const { data, error } = await supabase
    .from('library_item_likes')
    .insert({ item_id: itemId, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unlikeLibraryItem(itemId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('library_item_likes')
    .delete()
    .eq('item_id', itemId)
    .eq('user_id', userId);

  if (error) throw error;
}

// === Comentários ===
export async function fetchLibraryItemComments(itemId: string): Promise<LibraryItemComment[]> {
  const { data, error } = await supabase
    .from('library_item_comments')
    .select('*')
    .eq('item_id', itemId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addLibraryItemComment(
  comment: Tables['library_item_comments']['Insert']
): Promise<LibraryItemComment> {
  const { data, error } = await supabase
    .from('library_item_comments')
    .insert(comment)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLibraryItemComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('library_item_comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}

// === Recomendações ===
export async function fetchLibraryRecommendations(userId: string): Promise<LibraryRecommendation[]> {
  const { data, error } = await supabase
    .from('library_recommendations')
    .select(`
      *,
      from_user:profiles!from_user_id(*),
      library_items(*)
    `)
    .eq('to_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function sendLibraryRecommendation(
  recommendation: Tables['library_recommendations']['Insert']
): Promise<LibraryRecommendation> {
  const { data, error } = await supabase
    .from('library_recommendations')
    .insert(recommendation)
    .select(`
      *,
      from_user:profiles!from_user_id(*),
      library_items(*)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function updateLibraryRecommendation(
  recommendationId: string,
  status: 'accepted' | 'rejected'
): Promise<LibraryRecommendation> {
  const { data, error } = await supabase
    .from('library_recommendations')
    .update({ status })
    .eq('id', recommendationId)
    .select(`
      *,
      from_user:profiles!from_user_id(*),
      library_items(*)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLibraryRecommendation(recommendationId: string): Promise<void> {
  const { error } = await supabase
    .from('library_recommendations')
    .delete()
    .eq('id', recommendationId);

  if (error) throw error;
}

// === Conquistas ===
export async function fetchLibraryAchievements(
  userId: string
): Promise<LibraryAchievement[]> {
  const { data, error } = await supabase
    .from('library_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('achieved_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// === Utils ===
export function getCollectionTitle(type: LibraryItemType): string {
  const titles = {
    book: 'Livros',
    movie: 'Filmes',
    series: 'Séries',
    music: 'Músicas',
    link: 'Links',
    note: 'Notas'
  };
  return titles[type];
}
