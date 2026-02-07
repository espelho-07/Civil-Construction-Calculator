# Civil Engineering Calculator Website — Full Audit Report

**Audit type:** Production-ready deployment (Vercel + Supabase)  
**Scope:** Functionality, Supabase, Auth, Security, LocalStorage, Performance, Accessibility, Vercel, Error handling  
**Verdict:** See Section 10.

---

## 1. FUNCTIONALITY CHECK

| Area | Status | Notes |
|------|--------|--------|
| **Pages load** | ✔ Working | All routes defined in App.jsx; ErrorBoundary wraps app; no runtime crashes observed from routing. |
| **Calculators – inputs** | ⚠ Needs improvement | Most calculators use raw `useState` and do **not** use `useCalculatorInput` or `inputValidation.js`. Only `useCalculatorInput.js` exists and is **not imported** by any calculator. Inputs can accept invalid values (negative, empty, non-numeric). |
| **Calculators – results** | ✔ Working | Logic (e.g. CementConcreteCalculator) is coherent; formulas and units are consistent. |
| **Edge cases (0, negative, empty, large)** | ❌ Broken / ⚠ | No validation on most calculator inputs. Zero/negative/empty can cause NaN, Infinity, or odd UI. `inputValidation.js` (validateNumber, safeParseFloat, bounds) exists but is **unused** in calculator pages. |
| **Refresh / navigation** | ✔ Working | SPA with React Router; no full reload required; ScrollToTop on route change. |
| **Keyboard navigation** | ⚠ Needs improvement | No `lazy()`/`Suspense`; all routes eager-loaded. Focus management and tab order not audited in depth; some interactive elements (buttons, links) are focusable by default. No custom `tabIndex` or skip-links found in quick scan. |

**Summary:**  
✔ Core flows work.  
❌ Input validation/edge cases not applied on calculators.  
⚠ Keyboard-only experience not verified end-to-end.

---

## 2. SUPABASE CONNECTION & DATA FLOW

