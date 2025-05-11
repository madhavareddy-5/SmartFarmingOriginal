export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          sender: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          sender: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          sender?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      disease_detections: {
        Row: {
          confidence: number
          created_at: string | null
          detected_disease: string
          id: string
          image_url: string
          recommendations: string
          user_id: string
        }
        Insert: {
          confidence: number
          created_at?: string | null
          detected_disease: string
          id?: string
          image_url: string
          recommendations: string
          user_id: string
        }
        Update: {
          confidence?: number
          created_at?: string | null
          detected_disease?: string
          id?: string
          image_url?: string
          recommendations?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disease_detections_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      fertilizer_recommendations: {
        Row: {
          created_at: string | null
          crop_type: string
          id: string
          nitrogen: number
          phosphorus: number
          potassium: number
          recommendations: Json
          soil_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          crop_type: string
          id?: string
          nitrogen: number
          phosphorus: number
          potassium: number
          recommendations: Json
          soil_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          crop_type?: string
          id?: string
          nitrogen?: number
          phosphorus?: number
          potassium?: number
          recommendations?: Json
          soil_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fertilizer_recommendations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_admin: boolean | null
          last_name: string | null
          preferred_language: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_admin?: boolean | null
          last_name?: string | null
          preferred_language?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          preferred_language?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      water_predictions: {
        Row: {
          area: number
          created_at: string | null
          crop_type: string
          frequency: string
          humidity: number
          id: string
          recommendations: string
          soil_type: string
          temperature: number
          user_id: string
          water_requirement: number
        }
        Insert: {
          area: number
          created_at?: string | null
          crop_type: string
          frequency: string
          humidity: number
          id?: string
          recommendations: string
          soil_type: string
          temperature: number
          user_id: string
          water_requirement: number
        }
        Update: {
          area?: number
          created_at?: string | null
          crop_type?: string
          frequency?: string
          humidity?: number
          id?: string
          recommendations?: string
          soil_type?: string
          temperature?: number
          user_id?: string
          water_requirement?: number
        }
        Relationships: [
          {
            foreignKeyName: "water_predictions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}