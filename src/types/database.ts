export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ServiceColor =
  | "green"
  | "gold"
  | "blue"
  | "purple"
  | "teal"
  | "orange";

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          url: string;
          icon: string;
          color: ServiceColor;
          sort_order: number;
          is_active: boolean;
          open_in_new_tab: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          url: string;
          icon: string;
          color: ServiceColor;
          sort_order?: number;
          is_active?: boolean;
          open_in_new_tab?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          url?: string;
          icon?: string;
          color?: ServiceColor;
          sort_order?: number;
          is_active?: boolean;
          open_in_new_tab?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          school_name: string;
          portal_title: string;
          hero_badge: string | null;
          hero_title: string;
          hero_highlight: string;
          hero_description: string;
          tagline: string | null;
          footer_text: string | null;
          logo_url: string | null;
          hero_image_url: string | null;
          highlights: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          school_name?: string;
          portal_title?: string;
          hero_badge?: string | null;
          hero_title?: string;
          hero_highlight?: string;
          hero_description?: string;
          tagline?: string | null;
          footer_text?: string | null;
          logo_url?: string | null;
          hero_image_url?: string | null;
          highlights?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          school_name?: string;
          portal_title?: string;
          hero_badge?: string | null;
          hero_title?: string;
          hero_highlight?: string;
          hero_description?: string;
          tagline?: string | null;
          footer_text?: string | null;
          logo_url?: string | null;
          hero_image_url?: string | null;
          highlights?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_profiles: {
        Row: {
          id: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedSchema: "auth";
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
