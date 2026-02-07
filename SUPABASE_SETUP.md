# Supabase Backend Setup (Vercel-Compatible)

This app uses **Supabase** for auth and database. No separate backend server needed — works perfectly with Vercel.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project (choose region close to your users)
3. Wait for the project to finish provisioning

## 2. Run Database Migration

1. In Supabase Dashboard → **SQL Editor**
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run it

Or use Supabase CLI:
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

## 3. Configure Auth (Supabase Dashboard)

1. Go to **Authentication** → **Providers** → **Email**
2. Enable "Email" provider
3. Optional: Disable "Confirm email" for faster testing (enable in production)
4. Under **URL Configuration**:
   - Site URL: `https://your-vercel-app.vercel.app` (or `http://localhost:5173` for dev)
   - Redirect URLs: Add `https://your-vercel-app.vercel.app/**` and `http://localhost:5173/**`

## 4. Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 5. Add to Vercel

1. In your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key

## 6. Local Development

Create `.env` in the project root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then run `npm run dev`

## Tables Created

- **profiles** – User profile (name, phone, etc.) — auto-created on signup
- **calculations** – Saved calculator runs
- **favorites** – Bookmarked calculators
- **user_preferences** – Settings sync (optional)

All tables use Row Level Security (RLS) so users can only access their own data.
