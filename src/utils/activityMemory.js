/**
 * Frontend-only user activity memory using localStorage.
 * Stores: last visited calculator, recent calculators (max 5), per-calculator input state (numeric only).
 * All access is try/catch wrapped; fails silently if storage unavailable (e.g. incognito).
 */

const KEYS = {
    LAST_VISITED: 'ce_last_visited_calculator',
    RECENT: 'ce_recent_calculators',
    STATE: 'ce_calculator_state',
};

const MAX_RECENT = 5;
const DEBOUNCE_MS = 400;

function isStorageAvailable() {
    try {
        const key = '__ce_test__';
        localStorage.setItem(key, '1');
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

function getJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (raw == null) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function setJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

/** Only persist keys whose values are numbers (safe, minimal). */
function filterNumericOnly(obj) {
    if (obj == null || typeof obj !== 'object') return {};
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'number' && !Number.isNaN(v)) out[k] = v;
    }
    return out;
}

// ─── Last visited ─────────────────────────────────────────────────────────

export function getLastVisited() {
    const data = getJson(KEYS.LAST_VISITED, null);
    if (!data || typeof data.id !== 'string' || typeof data.name !== 'string') return null;
    return {
        id: data.id,
        name: data.name,
        path: typeof data.path === 'string' ? data.path : `/${data.id}`,
        visitedAt: data.visitedAt || null,
    };
}

export function setLastVisited(payload) {
    if (!payload || typeof payload.id !== 'string' || typeof payload.name !== 'string') return false;
    if (!isStorageAvailable()) return false;
    const path = typeof payload.path === 'string' ? payload.path : `/${payload.id}`;
    return setJson(KEYS.LAST_VISITED, {
        id: payload.id,
        name: payload.name,
        path,
        visitedAt: typeof payload.visitedAt === 'string' ? payload.visitedAt : new Date().toISOString(),
    });
}

// ─── Recent calculators (max 5, no duplicates, most recent first) ───────────

export function getRecentCalculators() {
    const list = getJson(KEYS.RECENT, []);
    if (!Array.isArray(list)) return [];
    return list
        .slice(0, MAX_RECENT)
        .filter((item) => item && typeof item.id === 'string' && typeof item.name === 'string')
        .map((item) => ({ ...item, path: item.path || `/${item.id}` }));
}

export function addRecentCalculator({ id, name, path }) {
    if (!id || !name || !isStorageAvailable()) return false;
    const linkPath = typeof path === 'string' ? path : `/${id}`;
    let list = getRecentCalculators();
    const entry = { id, name, path: linkPath };
    list = [entry, ...list.filter((item) => item.id !== id)].slice(0, MAX_RECENT);
    return setJson(KEYS.RECENT, list.map((e) => ({ id: e.id, name: e.name, path: e.path || `/${e.id}` })));
}

// ─── Per-calculator state (numeric key-value only) ──────────────────────────

export function getCalculatorState(calculatorId) {
    if (!calculatorId || typeof calculatorId !== 'string') return null;
    const all = getJson(KEYS.STATE, {});
    const state = all[calculatorId];
    if (state == null || typeof state !== 'object') return null;
    return filterNumericOnly(state);
}

export function setCalculatorState(calculatorId, inputValues) {
    if (!calculatorId || typeof calculatorId !== 'string' || !isStorageAvailable()) return false;
    const filtered = filterNumericOnly(inputValues);
    const all = getJson(KEYS.STATE, {});
    all[calculatorId] = filtered;
    return setJson(KEYS.STATE, all);
}

// ─── Clear only our keys ───────────────────────────────────────────────────

export function clearHistory() {
    try {
        localStorage.removeItem(KEYS.LAST_VISITED);
        localStorage.removeItem(KEYS.RECENT);
        localStorage.removeItem(KEYS.STATE);
        return true;
    } catch {
        return false;
    }
}

// ─── Constants for hooks ───────────────────────────────────────────────────

export { isStorageAvailable, DEBOUNCE_MS };