| Check | Status | Details |
|-------|--------|---------|
| **Client init** | ✔ | `src/lib/supabase.js` creates client only when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set and URL includes `supabase.co`. Otherwise `supabase` is `null` and warnings are logged. |
| **Env vars** | ✔ | Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` used in frontend. `.env.example` documents these; no other Supabase keys in `src`. |
| **service_role in frontend** | ✔ | Grep found **no** `service_role` or `SUPABASE_SERVICE` in repo. Only anon key is used. |
| **Read/write** | ✔ | supabaseService uses `.from()`, `.select()`, `.insert()`, `.update()`, `.delete()` with RLS; `ensureSupabase()` throws if client is null. |
| **Auth session** | ✔ | AuthContext uses `supabase.auth.getSession()` and `onAuthStateChange`; null vs logged-in handled; profile fetched via `getProfile` after auth. |

**Missing / risks:**  
- If `.env` is missing or invalid in production, Supabase is null: service calls throw “Database not configured”. ErrorBoundary will catch React errors but not all async failures.  
- **Critical:** Ensure `.env` and `server/.env` are **never committed**. `.gitignore` includes `.env` and `server/.env`; if a copy with real keys was ever committed, rotate those keys and remove from history.

**Summary:** Supabase usage is correct and safe (anon key only). Env must be set in Vercel and secrets must not be in repo.

---

## 3. AUTHENTICATION & AUTHORIZATION

| Check | Status | Notes |
|-------|--------|--------|
| **Supabase Auth config** | ⚠ Manual | Redirect URLs and Site URL must be set in Supabase Dashboard (Authentication → URL Configuration). Code uses `window.location.origin` for reset redirect. |
| **Login / signup / logout** | ✔ | AuthContext: `signInWithPassword`, `signUp`, `signOut`; ProtectedRoute redirects unauthenticated users to `/login`. |
| **Session persistence** | ✔ | Supabase client uses `persistSession: true`, `autoRefreshToken: true`, `detectSessionInUrl: true`. Session survives refresh. |
| **Protected data** | ✔ | Protected routes (e.g. `/profile`, `/dashboard`, `/admin`) use `ProtectedRoute`; unauthenticated users are redirected. Admin routes use `requireAdmin`; non-admin sent to `/`. |
| **Password validation** | ✔ | Signup and ResetPassword enforce length ≥ 8 and complexity (lower, upper, number, special). Login and ForgotPassword validate email format. |
| **Reset password flow** | ⚠ | ResetPasswordPage reads `token` from query; AuthContext `resetPassword` uses `supabase.auth.updateUser({ password })` and does **not** use the token. Supabase reset uses hash fragment. Ensure Supabase “Redirect URL” includes `/reset-password` and that recovery link points to this app. |
| **Verify email** | ✔ | VerifyEmailPage uses `token_hash` from URL and `supabase.auth.verifyOtp({ type: 'email' })`. |

**Summary:** Auth flows are implemented correctly. Confirm Supabase redirect URLs and that password reset recovery link matches your frontend URL.

---

## 4. SECURITY AUDIT (CRITICAL)

| Check | Status | Details |
|-------|--------|--------|
| **Secrets in frontend** | ✔ | No API keys or secrets hardcoded in `src`. Only `import.meta.env.VITE_*` used. |
| **RLS enabled** | ✔ | All tables in migrations have `ENABLE ROW LEVEL SECURITY`: profiles, calculations, favorites, user_preferences, site_settings. |
| **RLS policies** | ✔ | **profiles:** select/update/insert own; admin can select all. **calculations:** CRUD own; admin can select all. **favorites:** CRUD own. **user_preferences:** CRUD own. **site_settings:** select all; insert/update/delete admin only (`is_admin()`). |
| **Open read/write** | ✔ | No table allows unrestricted write. Public read only for `site_settings` (intended). |
| **SQL injection** | ⚠ | Supabase client uses parameterized queries. However `getCalculations` builds `.or()` with string interpolation: `calculator_name.ilike.%${search}%,...`. If `search` contained single quotes or backslashes it could break or alter the filter. **Recommendation:** sanitize or escape `search` (e.g. strip/replace `%` and `'`) or use a dedicated API that parameterizes. |
| **XSS** | ✔ | No `dangerouslySetInnerHTML`, `innerHTML`, or `eval` in `src`. React escapes text by default. |
| **HTTPS** | ✔ | Vercel serves over HTTPS. Supabase endpoints are HTTPS. |
| **CORS** | ✔ | Supabase and Vercel handle CORS; frontend does not set custom CORS. |
| **Admin email** | ⚠ | Admin email `darpantrader1727@gmail.com` is hardcoded in AuthContext and in migration `is_admin()`. Changing admin requires code and DB change. |

**Security level: MEDIUM–HIGH**  
- Strong: RLS, no secrets in code, no XSS vectors, anon-only client.  
- Improvement: sanitize search input used in Supabase filters; document admin change process.

---

## 5. LOCALSTORAGE & CLIENT STORAGE

| Item | Status | Notes |
|------|--------|--------|
| **Usage** | ✔ Minimal | Used for: `appSettings` (theme, preferences), `lastUsedCalculator`, `recentCalculators`, `ce_*` activity keys, `calculationHistory` (guest fallback), `savedCalculators` (guest fallback). |
| **Sensitivity** | ✔ | No auth tokens stored manually. Supabase stores its own session (e.g. `sb-<project>-auth-token`) in localStorage; that is expected. |
| **Legacy api.js** | ⚠ | `src/services/api.js` (unused in current Supabase-based app) uses `localStorage.getItem('accessToken')` and `setItem('accessToken')`. If that code is ever used again, it would be a second auth mechanism. **Recommendation:** remove or clearly isolate legacy API code so it is not bundled or used by mistake. |
| **Cleanup / limits** | ✔ | activityMemory caps recent list (e.g. 5); numeric-only state; try/catch around storage. No unbounded growth. |
| **SettingsContext** | ⚠ | Initial state uses `JSON.parse(saved)` without try/catch. Corrupted `appSettings` could throw and break app load. **Recommendation:** wrap in try/catch and fallback to defaults. |

