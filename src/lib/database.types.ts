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
      workouts: {
        Row: {
          id: string
          name: string
          style: string | null
          description: string | null
          est_duration_minutes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          style?: string | null
          description?: string | null
          est_duration_minutes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          style?: string | null
          description?: string | null
          est_duration_minutes?: number | null
          created_at?: string
        }
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          position: number
          exercise_name: string
          sets: number | null
          reps: number | null
          time_seconds: number | null
          rest_seconds: number | null
          load_prescription: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          workout_id: string
          position: number
          exercise_name: string
          sets?: number | null
          reps?: number | null
          time_seconds?: number | null
          rest_seconds?: number | null
          load_prescription?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          workout_id?: string
          position?: number
          exercise_name?: string
          sets?: number | null
          reps?: number | null
          time_seconds?: number | null
          rest_seconds?: number | null
          load_prescription?: string | null
          notes?: string | null
        }
      }
      workout_sessions: {
        Row: {
          id: string
          user_id: string | null
          workout_id: string
          started_at: string
          ended_at: string | null
          rpe: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          workout_id: string
          started_at?: string
          ended_at?: string | null
          rpe?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          workout_id?: string
          started_at?: string
          ended_at?: string | null
          rpe?: number | null
          notes?: string | null
        }
      }
      workout_session_exercise_loads: {
        Row: {
          id: string
          session_id: string
          workout_exercise_id: string
          load_used: string | null
          reps_completed: number | null
          time_seconds: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          session_id: string
          workout_exercise_id: string
          load_used?: string | null
          reps_completed?: number | null
          time_seconds?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          workout_exercise_id?: string
          load_used?: string | null
          reps_completed?: number | null
          time_seconds?: number | null
          notes?: string | null
        }
      }
    }
  }
}

// Helper types for the app
export type Workout = Database['public']['Tables']['workouts']['Row']
export type WorkoutExercise = Database['public']['Tables']['workout_exercises']['Row']
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row']
export type WorkoutSessionExerciseLoad = Database['public']['Tables']['workout_session_exercise_loads']['Row']

// Extended types with joins
export type WorkoutWithExercises = Workout & {
  exercises: WorkoutExercise[]
}

export type SessionWithDetails = WorkoutSession & {
  workout?: Workout
  duration?: number // computed in minutes
}




