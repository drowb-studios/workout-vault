import { useEffect, useState } from 'react'
import { Dumbbell, Timer, Repeat } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/simple-dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabaseClient'
import { ActiveSession } from './ActiveSession'
import { SessionHistory } from './SessionHistory'
import type { Workout, WorkoutExercise } from '@/lib/database.types'

interface WorkoutDetailModalProps {
  workout: Workout | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorkoutDetailModal({ workout, open, onOpenChange }: WorkoutDetailModalProps) {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'exercises' | 'session' | 'history'>('exercises')
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null)

  useEffect(() => {
    if (workout && open) {
      fetchExercises()
      setActiveTab('exercises')
    }
  }, [workout, open])

  const fetchExercises = async () => {
    if (!workout) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('workout_exercises')
        .select('*')
        .eq('workout_id', workout.id)
        .order('position', { ascending: true })

      if (error) throw error
      setExercises(data || [])
    } catch (error) {
      console.error('Error fetching exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSessionStart = (sessionId: string, startTime: string) => {
    setActiveSessionId(sessionId)
    setSessionStartTime(startTime)
  }

  const handleSessionComplete = () => {
    setActiveSessionId(null)
    setSessionStartTime(null)
    setActiveTab('history')
  }

  if (!workout) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          {activeSessionId && sessionStartTime && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                ⏱️ Workout in Progress - Timer Running
              </p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                You can switch tabs to view exercises while the timer continues
              </p>
            </div>
          )}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl">{workout.name}</DialogTitle>
              {workout.style && (
                <Badge variant="secondary">{workout.style}</Badge>
              )}
            </div>
          </div>
          {workout.description && (
            <DialogDescription className="text-base">
              {workout.description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'exercises'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Exercises
          </button>
          <button
            onClick={() => setActiveTab('session')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'session'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Start Session
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            History
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'exercises' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading exercises...
                </div>
              ) : exercises.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No exercises found for this workout.
                </div>
              ) : (
                exercises.map((exercise, index) => (
                  <div key={exercise.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-sm">
                          {exercise.position}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold text-lg">{exercise.exercise_name}</h4>
                          
                          <div className="flex flex-wrap gap-3 text-sm">
                            {exercise.sets && (
                              <div className="flex items-center gap-1.5">
                                <Repeat className="h-4 w-4 text-muted-foreground" />
                                <span><span className="font-medium">{exercise.sets}</span> sets</span>
                              </div>
                            )}
                            {exercise.reps && (
                              <div className="flex items-center gap-1.5">
                                <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                <span><span className="font-medium">{exercise.reps}</span> reps</span>
                              </div>
                            )}
                            {exercise.time_seconds && (
                              <div className="flex items-center gap-1.5">
                                <Timer className="h-4 w-4 text-muted-foreground" />
                                <span><span className="font-medium">{exercise.time_seconds}s</span> duration</span>
                              </div>
                            )}
                            {exercise.rest_seconds && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Timer className="h-4 w-4" />
                                <span>{exercise.rest_seconds}s rest</span>
                              </div>
                            )}
                          </div>

                          {exercise.load_prescription && (
                            <p className="text-sm">
                              <span className="font-medium">Load:</span> {exercise.load_prescription}
                            </p>
                          )}

                          {exercise.notes && (
                            <p className="text-sm text-muted-foreground italic">
                              {exercise.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'session' && (
            <ActiveSession
              workoutId={workout.id}
              workoutName={workout.name}
              activeSessionId={activeSessionId}
              sessionStartTime={sessionStartTime}
              onSessionStart={handleSessionStart}
              onSessionComplete={handleSessionComplete}
            />
          )}

          {activeTab === 'history' && (
            <SessionHistory workoutId={workout.id} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}




