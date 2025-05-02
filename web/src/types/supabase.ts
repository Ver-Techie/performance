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
      users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          user_id: string
          punch_in: string
          punch_out: string | null
          date: string
        }
        Insert: {
          id?: string
          user_id: string
          punch_in: string
          punch_out?: string | null
          date: string
        }
        Update: {
          id?: string
          user_id?: string
          punch_in?: string
          punch_out?: string | null
          date?: string
        }
      }
      eod_reports: {
        Row: {
          id: string
          user_id: string
          date: string
          job_applications: Json
          calls_received: number
          submissions: number
          interviews: number
          pipeline_count: number
          screenshots: string[]
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          job_applications: Json
          calls_received: number
          submissions: number
          interviews: number
          pipeline_count: number
          screenshots: string[]
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          job_applications?: Json
          calls_received?: number
          submissions?: number
          interviews?: number
          pipeline_count?: number
          screenshots?: string[]
        }
      }
    }
  }
} 