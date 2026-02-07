# Keyboard UX & Calculator Logic Audit

**Scope:** Full keyboard operation, Enter/arrow behavior, field-to-field focus, calculator logic, accessibility, error handling.  
**Reference implementation:** Cement Concrete Calculator (keyboard hook applied).  
**Status:** Partial compliance; one calculator fully upgraded; pattern ready for rollout.

---

## 1. ENTER KEY BEHAVIOR (MANDATORY)

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Enter → next input | ✔ Implemented | `useCalculatorKeyboard` in Cement Concrete: Enter moves focus to next field (Grade → Length → Width → Depth). |
| Enter on last input → trigger Calculate | ✔ Implemented | Enter on Depth runs `onCalculate()` and moves focus to result region. |
| Shift+Enter → previous input | ✔ Implemented | `handleKeyDown` handles Shift+Enter and focuses previous field. |
| Enter must never submit form | ✔ Implemented | `e.preventDefault()` on Enter in the hook; form has no native submit (buttons are `type="button"`). |

**Where applied:** Cement Concrete Calculator only. Other calculators do not yet use the hook; Enter may submit or do nothing.

---

## 2. ARROW KEY NAVIGATION

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Arrow Up/Down → scroll page (small increment) | ✔ Implemented | In `useCalculatorKeyboard`, when focus is in an input/select, Arrow Up/Down call `e.preventDefault()` and `window.scrollBy(..., scrollAmount)` (48px). Number inputs no longer change value. |
| Arrow Up/Down do NOT change input values | ✔ Implemented | Default is prevented for Arrow Up/Down inside inputs. |
| Arrow Left at start → previous input | ✔ Implemented | When `selectionStart === 0`, Arrow Left focuses previous field. |
| Arrow Right at end → next input | ✔ Implemented | When `selectionEnd === value.length`, Arrow Right focuses next field; on last field triggers Calculate and focus result. |
| Arrow keys must not trap focus | ✔ Implemented | No trapping; focus moves only at boundaries; Tab still works normally. |

**Where applied:** Cement Concrete (when focus is inside the calculator form container). Other calculators: Arrow Up/Down still change number inputs; Left/Right do not move focus.

---

## 3. FIELD-TO-FIELD FOCUS LOGIC

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Deterministic focus order | ✔ Implemented | Order: Grade (select) → Length → Width → Depth. Refs attached in that order via `getInputRef(0..3)`. |
| Left → right, top → bottom | ✔ Implemented | DOM order matches logical order. |
| Skipped/disabled fields | ✔ N/A | No disabled fields in Cement Concrete. Hook can be extended to skip `disabled` or `aria-hidden` elements. |
| Auto-focus first input on load | ✔ Implemented | `autoFocusFirst: true` in hook; `focusInput(0)` runs after 100ms mount delay. |

**Where applied:** Cement Concrete. Other calculators: no auto-focus; tab order follows DOM only.

---

## 4. CALCULATOR LOGIC VERIFICATION

### Cement Concrete Calculator

| Check | Status | Notes |
|-------|--------|--------|
| Formula | ✔ Correct | Wet volume = L×W×D; dry volume = wet × 1.524 (54% voids). Cement/Sand/Aggregate by ratio parts; cement bags = cementVol/0.035; sand/agg in ton using density (1.55, 1.35). |
| Units | ✔ Correct | Meter: direct m; Feet: L,W,D × 0.3048. Outputs m³, bags, ton, CFT (×35.315). |
| Negative / empty | ⚠ Edge cases | `onChange` uses `Number(e.target.value) \|\| 0` so empty → 0. `min={0}` on inputs but user can type negative; no clamp in state. **Recommendation:** clamp in onChange, e.g. `setLength(Math.max(0, Number(e.target.value) \|\| 0))`. |
| Output consistency | ✔ Correct | Results update on every change (useEffect); keyboard-triggered Calculate runs same `calculate()` and updates state. |
| Keyboard-triggered calculation | ✔ Correct | Enter on last field calls `onCalculate()` → `calculate()`; focus then moves to result region. |

### Other calculators (not individually verified)

- **Brick Masonry:** Logic present; no keyboard hook; inputs not validated (negative/empty can cause NaN).
- **Remaining 50+ calculators:** Not audited. Same pattern: no `useCalculatorKeyboard`, no shared validation; formulas and units vary by calculator.

**Summary:** Cement Concrete: ✔ Correct logic; ⚠ add input clamping for negative. Others: ❌ Keyboard behavior missing; ⚠ validation/edge cases not applied.

---

