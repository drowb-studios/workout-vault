import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Workout } from '@/lib/database.types'

interface WorkoutCardProps {
  workout: Workout
  onClick: () => void
}

export function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{workout.name}</CardTitle>
          {workout.style && (
            <Badge variant="secondary">{workout.style}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {workout.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {workout.description}
            </p>
          )}
          {workout.est_duration_minutes && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{workout.est_duration_minutes} min</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}




