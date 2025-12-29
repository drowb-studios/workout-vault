# Workout Vault - Project Context

## Overview
**Workout Vault** is a personal training app built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Supabase. It helps users store structured workouts, track workout sessions, and view progression history.

## Tech Stack
- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Backend/Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Component Library**: Radix UI primitives (via shadcn/ui)

## Project Structure

```
workout-vault/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── badge.tsx
│   │   │   └── separator.tsx
│   │   ├── WorkoutCard.tsx           # Displays workout summary
│   │   ├── WorkoutDetailModal.tsx    # Shows workout details with tabs
│   │   ├── ActiveSession.tsx         # Timer and session management
│   │   └── SessionHistory.tsx        # Past workout sessions
│   ├── pages/
│   │   └── WorkoutVaultPage.tsx      # Main page with workout list
│   ├── lib/
│   │   ├── supabaseClient.ts         # Supabase client setup
│   │   ├── database.types.ts         # TypeScript types for DB
│   │   └── utils.ts                  # Utility functions (cn)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                     # Tailwind + CSS variables
├── components.json                   # shadcn/ui configuration
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## Database Schema (Supabase)

### Tables

**workouts**
- `id` (uuid, pk)
- `name` (text) - Workout name
- `style` (text) - e.g., "Strength", "Cardio", "HIIT"
- `description` (text) - Workout description
- `est_duration_minutes` (int) - Estimated duration
- `created_at` (timestamptz)

**workout_exercises**
- `id` (uuid, pk)
- `workout_id` (uuid, fk → workouts)
- `position` (int) - Exercise order
- `exercise_name` (text)
- `sets` (int)
- `reps` (int)
- `time_seconds` (int) - For timed exercises
- `rest_seconds` (int) - Rest between sets
- `load_prescription` (text) - e.g., "RPE 8", "60% 1RM"
- `notes` (text)

**workout_sessions**
- `id` (uuid, pk)
- `user_id` (uuid)
- `workout_id` (uuid, fk → workouts)
- `started_at` (timestamptz)
- `ended_at` (timestamptz)
- `rpe` (int) - Rate of Perceived Exertion (1-10)
- `notes` (text)

**workout_session_exercise_loads**
- `id` (uuid, pk)
- `session_id` (uuid, fk → workout_sessions)
- `workout_exercise_id` (uuid, fk → workout_exercises)
- `load_used` (text)
- `reps_completed` (int)
- `time_seconds` (int)
- `notes` (text)

## Features Implemented

### ✅ MVP Features
1. **Workout List Page**
   - Fetches and displays all workouts from Supabase
   - Shows workout name, style, description, and estimated duration
   - Grid layout with responsive design
   - Click to open workout details

2. **Workout Detail Modal**
   - Three tabs: Exercises, Start Session, History
   - **Exercises Tab**: Displays all exercises with sets, reps, load, rest
   - **Session Tab**: Start/finish workout with live timer
   - **History Tab**: View past session history

3. **Active Session**
   - Start workout button creates session record
   - Live elapsed timer (MM:SS or HH:MM:SS format)
   - **Weight Tracking**: Log weights used for each exercise during the session
   - Shows previous weights used (from last session) for reference
   - Track reps completed and exercise-specific notes
   - Optional session notes
   - Finish workout updates session with end time and saves all exercise loads

4. **Session History**
   - Lists previous completed sessions
   - Shows date, time, duration, and notes
   - Displays "Today", "Yesterday", or formatted date
   - Sorted by most recent first
   - **Expandable weight details**: Click to view weights used in each past session
   - Shows exercise name, weight used, reps completed, and notes for each exercise

5. **UI/UX**
   - Clean, modern design with Tailwind CSS
   - shadcn/ui components for consistency
   - Loading states and error handling
   - Responsive layout for mobile and desktop
   - Dark mode support (via Tailwind dark mode)

## Environment Setup

### Required Environment Variables
Create a `.env` file in the `workout-vault` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation
```bash
cd workout-vault
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## Key Design Decisions

1. **No Authentication (MVP)**: Currently uses anonymous access. User auth can be added later.
2. **Simple Timer**: Uses client-side timer with elapsed time calculation.
3. **Modal-Based UI**: Workout details open in a modal rather than navigating to a new page.
4. **Tab Navigation**: Exercise details, session management, and history in separate tabs.
5. **Responsive Grid**: 1 column on mobile, 2 on tablet, 3 on desktop.

## Future Enhancements
- [ ] User authentication with Supabase Auth
- [x] Track loads per exercise during session ✅
- [ ] Add RPE rating during session finish
- [ ] Charts and progression analytics (show weight progression over time)
- [ ] Exercise library with autocomplete
- [ ] Create/edit workouts in the UI
- [ ] Workout templates and favorites
- [ ] Exercise video demonstrations
- [ ] Rest timer between sets
- [ ] Export workout history
- [ ] One-rep max (1RM) calculator
- [ ] Personal records (PR) tracking

## Development Notes
- All components use functional React with hooks
- TypeScript strict mode enabled
- Database types are generated in `database.types.ts`
- Path aliases use `@/` prefix (e.g., `@/components/ui/button`)
- shadcn/ui components can be added via `npx shadcn@latest add <component>`

## Troubleshooting

### Supabase Connection Issues
- Verify `.env` file exists with correct credentials
- Check Supabase project is active
- Ensure RLS policies allow read/write access

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

### Styling Issues
- Ensure Tailwind is processing files: check `tailwind.config.js` content paths
- Verify CSS variables are loaded in `index.css`




