import { useState, useEffect } from 'react'
import { Play, Square, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabaseClient'
import type { WorkoutSession, WorkoutExercise, WorkoutSessionExerciseLoad } from '@/lib/database.types'
import { Separator } from '@/components/ui/separator'

interface ActiveSessionProps {
  workoutId: string
  workoutName: string
  activeSessionId: string | null
  sessionStartTime: string | null
  onSessionStart: (sessionId: string, startTime: string) => void
  onSessionComplete: () => void
}

interface ExerciseLoadData {
  exerciseId: string
  loadUsed: string
  repsCompleted: string
  notes: string
}

export function ActiveSession({ 
  workoutId, 
  workoutName, 
  activeSessionId,
  sessionStartTime,
  onSessionStart,
  onSessionComplete 
}: ActiveSessionProps) {
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [notes, setNotes] = useState('')
  const [isFinishing, setIsFinishing] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [finalDuration, setFinalDuration] = useState(0)
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [exerciseLoads, setExerciseLoads] = useState<Record<string, ExerciseLoadData>>({})
  const [previousLoads, setPreviousLoads] = useState<Record<string, string>>({})
  const [loadingExercises, setLoadingExercises] = useState(false)

  // Load existing session if provided
  useEffect(() => {
    if (activeSessionId && sessionStartTime) {
      setSession({
        id: activeSessionId,
        workout_id: workoutId,
        started_at: sessionStartTime,
        ended_at: null,
        user_id: null,
        rpe: null,
        notes: null
      })
    }
  }, [activeSessionId, sessionStartTime, workoutId])

  // Fetch exercises when workout starts
  useEffect(() => {
    if (session || (activeSessionId && sessionStartTime)) {
      fetchExercises()
      fetchPreviousLoads()
    }
  }, [session, activeSessionId, sessionStartTime, workoutId])

  const fetchExercises = async () => {
    setLoadingExercises(true)
    try {
      const { data, error } = await supabase
        .from('workout_exercises')
        .select('*')
        .eq('workout_id', workoutId)
        .order('position', { ascending: true })

      if (error) throw error
      setExercises(data || [])
      
      // Initialize exercise loads state
      const initialLoads: Record<string, ExerciseLoadData> = {}
      data?.forEach(ex => {
        initialLoads[ex.id] = {
          exerciseId: ex.id,
          loadUsed: '',
          repsCompleted: '',
          notes: ''
        }
      })
      setExerciseLoads(initialLoads)
    } catch (error) {
      console.error('Error fetching exercises:', error)
    } finally {
      setLoadingExercises(false)
    }
  }

  const fetchPreviousLoads = async () => {
    try {
      // Get the most recent completed session for this workout (excluding current session)
      const { data: recentSession, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('workout_id', workoutId)
        .not('ended_at', 'is', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .single()

      if (sessionError || !recentSession) return

      // Get the loads from that session
      const { data: loads, error: loadsError } = await supabase
        .from('workout_session_exercise_loads')
        .select('workout_exercise_id, load_used')
        .eq('session_id', recentSession.id)

      if (loadsError) throw loadsError

      const previousLoadsMap: Record<string, string> = {}
      loads?.forEach(load => {
        if (load.load_used) {
          previousLoadsMap[load.workout_exercise_id] = load.load_used
        }
      })
      setPreviousLoads(previousLoadsMap)
    } catch (error) {
      console.error('Error fetching previous loads:', error)
    }
  }

  const updateExerciseLoad = (exerciseId: string, field: keyof ExerciseLoadData, value: string) => {
    setExerciseLoads(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value
      }
    }))
  }

  const saveExerciseLoads = async (sessionId: string) => {
    try {
      // Only save exercises that have some data entered
      const loadsToSave = Object.values(exerciseLoads).filter(
        load => load.loadUsed || load.repsCompleted || load.notes
      ).map(load => ({
        session_id: sessionId,
        workout_exercise_id: load.exerciseId,
        load_used: load.loadUsed || null,
        reps_completed: load.repsCompleted ? parseInt(load.repsCompleted) : null,
        notes: load.notes || null
      }))

      if (loadsToSave.length > 0) {
        const { error } = await supabase
          .from('workout_session_exercise_loads')
          .insert(loadsToSave as any)

        if (error) throw error
      }
    } catch (error) {
      console.error('Error saving exercise loads:', error)
      throw error
    }
  }

  // Timer effect - runs continuously
  useEffect(() => {
    if (!sessionStartTime) return

    const interval = setInterval(() => {
      const started = new Date(sessionStartTime).getTime()
      const now = Date.now()
      const elapsed = Math.floor((now - started) / 1000)
      setElapsedSeconds(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionStartTime])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartWorkout = async () => {
    try {
      console.log('Starting workout for workoutId:', workoutId)
      
      // For MVP, we'll use a default user_id. In production, get this from auth.
      const defaultUserId = '00000000-0000-0000-0000-000000000000'
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          workout_id: workoutId,
          user_id: defaultUserId,
          started_at: new Date().toISOString(),
        } as any)
        .select()
        .single()

      console.log('Insert result:', { data, error })
      if (error) throw error
      setSession(data)
      onSessionStart(data.id, data.started_at)
    } catch (error) {
      console.error('Error starting workout:', error)
      alert(`Failed to start workout: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleFinishWorkout = async () => {
    if (!session) return

    setIsFinishing(true)
    try {
      // Save exercise loads first
      await saveExerciseLoads(session.id)

      // @ts-ignore - Supabase type issue
      const { error } = await supabase
        .from('workout_sessions')
        .update({
          ended_at: new Date().toISOString(),
          notes: notes || null,
        })
        .eq('id', session.id)

      if (error) throw error
      
      // Save the final duration and show summary
      setFinalDuration(elapsedSeconds)
      setIsFinished(true)
    } catch (error) {
      console.error('Error finishing workout:', error)
      alert('Failed to finish workout. Please try again.')
    } finally {
      setIsFinishing(false)
    }
  }

  const handleUpdateNotes = async () => {
    if (!session) return

    try {
      // @ts-ignore - Supabase type issue
      const { error } = await supabase
        .from('workout_sessions')
        .update({
          notes: notes || null,
        })
        .eq('id', session.id)

      if (error) throw error
      
      alert('Notes saved!')
    } catch (error) {
      console.error('Error updating notes:', error)
      alert('Failed to save notes.')
    }
  }

  const handleClose = () => {
    onSessionComplete()
  }

  if (!session && !sessionStartTime) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Ready to start <span className="font-semibold">{workoutName}</span>?
          </p>
          <Button onClick={handleStartWorkout} size="lg">
            <Play className="mr-2 h-5 w-5" />
            Start Workout
          </Button>
        </div>
      </div>
    )
  }

  // Show completion summary
  if (isFinished) {
    return (
      <div className="space-y-6">
        <div className="text-center py-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
            🎉 Workout Complete!
          </p>
          <p className="text-3xl font-bold font-mono">{formatTime(finalDuration)}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Duration</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Session Notes</label>
          <Textarea
            placeholder="Add or edit notes about your workout..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <Button 
            onClick={handleUpdateNotes}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Save Notes
          </Button>
        </div>

        <Button 
          onClick={handleClose} 
          size="lg" 
          className="w-full"
        >
          Close
        </Button>
      </div>
    )
  }

  // Active workout
  return (
    <div className="space-y-6">
      <div className="text-center py-6 bg-primary/5 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Elapsed Time</p>
        <p className="text-4xl font-bold font-mono">{formatTime(elapsedSeconds)}</p>
      </div>

      {/* Exercise tracking section */}
      {loadingExercises ? (
        <div className="text-center py-4 text-muted-foreground">
          Loading exercises...
        </div>
      ) : exercises.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Track Your Weights</h3>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="border rounded-lg p-4 space-y-3 bg-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{exercise.exercise_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets && exercise.reps && `${exercise.sets} sets × ${exercise.reps} reps`}
                      {exercise.load_prescription && ` • ${exercise.load_prescription}`}
                    </p>
                    {previousLoads[exercise.id] && (
                      <p className="text-xs text-primary mt-1">
                        Last time: {previousLoads[exercise.id]}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Weight Used
                    </label>
                    <Input
                      placeholder="e.g., 135 lbs"
                      value={exerciseLoads[exercise.id]?.loadUsed || ''}
                      onChange={(e) => updateExerciseLoad(exercise.id, 'loadUsed', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Reps Done
                    </label>
                    <Input
                      type="number"
                      placeholder={exercise.reps?.toString() || '0'}
                      value={exerciseLoads[exercise.id]?.repsCompleted || ''}
                      onChange={(e) => updateExerciseLoad(exercise.id, 'repsCompleted', e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Notes (Optional)
                  </label>
                  <Input
                    placeholder="How did this feel?"
                    value={exerciseLoads[exercise.id]?.notes || ''}
                    onChange={(e) => updateExerciseLoad(exercise.id, 'notes', e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <Separator />

      <div className="space-y-2">
        <label className="text-sm font-medium">Session Notes (Optional)</label>
        <Textarea
          placeholder="How did the workout feel? Any observations..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button 
        onClick={handleFinishWorkout} 
        variant="destructive" 
        size="lg" 
        className="w-full"
        disabled={isFinishing}
      >
        <Square className="mr-2 h-5 w-5" />
        {isFinishing ? 'Finishing...' : 'Finish Workout'}
      </Button>
    </div>
  )
}