## 5. RESULT & POST-CALC UX

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Focus moves to result section after calculation | ✔ Implemented | After `onCalculate()`, hook calls `focusResult()`; result div has `ref={resultRef}` and is focusable. |
| Results selectable via keyboard | ✔ Implemented | Result region is a focusable div (`tabIndex={0}`); text inside is selectable with Shift+Arrow. |
| Ctrl+C copies result | ✔ Implemented | Result div has `onCopy` handler that sets `clipboardData.setData('text/plain', summary)` with volume, cement, sand, aggregate. |
| Tab order continues after results | ✔ Implemented | Result region is in DOM order; Tab moves to next focusable (e.g. Calculate/Reset, then links). No `tabindex > 0`. |

**Where applied:** Cement Concrete. Other calculators: no result ref/focus or copy handler.

---

## 6. ACCESSIBILITY & SEMANTICS

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Semantic HTML | ✔ Improved | Cement Concrete: `<section>`, `<label>`, `<input>`, `<button type="button">`, `role="form"`, `role="region"`, `aria-label`. |
| All inputs have labels | ✔ Implemented | Grade: `htmlFor="cement-grade"`; Length/Width/Depth: `id` + `htmlFor` and `aria-label`. |
| tabindex usage | ✔ Correct | Only result region has `tabIndex={0}`. No `tabindex > 0`. |
| Visible focus indicator | ✔ Implemented | `index.css`: `main input:focus-visible`, `main button:focus-visible`, `main select:focus-visible` with ring. Cement Concrete inputs/buttons use `focus-visible:ring-2 focus-visible:ring-[#3B68FC]`. |
| Screen reader | ✔ Improved | Result region: `aria-label="Calculation results"`, `aria-live="polite"`. Unit toggle: `aria-pressed`. Labels associated with inputs. |

**Where applied:** Cement Concrete and global focus-visible. Other calculators: labels and semantics vary; many lack explicit `id`/`htmlFor` and `aria-*`.

---

## 7. MOBILE KEYBOARD SUPPORT

| Requirement | Status | Notes |
|-------------|--------|--------|
| “Next” key moves focus | ⚠ Partial | “Next” on mobile often sends Enter or Tab. Our Enter → next field matches “Next” intent. Tab order is correct. Not tested on real device. |
| “Done” triggers Calculate | ⚠ Partial | “Done” may send Enter. On last field, Enter triggers Calculate ✓. On non-last field, Enter moves to next ✓. |
| Numeric keyboard for numeric fields | ✔ Implemented | Cement Concrete inputs use `inputMode="decimal"` and `type="number"` so mobile can show numeric keypad. |

**Recommendation:** Test on iOS/Android with native keyboards to confirm Next/Done behavior.

---

## 8. PAGE SCROLLING BEHAVIOR

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Arrow Up/Down → smooth vertical scroll | ✔ Implemented | Handled in `useCalculatorKeyboard` when focus in calculator input/select; `window.scrollBy({ top: ±48, behavior: 'smooth' })`. |
| Page Up/Page Down → larger scroll | ✔ Implemented | In hook’s global key handler (when focus inside container): `PageDown`/`PageUp` call `window.scrollBy` with `window.innerHeight * 0.8`. |
| Home/End → top/bottom of page | ✔ Implemented | In hook’s page-scroll effect: when focus is **not** in an input, Home → `window.scrollTo({ top: 0 })`, End → `scrollTo` bottom. |
| Home/End in input → focus first/last field | ✔ Implemented | When focus **is** in an input and cursor at start (Home) or end (End), hook focuses first or last input. |
| Scrolling does not break focus | ✔ Implemented | Scroll is programmatic; focus remains on the focused element. |

**Where applied:** Cement Concrete container. Other pages: no hook, so Arrow Up/Down in number inputs still change value; Home/End outside inputs not explicitly handled (browser default may scroll).

---

## 9. ERROR HANDLING

| Requirement | Status | Notes |
|-------------|--------|--------|
| On validation error, focus first invalid field | ❌ Not implemented | No validation layer yet; invalid input (e.g. negative) is coerced to 0 or can produce NaN. No “first invalid” focus. |
| Show inline error message | ❌ Not implemented | No inline errors; no `alert()`. |
| No alert() | ✔ | No `alert()` in calculator flow. |

**Recommendation:** Add validation (e.g. `inputValidation.js`) and set state for errors; focus first invalid field with `firstInvalidRef.current?.focus()` and render inline error text next to the field.

---

## 10. FINAL OUTPUT FORMAT

### 1. Keyboard UX compliance status

| Area | Compliance |
|------|------------|
| Enter key behavior | ✔ Compliant (Cement Concrete only) |
| Arrow key navigation | ✔ Compliant (Cement Concrete only) |
| Field-to-field focus | ✔ Compliant (Cement Concrete only) |
| Result & post-calc UX | ✔ Compliant (Cement Concrete only) |
| Accessibility & semantics | ✔ Partially compliant (Cement Concrete + global focus-visible) |
| Page scrolling | ✔ Compliant (Cement Concrete only) |
| Mobile keyboard | ⚠ Partial (decimal keypad; Next/Done not verified on device) |
| Error handling | ❌ Not compliant (no validation, no focus on error) |

