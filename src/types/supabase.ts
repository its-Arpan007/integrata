export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          name: string;
          email: string;
          avatar: string;
          bio: string;
          college: string | null;
          company: string | null;
          location: string;
          github: string | null;
          portfolio: string | null;
          skills: string[];
          builder_dna: Json;
          fun_prompts: Json;
          ai_summary: string;
          availability: string;
          interests: string[];
          online: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          name?: string;
          email?: string;
          avatar?: string;
          bio?: string;
          college?: string | null;
          company?: string | null;
          location?: string;
          github?: string | null;
          portfolio?: string | null;
          skills?: string[];
          builder_dna?: Json;
          fun_prompts?: Json;
          ai_summary?: string;
          availability?: string;
          interests?: string[];
          online?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          name?: string;
          email?: string;
          avatar?: string;
          bio?: string;
          college?: string | null;
          company?: string | null;
          location?: string;
          github?: string | null;
          portfolio?: string | null;
          skills?: string[];
          builder_dna?: Json;
          fun_prompts?: Json;
          ai_summary?: string;
          availability?: string;
          interests?: string[];
          online?: boolean;
          updated_at?: string;
        };
      };
      pings: {
        Row: {
          id: string;
          from_user_id: string;
          to_user_id: string;
          message: string;
          ai_suggested: boolean;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          from_user_id: string;
          to_user_id: string;
          message?: string;
          ai_suggested?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          message?: string;
          status?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          description: string;
          project: string;
          status: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          project?: string;
          status?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          project?: string;
          status?: string;
          updated_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          role?: string;
          joined_at?: string;
        };
        Update: {
          role?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          team_id: string;
          title: string;
          description: string;
          status: string;
          priority: string;
          assignee_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          title: string;
          description?: string;
          status?: string;
          priority?: string;
          assignee_id?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          status?: string;
          priority?: string;
          assignee_id?: string | null;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          team_id: string;
          user_id: string | null;
          content: string;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id?: string | null;
          content: string;
          type?: string;
          created_at?: string;
        };
        Update: {
          content?: string;
          type?: string;
        };
      };
      compatibility_cache: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string;
          overall_score: number;
          dimensions: Json;
          strengths: Json;
          challenges: Json;
          suggested_roles: Json;
          ai_insight: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user1_id: string;
          user2_id: string;
          overall_score: number;
          dimensions?: Json;
          strengths?: Json;
          challenges?: Json;
          suggested_roles?: Json;
          ai_insight?: string;
          created_at?: string;
        };
        Update: {
          overall_score?: number;
          dimensions?: Json;
          strengths?: Json;
          challenges?: Json;
          suggested_roles?: Json;
          ai_insight?: string;
        };
      };
    };
  };
}
