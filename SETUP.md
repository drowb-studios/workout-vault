# Workout Vault - Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Git (optional)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd workout-vault
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or use your existing one
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon/public key**

### 3. Create Environment File

Create a `.env` file in the `workout-vault` directory:

```bash
# On macOS/Linux
touch .env

# On Windows (PowerShell)
New-Item .env -ItemType File
```

Add your Supabase credentials to `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important**: Never commit your `.env` file to version control!

### 4. Verify Database Tables

Make sure your Supabase project has these tables:

- `workouts`
- `workout_exercises`
- `workout_sessions`
- `workout_session_exercise_loads`

See `PROJECT_CONTEXT.md` for the complete schema.

### 5. Configure RLS (Row Level Security)

For the MVP, you can disable RLS on these tables in Supabase SQL Editor:

```sql
ALTER TABLE workouts DISABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises DISABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE workout_session_exercise_loads DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning**: Only do this for development! Enable proper RLS policies for production.

### 6. Start Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### 7. Test the App

1. You should see the "Workout Vault" page
2. If you have workouts in your database, they'll appear as cards
3. Click a workout to see details
4. Try starting and finishing a workout session
5. Check the history tab to see past sessions

## Troubleshooting

### "Failed to load workouts" Error

- Check that your `.env` file exists and has the correct credentials
- Verify your Supabase project is active (not paused)
- Check browser console for specific error messages
- Ensure RLS is disabled or configured correctly

### Blank Screen

- Check browser console for errors
- Verify all dependencies installed: `npm install`
- Try clearing cache and rebuilding: `rm -rf node_modules && npm install`

### TypeScript Errors

- Run `npm run build` to see all TypeScript errors
- Make sure all imports use the `@/` path alias correctly

### Styling Not Working

- Verify Tailwind is configured in `tailwind.config.js`
- Check that `index.css` has the Tailwind directives
- Clear Vite cache: `rm -rf node_modules/.vite`

## Next Steps

Once your app is running:

1. Add some test workouts to your Supabase database
2. Explore the workout detail modal
3. Try starting and completing a workout session
4. Check out the session history

## Sample Data

Here's a sample workout you can insert via Supabase SQL Editor:

```sql
-- Insert a sample workout
INSERT INTO workouts (name, style, description, est_duration_minutes)
VALUES (
  'Upper Body Strength',
  'Strength',
  'A comprehensive upper body workout focusing on pushing and pulling movements',
  45
);

-- Get the workout ID (replace with actual ID from the insert)
-- Then insert exercises:
INSERT INTO workout_exercises (workout_id, position, exercise_name, sets, reps, rest_seconds, load_prescription)
VALUES
  ('<workout-id>', 1, 'Bench Press', 4, 8, 120, 'RPE 8'),
  ('<workout-id>', 2, 'Barbell Row', 4, 8, 120, 'RPE 8'),
  ('<workout-id>', 3, 'Overhead Press', 3, 10, 90, 'RPE 7'),
  ('<workout-id>', 4, 'Pull-ups', 3, 10, 90, 'Bodyweight');
```

## Need Help?

- Check `PROJECT_CONTEXT.md` for detailed project information
- Review `README.md` for general information
- Check the Supabase documentation: https://supabase.com/docs
- Review shadcn/ui components: https://ui.shadcn.com

Happy training! 💪