**Overall:** **Partial.** One calculator (Cement Concrete) is fully keyboard-operable and meets most requirements. All other calculators still need the same pattern and validation.

---

### 2. Calculator-wise logic report

| Calculator | Formula | Units | Negative/empty | Keyboard calc | Notes |
|------------|--------|--------|----------------|---------------|-------|
| Cement Concrete | ✔ Correct | ✔ Correct | ⚠ Empty→0; negative not clamped | ✔ Works | Reference implementation. |
| Brick Masonry | ✔ Logic present | ✔ Feet/m | ⚠ No validation | ❌ No hook | Apply same keyboard + validation. |
| Others (50+) | Not verified | Not verified | ❌ No validation | ❌ No hook | Roll out hook + validation per calculator. |

---

### 3. Broken or missing behaviors

- **Missing on all except Cement Concrete:**
  - Enter → next field / last field → Calculate.
  - Shift+Enter → previous field.
  - Arrow Left/Right at boundary → prev/next field.
  - Arrow Up/Down → page scroll (not number change).
  - Auto-focus first input.
  - Focus move to result after Calculate.
  - Ctrl+C copy of result.
  - Page Up/Down, Home/End behavior when focus in calculator.

- **Missing everywhere:**
  - Validation with focus on first invalid field and inline error messages (no alert).
  - Consistent use of `inputValidation.js` / `useCalculatorInput` for bounds and negative/empty handling.

- **Risks:**
  - Empty or negative input can still produce NaN or wrong values where validation is not applied.
  - CustomDropdown must receive `ref` and `id` on every calculator that uses it for the hook’s focus order.

---

### 4. Recommended fixes (code-level guidance)

**A. Roll out keyboard behavior to all calculators**

1. In each calculator page:
   - Import `useCalculatorKeyboard`.
   - Count focusable inputs (excluding Unit toggle buttons if you keep them separate): e.g. one select + N number inputs = `inputCount: N + 1`.
   - Call the hook with `inputCount`, `onCalculate`, and `autoFocusFirst: true`.
   - Wrap the form/sidebar block in a div with `ref={containerRef}` and `onKeyDown={handleKeyDown}`.
   - Attach `getInputRef(0)`, `getInputRef(1)`, … to each input/select in order (and add `id`/`htmlFor` for labels).
   - Add a result container with `ref={resultRef}`, `tabIndex={0}`, `aria-label="Calculation results"`, `aria-live="polite"`, and optional `onCopy` for Ctrl+C copy.

2. Ensure `CustomDropdown` (and any other shared input component) accepts `ref` and `id` and forwards them to the native element.

**B. Validation and error handling**

1. Use `validateNumber` from `utils/inputValidation.js` (or `useCalculatorInput`) in each calculator’s `onChange`/on submit:
   - Replace raw `setLength(Number(e.target.value))` with something like:
     - `const { valid, value, error } = validateNumber(e.target.value, { min: 0, allowNegative: false, defaultValue: 0 }); setLength(value); setFieldError('length', error);`
   - Keep a “first invalid” ref and call `firstInvalidRef.current?.focus()` when validation fails.
   - Render inline error text next to each field (e.g. `{fieldError.length && <span className="text-red-500 text-sm">{fieldError.length}</span>}`).
   - Do not use `alert()`.

**C. Cement Concrete only (optional)**

1. Clamp negatives in state: e.g. `setLength(Math.max(0, Number(e.target.value) || 0))` (and same for width/depth).
2. Optionally add a small “Copy results” button that copies the same summary string used in `onCopy`, for users who don’t use Ctrl+C.

**D. Global (all pages)**

1. Keep global `focus-visible` styles in `index.css` for buttons/links/inputs.
2. Optionally add a “Skip to main content” link at the top of the page with `href="#main-content"` and `id="main-content"` on `<main>` for screen reader and keyboard users.

---

**Files added/updated in this audit**

- `src/hooks/useCalculatorKeyboard.js` – new hook for Enter, Shift+Enter, arrows, scroll, Home/End, Page Up/Down.
- `src/pages/CementConcreteCalculator.jsx` – wired hook, refs, labels, ids, result region, onCopy, focus-visible classes.
- `src/components/CustomDropdown.jsx` – `forwardRef` and `id` support.
- `src/index.css` – focus-visible styles for main inputs/buttons/select/links.
- `KEYBOARD_UX_AUDIT.md` – this report.

Use Cement Concrete as the reference when upgrading the rest of the calculators for full keyboard operation and consistent validation.
