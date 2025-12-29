import { useEffect, useState } from 'react'
import { Dumbbell } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { WorkoutCard } from '@/components/WorkoutCard'
import { WorkoutDetailModal } from '@/components/WorkoutDetailModal'
import type { Workout } from '@/lib/database.types'

export function WorkoutVaultPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setWorkouts(data || [])
    } catch (err) {
      console.error('Error fetching workouts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load workouts')
    } finally {
      setLoading(false)
    }
  }

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout)
    setModalOpen(true)
  }

  const handleModalClose = (open: boolean) => {
    setModalOpen(open)
    if (!open) {
      setSelectedWorkout(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Dumbbell className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Workout Vault</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Your personal training companion
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading workouts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-destructive/10 text-destructive rounded-lg p-6 max-w-md mx-auto">
              <p className="font-semibold">Error loading workouts</p>
              <p className="text-sm mt-2">{error}</p>
              <button
                onClick={fetchWorkouts}
                className="mt-4 text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No workouts yet</h2>
            <p className="text-muted-foreground">
              Add your first workout to get started!
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-1">Your Workouts</h2>
              <p className="text-muted-foreground">
                {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'} available
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onClick={() => handleWorkoutClick(workout)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Workout Detail Modal */}
      <WorkoutDetailModal
        workout={selectedWorkout}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </div>
  )
}




