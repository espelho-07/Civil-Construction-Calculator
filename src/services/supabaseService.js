/**
 * Supabase service - Calculations, Favorites, Profile
 * Works with Vercel - no backend server needed
 */
import { supabase } from '../lib/supabase';

// ─── Calculations ─────────────────────────────────────────────────────────

export async function getCalculations(userId, options = {}) {
    const { page = 1, limit = 50, type, saved, search } = options;

    let query = supabase
        .from('calculations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

    if (type) query = query.eq('calculator_slug', type);
    if (saved === true) query = query.eq('is_saved', true);
    if (search) {
        query = query.or(`calculator_name.ilike.%${search}%,project_name.ilike.%${search}%,notes.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error } = await query.range(from, to);

    if (error) throw error;

    const { count } = await supabase
        .from('calculations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_deleted', false);

    return {
        calculations: data || [],
        pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
        },
    };
}

export async function saveCalculation(userId, payload) {
    const {
        calculatorSlug,
        calculatorName,
        calculatorIcon,
        inputs,
        outputs,
        isSaved,
        projectName,
        notes,
    } = payload;

    const { data, error } = await supabase
        .from('calculations')
        .insert({
            user_id: userId,
            calculator_slug: calculatorSlug,
            calculator_name: calculatorName,
            calculator_icon: calculatorIcon || 'fa-calculator',
            inputs: inputs || {},
            outputs: outputs || {},
            is_saved: isSaved || false,
            project_name: projectName || null,
            notes: notes || null,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateCalculation(userId, calcId, updates) {
    const { data, error } = await supabase
        .from('calculations')
        .update({
            is_saved: updates.isSaved,
            project_name: updates.projectName,
            notes: updates.notes,
            updated_at: new Date().toISOString(),
        })
        .eq('id', calcId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteCalculation(userId, calcId) {
    const { error } = await supabase
        .from('calculations')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', calcId)
        .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
}

export async function getCalculationStats(userId) {
    const { data: calcs } = await supabase
        .from('calculations')
        .select('calculator_slug, calculator_name, calculator_icon, is_saved, created_at')
        .eq('user_id', userId)
        .eq('is_deleted', false);

    const total = calcs?.length || 0;
    const saved = calcs?.filter((c) => c.is_saved).length || 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const thisMonth = calcs?.filter((c) => new Date(c.created_at) >= startOfMonth).length || 0;

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = calcs?.filter((c) => new Date(c.created_at) >= weekAgo).length || 0;

    const bySlug = {};
    calcs?.forEach((c) => {
        bySlug[c.calculator_slug] = (bySlug[c.calculator_slug] || 0) + 1;
    });
    const byType = Object.entries(bySlug)
        .map(([slug, count]) => {
            const first = calcs.find((c) => c.calculator_slug === slug);
            return { slug, name: first?.calculator_name, icon: first?.calculator_icon, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const mostUsed = byType[0];

    return {
        total,
        saved,
        savedCount: saved,
        thisMonth,
        thisWeek,
        byType,
        mostUsed: mostUsed ? { calculatorName: mostUsed.name } : null,
    };
}

// ─── Favorites ───────────────────────────────────────────────────────────

export async function getFavorites(userId) {
    const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function checkFavorite(userId, calculatorSlug) {
    const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('calculator_slug', calculatorSlug)
        .maybeSingle();

    if (error) throw error;
    return { isFavorite: !!data };
}

export async function removeFavorite(userId, calculatorSlug) {
    const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('calculator_slug', calculatorSlug);
    if (error) throw error;
    return { success: true };
}

export async function toggleFavorite(userId, payload) {
    const { calculatorSlug, calculatorName, calculatorIcon, category } = payload;

    const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('calculator_slug', calculatorSlug)
        .maybeSingle();

    if (existing) {
        await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('calculator_slug', calculatorSlug);
        return { isFavorite: false };
    }

    const { data: fav, error } = await supabase
        .from('favorites')
        .insert({
            user_id: userId,
            calculator_slug: calculatorSlug,
            calculator_name: calculatorName,
            calculator_icon: calculatorIcon || 'fa-calculator',
            category: category || null,
        })
        .select()
        .single();

    if (error) throw error;
    return { isFavorite: true, favorite: fav };
}

// ─── Dashboard (aggregate) ───────────────────────────────────────────────

export async function getDashboardData(userId, user, profile) {
    const [calcRes, stats, favorites] = await Promise.all([
        getCalculations(userId, { limit: 5 }),
        getCalculationStats(userId),
        getFavorites(userId),
    ]);

    const recentCalcs = (calcRes.calculations || []).map((c) => ({
        id: c.id,
        calculatorSlug: c.calculator_slug,
        calculatorName: c.calculator_name,
        calculatorIcon: c.calculator_icon,
        inputs: c.inputs || {},
        outputs: c.outputs || {},
        isSaved: c.is_saved,
        projectName: c.project_name,
        createdAt: c.created_at,
    }));

    const favs = (favorites || []).map((f) => ({
        id: f.id,
        calculatorSlug: f.calculator_slug,
        calculatorName: f.calculator_name,
        calculatorIcon: f.calculator_icon,
    }));

    return {
        user: {
            id: user?.id,
            fullName: user?.fullName || user?.name,
            email: user?.email,
            phone: user?.phone,
            role: 'user',
            lastLoginAt: null,
            isEmailVerified: user?.isEmailVerified,
            createdAt: user?.createdAt,
        },
        profile: profile || {},
        stats: {
            totalCalculations: stats?.total || 0,
            savedCalculations: stats?.saved || 0,
            mostUsedCalculator: stats?.byType?.[0]
                ? { name: stats.byType[0].name, slug: stats.byType[0].slug, icon: stats.byType[0].icon }
                : null,
            lastCalculationDate: recentCalcs[0]?.createdAt || null,
        },
        recentCalculations: recentCalcs,
        favorites: favs,
    };
}

// ─── Profile ─────────────────────────────────────────────────────────────

export async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
}

export async function updateProfile(userId, updates) {
    const { data, error } = await supabase
        .from('profiles')
        .update({
            full_name: updates.name ?? updates.full_name,
            phone: updates.phone,
            profession: updates.profession,
            company: updates.company,
            location: updates.location,
            bio: updates.bio,
            updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ─── Admin (RLS allows admin to read all) ───────────────────────────────────

export async function getAdminStats() {
    const { data: calcs } = await supabase
        .from('calculations')
        .select('id, user_id, calculator_slug, calculator_name, calculator_icon, is_saved, created_at')
        .eq('is_deleted', false);

    const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    const totalCalcs = calcs?.length || 0;
    const savedCalcs = calcs?.filter((c) => c.is_saved).length || 0;
    const uniqueUsers = new Set(calcs?.map((c) => c.user_id) || []).size;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const thisMonth = calcs?.filter((c) => new Date(c.created_at) >= startOfMonth).length || 0;

    const bySlug = {};
    calcs?.forEach((c) => {
        bySlug[c.calculator_slug] = (bySlug[c.calculator_slug] || 0) + 1;
    });
    const topCalculators = Object.entries(bySlug)
        .map(([slug, count]) => {
            const first = calcs.find((c) => c.calculator_slug === slug);
            return { slug, name: first?.calculator_name, icon: first?.calculator_icon, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

    return {
        totalCalculations: totalCalcs,
        savedCalculations: savedCalcs,
        totalUsers: userCount ?? uniqueUsers,
        uniqueActiveUsers: uniqueUsers,
        thisMonth,
        topCalculators,
    };
}

export async function getAdminCalculations(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error } = await supabase
        .from('calculations')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) throw error;

    const { count } = await supabase
        .from('calculations')
        .select('*', { count: 'exact', head: true })
        .eq('is_deleted', false);

    return {
        calculations: data || [],
        pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    };
}

export async function getAdminProfiles(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) throw error;

    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    return {
        profiles: data || [],
        pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    };
}
