# Admin Dashboard Setup

## Admin account

- **Email:** `darpantrader1727@gmail.com`
- **Password:** Set a strong password when you sign up (e.g. 12+ characters with letters, numbers, symbols).

This is the only admin account. Access is enforced by email and (after migration) by the `role` column in `profiles`.

## Steps

### 1. Run the admin migration

In Supabase Dashboard → **SQL Editor**, run the contents of:

`supabase/migrations/002_admin_role.sql`

This will:

- Add a `role` column to `profiles` (default `'user'`).
- Define `is_admin()` so the DB treats `darpantrader1727@gmail.com` as admin.
- Allow admin to read all calculations and profiles (for the dashboard).
- Update the signup trigger so new signups with that email get `role = 'admin'`.

### 2. Create the admin user (if needed)

**Option A – Sign up in the app**

1. Go to **Sign up** and register with:
   - Email: `darpantrader1727@gmail.com`
   - Strong password (e.g. `Admin@CivilCalc#2025` or your own).
2. After signup, the trigger will set `role = 'admin'` for this email (once 002 is applied).

**Option B – Account already exists**

If this email is already a user, set their role in Supabase:

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'darpantrader1727@gmail.com');
```

### 3. Log in and open Admin

1. Log in with `darpantrader1727@gmail.com` and your password.
2. Open the user menu (avatar) in the header.
3. Click **Admin Dashboard** (only visible for admin).
4. Or go directly to: **/admin**

## Admin dashboard

- **Dashboard** – Totals for calculations, saved items, users, and top calculators.
- **All Calculations** – List of recent calculations from all users.
- **Calculator Usage** – Most used calculators (with counts).
- **Users** – List of user profiles.

All data is read-only; RLS limits access so only the admin email can see site-wide data.
