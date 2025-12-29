# Workout Vault

A modern personal training app built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under **API**.

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## Features

- 📋 **Workout Library** - Browse and view all your workouts
- 💪 **Exercise Details** - View exercises with sets, reps, load prescriptions, and rest times
- ⏱️ **Live Session Tracking** - Start workouts with a live elapsed timer
- 📊 **Session History** - Track your workout history with notes and duration
- 🎨 **Beautiful UI** - Modern, clean design with Tailwind CSS and shadcn/ui
- 🌙 **Dark Mode** - Full dark mode support

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Supabase** - Backend and database
- **Lucide React** - Icon library

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── WorkoutCard.tsx        # Workout list item
│   ├── WorkoutDetailModal.tsx # Workout details with tabs
│   ├── ActiveSession.tsx      # Session timer and tracking
│   └── SessionHistory.tsx     # Past session history
├── pages/
│   └── WorkoutVaultPage.tsx   # Main page
├── lib/
│   ├── supabaseClient.ts      # Supabase configuration
│   ├── database.types.ts      # Database TypeScript types
│   └── utils.ts               # Utility functions
├── App.tsx
└── main.tsx
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Setup

Your Supabase project should have these tables:

1. **workouts** - Workout metadata
2. **workout_exercises** - Exercises within workouts
3. **workout_sessions** - Completed workout sessions
4. **workout_session_exercise_loads** - Exercise tracking per session

See `PROJECT_CONTEXT.md` for detailed schema information.

## Adding More Components

This project uses shadcn/ui. To add more components:

```bash
npx shadcn@latest add [component-name]
```

Examples:
```bash
npx shadcn@latest add card
npx shadcn@latest add button
npx shadcn@latest add dialog
```

Browse components at: https://ui.shadcn.com/docs/components

## Path Aliases

Import using `@/` prefix:

```typescript
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
```

## Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com/docs)

## License

MIT
