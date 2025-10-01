export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type LibraryItemType = 'book' | 'movie' | 'series' | 'music' | 'link' | 'note'
export type ConsumptionStatus = 'completed' | 'in_progress' | 'want_to'

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      library_items: {
        Row: {
          id: string
          user_id: string
          type: LibraryItemType
          title: string
          creator: string | null
          cover_url: string | null
          status: ConsumptionStatus
          rating: number | null
          notes: string | null
          is_favorite: boolean
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: LibraryItemType
          title: string
          creator?: string | null
          cover_url?: string | null
          status?: ConsumptionStatus
          rating?: number | null
          notes?: string | null
          is_favorite?: boolean
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: LibraryItemType
          title?: string
          creator?: string | null
          cover_url?: string | null
          status?: ConsumptionStatus
          rating?: number | null
          notes?: string | null
          is_favorite?: boolean
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      library_item_likes: {
        Row: {
          id: string
          item_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_item_likes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "library_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_item_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      library_item_comments: {
        Row: {
          id: string
          item_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_item_comments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "library_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_item_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      library_recommendations: {
        Row: {
          id: string
          from_user_id: string
          to_user_id: string
          item_id: string
          message: string | null
          created_at: string
          status: 'pending' | 'accepted' | 'rejected'
        }
        Insert: {
          id?: string
          from_user_id: string
          to_user_id: string
          item_id: string
          message?: string | null
          created_at?: string
          status?: 'pending' | 'accepted' | 'rejected'
        }
        Update: {
          id?: string
          from_user_id?: string
          to_user_id?: string
          item_id?: string
          message?: string | null
          created_at?: string
          status?: 'pending' | 'accepted' | 'rejected'
        }
        Relationships: [
          {
            foreignKeyName: "library_recommendations_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_recommendations_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_recommendations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "library_items"
            referencedColumns: ["id"]
          }
        ]
      }
      library_achievements: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          description: string | null
          icon_url: string | null
          achieved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          description?: string | null
          icon_url?: string | null
          achieved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          description?: string | null
          icon_url?: string | null
          achieved_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
          interaction_score: number
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
          interaction_score?: number
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
          interaction_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      scraps: {
        Row: {
          id: string
          content: string
          author_id: string
          profile_id: string
          parent_id: string | null
          created_at: string
          updated_at: string
          attachments: Json
          likes: number
          liked_by: string[]
        }
        Insert: {
          id?: string
          content: string
          author_id: string
          profile_id: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
          attachments?: Json
          likes?: number
          liked_by?: string[]
        }
        Update: {
          id?: string
          content?: string
          author_id?: string
          profile_id?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
          attachments?: Json
          likes?: number
          liked_by?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "scraps_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scraps_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scraps_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "scraps"
            referencedColumns: ["id"]
          }
        ]
      }
      house_visits: {
        Row: {
          created_at: string
          house_owner_id: string
          id: string
          is_public: boolean | null
          message: string
          updated_at: string
          visitor_id: string
        }
        Insert: {
          created_at?: string
          house_owner_id: string
          id?: string
          is_public?: boolean | null
          message: string
          updated_at?: string
          visitor_id: string
        }
        Update: {
          created_at?: string
          house_owner_id?: string
          id?: string
          is_public?: boolean | null
          message?: string
          updated_at?: string
          visitor_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          background_url: string | null
          badges: string[] | null
          bio: string | null
          casa_name: string
          cover_url: string | null
          created_at: string
          custom_background_unlocked: boolean
          favorite_books: string[] | null
          favorite_movies: string[] | null
          favorite_music: string | null
          garden_items: string[] | null
          house_color: string | null
          house_motto: string | null
          house_number: string | null
          house_style: string | null
          id: string
          is_public: boolean | null
          level: number
          location: string | null
          reputation_points: number | null
          room_decorations: Json | null
          status: string | null
          street_name: string | null
          theme_color: string | null
          updated_at: string
          user_id: string
          visit_count: number | null
        }
        Insert: {
          avatar_url?: string | null
          background_url?: string | null
          badges?: string[] | null
          bio?: string | null
          casa_name?: string
          cover_url?: string | null
          created_at?: string
          custom_background_unlocked?: boolean
          favorite_books?: string[] | null
          favorite_movies?: string[] | null
          favorite_music?: string | null
          garden_items?: string[] | null
          house_color?: string | null
          house_motto?: string | null
          house_number?: string | null
          house_style?: string | null
          id?: string
          is_public?: boolean | null
          level?: number
          location?: string | null
          reputation_points?: number | null
          room_decorations?: Json | null
          status?: string | null
          street_name?: string | null
          theme_color?: string | null
          updated_at?: string
          user_id: string
          visit_count?: number | null
        }
        Update: {
          avatar_url?: string | null
          background_url?: string | null
          badges?: string[] | null
          bio?: string | null
          casa_name?: string
          cover_url?: string | null
          created_at?: string
          custom_background_unlocked?: boolean
          favorite_books?: string[] | null
          favorite_movies?: string[] | null
          favorite_music?: string | null
          garden_items?: string[] | null
          house_color?: string | null
          house_motto?: string | null
          house_number?: string | null
          house_style?: string | null
          id?: string
          is_public?: boolean | null
          level?: number
          location?: string | null
          reputation_points?: number | null
          room_decorations?: Json | null
          status?: string | null
          street_name?: string | null
          theme_color?: string | null
          updated_at?: string
          user_id?: string
          visit_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      library_item_type: LibraryItemType
      consumption_status: ConsumptionStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