**Summary:** LocalStorage is used for non-sensitive, minimal data. Harden SettingsContext parse and clean up or isolate legacy api.js.

---

## 6. PERFORMANCE & STABILITY

| Area | Status | Details |
|------|--------|--------|
| **Bundle size** | ❌ Risk | Single JS chunk **1,611 kB** (333 kB gzip). Vite warns “Some chunks are larger than 500 kB”. All calculator and admin pages are eager-loaded (no `React.lazy` or code-splitting). |
| **Re-renders** | ⚠ | No audit of unnecessary re-renders. Contexts (Auth, Settings, SiteSettings) can cause broad tree updates when they change. |
| **Network** | ✔ | Supabase calls are on-demand; no redundant polling found. getSiteSettings called once on load in SiteSettingsProvider. |
| **Blocking** | ✔ | No synchronous blocking in main thread; async Supabase and localStorage with try/catch. |

**Performance risks:**  
- Large initial bundle delays TTI on slow networks.  
- No code-splitting for 50+ calculator routes.

**Recommendations:**  
- Introduce route-based code-splitting (`React.lazy` + `Suspense`) for calculator and admin pages.  
- Consider splitting vendor chunk (e.g. chart.js, fontawesome) via `build.rollupOptions.output.manualChunks`.  
- Optionally lazy-load Font Awesome or subset icons to reduce asset size.

---

## 7. ACCESSIBILITY & UX

