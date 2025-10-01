import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type Enums = Database['public']['Enums'];

export type LibraryItemType = Enums['library_item_type'];
export type ConsumptionStatus = Enums['consumption_status'];

export type LibraryItem = Tables['library_items']['Row'];
export type LibraryItemLike = Tables['library_item_likes']['Row'];
export type LibraryItemComment = Tables['library_item_comments']['Row'];
export type LibraryRecommendation = Tables['library_recommendations']['Row'] & {
  from_user?: Tables['profiles']['Row'];
  item_type?: LibraryItemType;
  item_title?: string;
  item_creator?: string;
  note?: string;
};
export type LibraryAchievement = Tables['library_achievements']['Row'] & {
  unlocked?: boolean;
  current_count?: number;
  required_count?: number;
  unlocked_at?: string;
};

export interface LibraryStats {
  totalItems: number;
  byType: Record<LibraryItemType, number>;
  favoritesByType: Record<LibraryItemType, LibraryItem[]>;
  recentlyAdded: LibraryItem[];
  topRated: LibraryItem[];
}

export interface LibraryCollection {
  title: string;
  items: LibraryItem[];
}