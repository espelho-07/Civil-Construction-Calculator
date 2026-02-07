import { useRef, useCallback, useEffect } from 'react';

const SCROLL_AMOUNT = 48;
const PAGE_SCROLL_RATIO = 0.8;

/**
 * Hook for full keyboard operation of calculator forms.
 * - Enter: next field; on last field → trigger Calculate and focus result.
 * - Shift+Enter: previous field.
 * - Arrow Left/Right at boundary: previous/next field.
 * - Arrow Up/Down: smooth page scroll (do not change number input values).
 * - Prevents Enter from submitting forms.
 */
export function useCalculatorKeyboard(options = {}) {
    const {
        inputCount,
        onCalculate,
        autoFocusFirst = true,
        scrollAmount = SCROLL_AMOUNT,
    } = options;

    const inputRefs = useRef([]);
    const resultRef = useRef(null);
    const containerRef = useRef(null);

    const focusInput = useCallback((index) => {
        const ref = inputRefs.current[index];
        if (ref?.current) {
            ref.current.focus();
            if (typeof ref.current.select === 'function') ref.current.select();
        }
    }, []);

    const focusResult = useCallback(() => {
        if (resultRef.current) {
            resultRef.current.focus();
        }
    }, []);

    const getFocusedIndex = useCallback(() => {
        const active = document.activeElement;
        for (let i = 0; i < inputRefs.current.length; i++) {
            if (inputRefs.current[i]?.current === active) return i;
        }
        return -1;
    }, []);

    const handleKeyDown = useCallback((e) => {
        const target = e.target;
        const tag = target.tagName?.toLowerCase();
        const isInput = tag === 'input' || tag === 'select' || tag === 'textarea';
        const isNumberInput = tag === 'input' && (target.type === 'number' || target.type === 'text');

        // Enter: next field or Calculate on last; never submit form
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                const idx = getFocusedIndex();
                if (idx <= 0) return;
                focusInput(idx - 1);
                return;
            }
            const idx = getFocusedIndex();
            if (idx < 0) return;
            if (idx >= inputCount - 1) {
                onCalculate?.();
                focusResult();
                return;
            }
            focusInput(idx + 1);
            return;
        }

        // Arrow Left at start of field → previous input
        if (e.key === 'ArrowLeft' && isInput) {
            const start = target.selectionStart ?? 0;
            if (start === 0) {
                const idx = getFocusedIndex();
                if (idx > 0) {
                    e.preventDefault();
                    focusInput(idx - 1);
                }
            }
            return;
        }

        // Arrow Right at end of field → next input
        if (e.key === 'ArrowRight' && isInput) {
            const len = (target.value || '').length;
            const end = target.selectionEnd ?? len;
            if (end === len) {
                const idx = getFocusedIndex();
                if (idx >= 0 && idx < inputCount - 1) {
                    e.preventDefault();
                    focusInput(idx + 1);
                } else if (idx === inputCount - 1) {
                    e.preventDefault();
                    onCalculate?.();
                    focusResult();
                }
            }
            return;
        }

        // Arrow Up/Down: scroll page, do not change number input value
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && isInput) {
            e.preventDefault();
            const dir = e.key === 'ArrowDown' ? 1 : -1;
            window.scrollBy({ top: dir * scrollAmount, left: 0, behavior: 'smooth' });
            return;
        }
    }, [inputCount, onCalculate, getFocusedIndex, focusInput, focusResult, scrollAmount]);

    // Global: Page Up/Down, Home/End for page scroll (when focus in calculator container)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleGlobalKey = (e) => {
            const active = document.activeElement;
            if (!el.contains(active)) return;
            const tag = active?.tagName?.toLowerCase();
            const isInput = tag === 'input' || tag === 'select' || tag === 'textarea';

            if (e.key === 'PageDown') {
                e.preventDefault();
                window.scrollBy({ top: window.innerHeight * PAGE_SCROLL_RATIO, behavior: 'smooth' });
            } else if (e.key === 'PageUp') {
                e.preventDefault();
                window.scrollBy({ top: -window.innerHeight * PAGE_SCROLL_RATIO, behavior: 'smooth' });
            } else if (e.key === 'Home' && isInput) {
                // Home in input: go to start of field; if already at start, focus first input
                if (active.selectionStart === 0) {
                    const idx = getFocusedIndex();
                    if (idx > 0) {
                        e.preventDefault();
                        focusInput(0);
                    }
                }
            } else if (e.key === 'End' && isInput) {
                const len = (active.value || '').length;
                if (active.selectionEnd === len) {
                    const idx = getFocusedIndex();
                    if (idx >= 0 && idx < inputCount - 1) {
                        e.preventDefault();
                        focusInput(inputCount - 1);
                    }
                }
            }
        };

        document.addEventListener('keydown', handleGlobalKey, true);
        return () => document.removeEventListener('keydown', handleGlobalKey, true);
    }, [inputCount, getFocusedIndex, focusInput]);

    // Page-level Home/End (scroll to top/bottom) when not in input
    useEffect(() => {
        const handlePageScroll = (e) => {
            const active = document.activeElement;
            const tag = active?.tagName?.toLowerCase();
            const isInput = tag === 'input' || tag === 'select' || tag === 'textarea';
            if (isInput) return;

            if (e.key === 'Home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                e.preventDefault();
            } else if (e.key === 'End') {
                window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                e.preventDefault();
            }
        };
        document.addEventListener('keydown', handlePageScroll);
        return () => document.removeEventListener('keydown', handlePageScroll);
    }, []);

    // Ensure we have enough refs (create ref objects for each index)
    const getInputRef = useCallback((index) => {
        if (index < 0 || index >= inputCount) return { current: null };
        while (inputRefs.current.length <= index) {
            inputRefs.current.push({ current: null });
        }
        return inputRefs.current[index];
    }, [inputCount]);

    // Auto-focus first input on mount
    useEffect(() => {
        if (!autoFocusFirst || inputCount === 0) return;
        const t = setTimeout(() => focusInput(0), 100);
        return () => clearTimeout(t);
    }, [autoFocusFirst, inputCount, focusInput]);

    return {
        getInputRef,
        resultRef,
        containerRef,
        handleKeyDown,
        focusFirstInput: () => focusInput(0),
        focusResult,
    };
}
