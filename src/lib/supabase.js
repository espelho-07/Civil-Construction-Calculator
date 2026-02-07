import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client only if valid credentials are provided
let supabase = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase.co')) {
    try {
        supabase = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        });
    } catch (error) {
        console.warn('Failed to initialize Supabase:', error.message);
        console.warn('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    }
} else {
    console.warn('Supabase credentials not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
}

export { supabase };
