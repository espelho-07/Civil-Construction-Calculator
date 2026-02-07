import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ALL_CALCULATORS } from '../constants/calculatorRoutes';
import {
    isStorageAvailable,
    getLastVisited,
    getRecentCalculators,
    setLastVisited,
    addRecentCalculator,
    getCalculatorState,
    setCalculatorState,
    clearHistory,
    DEBOUNCE_MS,
} from '../utils/activityMemory';

const NON_CALCULATOR_PATHS = [
    '/',
    '/about',
    '/contact',
    '/coming-soon',
    '/terms-of-use',
    '/privacy-policy',
];

/**
 * Resolve calculator id and display name from current pathname.
 * Returns null for home, category, auth, dashboard, and other non-calculator routes.
 */
export function getCalculatorFromPath(pathname) {
    if (!pathname || NON_CALCULATOR_PATHS.includes(pathname)) return null;
    if (pathname.startsWith('/category') || pathname.startsWith('/auth') || pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/settings') || pathname.startsWith('/history') || pathname.startsWith('/saved')) return null;
    const id = pathname.slice(1).replace(/\//g, '-');
    const entry = ALL_CALCULATORS.find((c) => c.slug === pathname);
    const name = entry
        ? entry.name
        : pathname
              .slice(1)
              .replace(/-/g, ' ')
              .replace(/\//g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase());
    return { id, name, path: pathname };
}

/**
 * For homepage: last visited, recent list, clear, and storage availability.
 * Do not block UI if storage fails.
 */
export function useActivityMemory() {
    const [lastVisited, setLastVisitedState] = useState(null);
    const [recentCalculators, setRecentCalculatorsState] = useState([]);
    const [available, setAvailable] = useState(false);

    const load = useCallback(() => {
        if (!isStorageAvailable()) {
            setAvailable(false);
            setLastVisitedState(null);
            setRecentCalculatorsState([]);
            return;
        }
        setAvailable(true);
        setLastVisitedState(getLastVisited());
        setRecentCalculatorsState(getRecentCalculators());
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const clear = useCallback(() => {
        clearHistory();
        setLastVisitedState(null);
        setRecentCalculatorsState([]);
    }, []);

    return {
        lastVisited,
        recentCalculators,
        clearHistory: clear,
        isAvailable: available,
        refresh: load,
    };
}

function debounce(fn, ms) {
    let timeout;
    const debounced = (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
    debounced.cancel = () => clearTimeout(timeout);
    debounced.flush = (...args) => {
        clearTimeout(timeout);
        fn(...args);
    };
    return debounced;
}

/**
 * For calculator pages: record visit on load, restore last inputs, debounced save, persist on calculate.
 * Pass calculatorId and calculatorName (e.g. from getCalculatorFromPath(location.pathname)).
 */
export function useCalculatorActivity(calculatorId, calculatorName) {
    const restoredState = useMemo(() => {
        if (!calculatorId) return null;
        return getCalculatorState(calculatorId);
    }, [calculatorId]);

    useEffect(() => {
        if (!calculatorId || !calculatorName || !isStorageAvailable()) return;
        setLastVisited({ id: calculatorId, name: calculatorName, visitedAt: new Date().toISOString() });
        addRecentCalculator({ id: calculatorId, name: calculatorName });
    }, [calculatorId, calculatorName]);

    const saveStateRef = useRef(null);
    if (!saveStateRef.current) {
        saveStateRef.current = debounce((state) => {
            if (calculatorId && isStorageAvailable()) setCalculatorState(calculatorId, state);
        }, DEBOUNCE_MS);
    }
    const saveState = saveStateRef.current;

    const persistNow = useCallback(
        (state) => {
            if (calculatorId && isStorageAvailable()) setCalculatorState(calculatorId, state);
            saveState.cancel?.();
        },
        [calculatorId]
    );

    return {
        restoredState,
        saveState,
        persistNow,
    };
}

/**
 * Renders nothing. When the current route is a calculator page, records it as last visited
 * and adds to recent list. Mount once inside Router (e.g. in App) so all calculator visits are tracked.
 */
export function RecordCalculatorVisit() {
    const { pathname } = useLocation();
    const calculator = useMemo(() => getCalculatorFromPath(pathname), [pathname]);

    useEffect(() => {
        if (!calculator || !isStorageAvailable()) return;
        setLastVisited({ id: calculator.id, name: calculator.name, path: calculator.path, visitedAt: new Date().toISOString() });
        addRecentCalculator({ id: calculator.id, name: calculator.name, path: calculator.path });
    }, [calculator?.id, calculator?.name, calculator?.path]);

    return null;
}
