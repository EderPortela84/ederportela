// Tipos para a Galeria Virtual

export type GalleryPrivacy = 'public' | 'friends' | 'private';
export type GalleryItemType = 'photo' | 'video' | 'gif';
export type MediaFilter = 'original' | 'retro' | 'blackwhite' | 'sepia' | 'vintage';

export interface GalleryAlbum {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cover_url?: string;
  privacy: GalleryPrivacy;
  is_pinned: boolean;
  item_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  album_id: string;
  user_id: string;
  type: GalleryItemType;
  url: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
  location?: string;
  width?: number;
  height?: number;
  duration?: number; // para vídeos em segundos
  size?: number; // tamanho em bytes
  filter?: MediaFilter;
  is_favorite: boolean;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryComment {
  id: string;
  item_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface GalleryLike {
  id: string;
  item_id: string;
  user_id: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface GalleryTag {
  id: string;
  item_id: string;
  user_id: string;
  tagged_user_id: string;
  x: number; // posição X na imagem (0-100)
  y: number; // posição Y na imagem (0-100)
  created_at: string;
  tagged_user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface GallerySticker {
  id: string;
  item_id: string;
  user_id: string;
  sticker_type: string; // 'heart' | 'laugh' | 'cool' | 'sad' | 'angry' | 'love'
  x: number;
  y: number;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface GalleryStats {
  total_albums: number;
  total_items: number;
  total_photos: number;
  total_videos: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  top_album?: GalleryAlbum;
  most_liked_item?: GalleryItem;
  recent_items: GalleryItem[];
}

export interface GalleryAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'photos' | 'videos' | 'likes' | 'views' | 'albums';
  unlocked: boolean;
  progress: number;
  unlocked_at?: string;
}

// Tipos para upload
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadError {
  message: string;
  code?: string;
}

// Tipos para filtros e efeitos
export interface FilterOption {
  id: MediaFilter;
  name: string;
  description: string;
  preview: string;
}

// Configurações da galeria
export interface GallerySettings {
  default_privacy: GalleryPrivacy;
  allow_comments: boolean;
  allow_likes: boolean;
  allow_tags: boolean;
  allow_downloads: boolean;
  max_file_size: number; // em MB
  max_video_duration: number; // em segundos
  auto_play_videos: boolean;
  show_location: boolean;
}

// Tipos para ordenação e filtros
export type AlbumSortType = 'newest' | 'oldest' | 'most_viewed' | 'most_items' | 'title';
export type ItemSortType = 'newest' | 'oldest' | 'most_liked' | 'most_commented' | 'title';

export interface GalleryFilters {
  privacy?: GalleryPrivacy;
  type?: GalleryItemType;
  album_id?: string;
  date_from?: string;
  date_to?: string;
  location?: string;
  tagged_user_id?: string;
}