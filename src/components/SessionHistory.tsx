import { useEffect, useState } from 'react'
import { Calendar, Clock, Edit2, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import type { SessionWithDetails, WorkoutSessionExerciseLoad, WorkoutExercise } from '@/lib/database.types'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface SessionHistoryProps {
  workoutId: string
}

interface SessionWithLoads extends SessionWithDetails {
  loads?: (WorkoutSessionExerciseLoad & { exercise?: WorkoutExercise })[]
}

export function SessionHistory({ workoutId }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<SessionWithLoads[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editNotes, setEditNotes] = useState('')
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchSessions()
  }, [workoutId])

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('workout_id', workoutId)
        .not('ended_at', 'is', null)
        .order('started_at', { ascending: false })
        .limit(10)

      if (error) throw error

      // Calculate duration for each session
      const sessionsWithDuration = (data as any)?.map((session: any) => {
        const duration = session.ended_at
          ? Math.floor(
              (new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()) / 
              60000
            )
          : undefined
        return { ...session, duration }
      }) || []

      // Fetch exercise loads for each session
      const sessionsWithLoads = await Promise.all(
        sessionsWithDuration.map(async (session) => {
          const { data: loads, error: loadsError } = await supabase
            .from('workout_session_exercise_loads')
            .select(`
              *,
              exercise:workout_exercises(*)
            `)
            .eq('session_id', session.id)

          if (loadsError) {
            console.error('Error fetching loads:', loadsError)
            return { ...session, loads: [] }
          }

          return { ...session, loads: loads as any }
        })
      )

      setSessions(sessionsWithLoads)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSessionExpanded = (sessionId: string) => {
    setExpandedSessions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId)
      } else {
        newSet.add(sessionId)
      }
      return newSet
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const handleEditSession = (session: any) => {
    setEditingSessionId(session.id)
    setEditNotes(session.notes || '')
  }

  const handleSaveNotes = async (sessionId: string) => {
    try {
      // @ts-ignore
      const { error } = await supabase
        .from('workout_sessions')
        .update({ notes: editNotes || null })
        .eq('id', sessionId)

      if (error) throw error

      // Update local state
      setSessions(sessions.map(s => 
        s.id === sessionId ? { ...s, notes: editNotes } : s
      ))
      setEditingSessionId(null)
      alert('Notes saved!')
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Failed to save notes')
    }
  }

  const handleCancelEdit = () => {
    setEditingSessionId(null)
    setEditNotes('')
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading history...
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No previous sessions yet. Complete your first workout to see history!
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        Previous Sessions
      </h3>
      <div className="space-y-3">
        {sessions.map((session, index) => (
          <div key={session.id}>
            {index > 0 && <Separator className="my-3" />}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDate(session.started_at)}</span>
                  <span className="text-muted-foreground">at {formatTime(session.started_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {session.duration !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{session.duration} min</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSession(session)}
                    className="h-7 w-7 p-0"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              {editingSessionId === session.id ? (
                <div className="space-y-2 pl-6">
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes about this workout..."
                    rows={3}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSaveNotes(session.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {session.notes && (
                    <p className="text-sm text-muted-foreground italic pl-6">
                      "{session.notes}"
                    </p>
                  )}
                  {session.rpe && (
                    <p className="text-sm text-muted-foreground pl-6">
                      RPE: {session.rpe}/10
                    </p>
                  )}
                  
                  {/* Exercise loads section */}
                  {session.loads && session.loads.length > 0 && (
                    <div className="pl-6 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSessionExpanded(session.id)}
                        className="h-8 px-2 text-sm"
                      >
                        <Dumbbell className="h-3.5 w-3.5 mr-1.5" />
                        {expandedSessions.has(session.id) ? 'Hide' : 'Show'} Weights Used
                        {expandedSessions.has(session.id) ? (
                          <ChevronUp className="h-3.5 w-3.5 ml-1" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 ml-1" />
                        )}
                      </Button>
                      
                      {expandedSessions.has(session.id) && (
                        <div className="mt-2 space-y-2 border-l-2 border-primary/20 pl-3">
                          {session.loads.map((load: any) => (
                            <div key={load.id} className="text-sm">
                              <p className="font-medium text-foreground">
                                {load.exercise?.exercise_name || 'Unknown Exercise'}
                              </p>
                              <div className="text-muted-foreground space-y-0.5">
                                {load.load_used && (
                                  <p className="text-xs">
                                    Weight: <span className="font-medium text-primary">{load.load_used}</span>
                                  </p>
                                )}
                                {load.reps_completed && (
                                  <p className="text-xs">
                                    Reps: {load.reps_completed}
                                  </p>
                                )}
                                {load.notes && (
                                  <p className="text-xs italic">
                                    Note: {load.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