| Check | Status | Notes |
|-------|--------|--------|
| **Keyboard** | ⚠ | Not fully audited. Native focus on links/buttons/inputs works. No skip link or explicit focus trap in modals/dropdowns. |
| **Focus management** | ⚠ | ScrollToTopButton and RecordCalculatorVisit do not steal focus. Modal/dropdown focus not verified. |
| **Screen reader** | ⚠ | Limited use of `aria-*` and `role=` (only a few components). Icons without text (e.g. Font Awesome) may lack labels. |
| **Color contrast** | ✔ | Text on backgrounds (e.g. #0A0A0A on #F7F9FF, white on #3B68FC) is readable. Dark mode (#0f172a, #1e293b) in use. |
| **Mobile** | ✔ | Responsive layout (e.g. Tailwind breakpoints, flex/grid); touch targets not formally measured. |

**UX rating: Good**  
- Clear navigation, consistent styling, error messages and loading states.  
- Improve to **Excellent** with: keyboard and focus polish, aria-labels on icon-only controls, skip link, and optional lazy loading for perceived speed.

---

## 8. VERCEL DEPLOYMENT & CONFIG

| Check | Status | Details |
|-------|--------|--------|
| **vercel.json** | ✔ | SPA rewrite: `"source": "/(.*)", "destination": "/index.html"`. No conflicting API routes in this config. |
| **Env vars** | ✔ | Frontend needs only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel (Environment Variables). No server-side secrets required for Supabase-only deployment. |
| **Build** | ✔ | `npm run build` (vite build) completes successfully. |
| **Preview vs prod** | ⚠ | Same build; different behavior only if env vars differ between Preview and Production. Ensure Production has correct Supabase URL and anon key. |
| **Cache** | ✔ | Static assets get cache headers by default. SPA rewrite is appropriate. |

**Note:** The `server/` folder (Express, Prisma, JWT) is separate. If you deploy only the Vite app to Vercel and use Supabase for auth/data, the Express server is not used. If you later add serverless API routes, ensure they do not expose `service_role` or other secrets to the client.

---

## 9. ERROR HANDLING & LOGGING

| Check | Status | Details |
|-------|--------|--------|
| **Error boundary** | ✔ | `ErrorBoundary` in main.jsx wraps App; catches render errors; shows “Something went wrong” and Go home / Refresh; dev-only error details. |
| **User-facing errors** | ✔ | Auth (login/signup/forgot/reset) show messages from backend. supabaseService errors are thrown and caught in components (e.g. CalculatorActions, SavedPage, HistoryPage) with “Failed to save”, “Failed to load”, etc. |
| **Silent failures** | ⚠ | Some catch blocks only `console.error` (e.g. HistoryPage loadCalculations fallback to localStorage). User may not see that Supabase failed. |
| **Console** | ✔ | No excessive logging in production paths. Supabase client warns only when credentials are missing. |
| **Async errors** | ⚠ | ErrorBoundary does not catch errors inside async code (e.g. failed fetch). Consider a global unhandled rejection handler or error reporting (e.g. Sentry) for production. |

**Summary:** Error handling is adequate for a first release. Add try/catch for SettingsContext parse, and consider global async error reporting.

---

## 10. FINAL REPORT FORMAT

### 1. Overall Status: ⚠ PARTIAL

- **Working:** Routing, auth, Supabase RLS, session persistence, protected routes, admin flow, no exposed secrets, no XSS, build and Vercel config.
- **Gaps:** Calculator input validation and edge cases, search filter sanitization, bundle size and code-splitting, accessibility and keyboard coverage, minor robustness (SettingsContext parse, legacy api.js).

### 2. Critical Issues (must fix)

1. **Calculator inputs:** Apply validation (e.g. use `inputValidation.js` or `useCalculatorInput`) on all calculator pages so that empty, negative, zero (where invalid), and non-numeric inputs are handled and do not produce NaN/Infinity or confusing UI.
2. **Search filter:** Sanitize or parameterize the `search` string in `getCalculations` (supabaseService) so it cannot break or abuse the `.or()` filter.
3. **SettingsContext:** Wrap `JSON.parse(saved)` in try/catch and fallback to `DEFAULT_SETTINGS` so corrupted `appSettings` in localStorage does not crash the app on load.

### 3. Security Risks

- **Low:** Hardcoded admin email (operational constraint; document how to change).
- **Low:** Legacy `api.js` with manual `accessToken` in localStorage; remove or clearly disable so it is not used by mistake.
- **Medium (if left as-is):** Unsanitized `search` in Supabase filter could lead to broken queries or unexpected behavior; sanitize or parameterize.

No critical secrets exposure or RLS bypass found.

### 4. Performance Risks

- **High:** Single ~1.6 MB JS chunk; slow initial load on weak networks.
- **Medium:** No code-splitting; every route loads up front.
- **Mitigation:** Route-based lazy loading and vendor chunk splitting (see Section 6).

### 5. Recommended Improvements

- Add route-based code-splitting (`React.lazy` + `Suspense`) for calculator and admin routes.
- Use `inputValidation.js` (or equivalent) consistently across calculators and handle edge cases (0, negative, empty, very large numbers).
- Harden SettingsContext: `try { return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS } catch { return DEFAULT_SETTINGS }`.
- Sanitize search in `getCalculations`: e.g. strip or escape `%`, `'`, `\` before passing to `.or()`.
- Add a skip link and improve aria-labels on icon-only buttons for accessibility.
- Align Security page password rules with Reset (length + complexity) and optionally reuse PasswordStrengthMeter.
- Confirm Supabase redirect URL for password reset and email verification.
- Remove or gate legacy `api.js` so it is not part of the active auth/data flow.
- Optionally add error reporting (e.g. Sentry) for unhandled rejections and ErrorBoundary.

### 6. Production Readiness Verdict

**Verdict: CONDITIONAL GO**

- **Safe for production** from a security and data-access perspective (RLS, anon-only client, no secrets in code, no XSS).
- **Recommended before or soon after launch:**  
  - Fix calculator input validation and edge cases.  
  - Harden SettingsContext and search filter.  
  - Add code-splitting to reduce initial bundle size and improve load time.

With these items addressed, the app is in good shape for a production Civil Engineering Calculator site on Vercel with Supabase.
