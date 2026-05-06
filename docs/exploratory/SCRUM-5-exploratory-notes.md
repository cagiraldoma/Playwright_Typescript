# Exploratory Testing Notes: SCRUM-5

## Environment

| Property | Value |
|---|---|
| Application | OrangeHRM Open Source HR Management |
| Version | OrangeHRM OS 5.8 |
| URL | https://opensource-demo.orangehrmlive.com/web/index.php/auth/login |
| Browser | Chromium (Playwright MCP) |
| Exploration Date | 2026-05-06 |
| Explorer | Claude Code (Phase 3 — Exploratory Testing Agent) |
| Credentials (valid) | Username: `Admin` / Password: `admin123` |
| Credentials (invalid) | Username: `Admin` / Password: `invalid123` |

---

## User Flow Observed

### AC-01 / AC-04 — Valid Login → Dashboard (Button click and Enter key)

1. Navigate to `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`
2. Page renders Login form with heading "Login", two textboxes (Username, Password), a Login button, and a "Forgot your password?" paragraph link.
3. Fill Username: `Admin`, Password: `admin123`
4. Press **Enter** (or click **Login** button) → form submits via `POST /web/index.php/auth/validate` (HTTP 302)
5. Browser follows redirect to `https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index`
6. Dashboard renders with sidebar navigation, heading "Dashboard", and multiple widgets (Time at Work, My Actions, Quick Launch, Buzz Latest Posts, Employees on Leave Today, charts).
7. Screenshots: `screenshots/04-dashboard-after-enter.png`

### AC-02 — Invalid Credentials

1. Fill Username: `Admin`, Password: `invalid123`
2. Click **Login** → `POST /web/index.php/auth/validate` returns HTTP 302 back to `/auth/login`
3. Login page re-renders with an **alert** element containing "Invalid credentials" (red icon + text, displayed above the credentials hint banner).
4. URL remains on `/auth/login`. Form fields are cleared.
5. Screenshots: `screenshots/03-invalid-credentials.png`

### AC-03 — Empty Fields Validation

1. On Login page, click **Login** button without entering any credentials.
2. No network request is fired — **pure client-side validation**.
3. Both Username and Password fields get a red border.
4. A "Required" text message appears below each empty field.
5. URL remains on `/auth/login`.
6. Screenshots: `screenshots/02-empty-fields-validation.png`

### AC-05 — Active Session Redirects Away from Login URL

1. While authenticated (after successful login), navigate directly to `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`
2. The app **immediately redirects** to `/dashboard/index` — the login page never renders.
3. No flash of login page content observed.
4. Screenshots: `screenshots/05-session-redirect.png`

### AC-06 — Forgot Password Flow

1. On Login page (logged-out state), click **"Forgot your password?"** paragraph.
2. Browser navigates to `https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode`
3. Reset Password page renders with: heading "Reset Password", instructional paragraph, Username textbox, Cancel button, Reset Password button.
4. No credentials pre-filled.
5. Screenshots: `screenshots/06-forgot-password-page.png`

---

## Stable Locators Found

All locators use Playwright's semantic/role-based API — zero CSS selectors, zero XPath.

### Login Page (`/auth/login`)

| Element | Playwright Locator | Notes |
|---|---|---|
| Username field | `page.getByRole('textbox', { name: 'Username' })` | `<input>` with label "Username"; placeholder "Username" |
| Password field | `page.getByRole('textbox', { name: 'Password' })` | `<input type="password">` with label "Password"; placeholder "Password" |
| Login button | `page.getByRole('button', { name: 'Login' })` | Orange pill button |
| "Forgot your password?" | `page.getByText('Forgot your password?')` | Rendered as `<p>` with `cursor:pointer`, NOT an `<a>` tag |
| "Invalid credentials" alert | `page.getByRole('alert')` | Role `alert`; inner text "Invalid credentials" |
| "Required" under Username | `page.getByRole('textbox', { name: 'Username' }).locator('..').getByText('Required')` | Sibling `<span>`/`<div>` rendered below the input wrapper |
| "Required" under Password | `page.getByRole('textbox', { name: 'Password' }).locator('..').getByText('Required')` | Same pattern |
| Page heading | `page.getByRole('heading', { name: 'Login' })` | `<h5>` level 5 |

> **Alternative for Required messages (simpler):** Since both messages have identical text, use `.nth()`:
> - `page.getByText('Required').nth(0)` — Username required
> - `page.getByText('Required').nth(1)` — Password required

### Dashboard Page (`/dashboard/index`)

| Element | Playwright Locator | Notes |
|---|---|---|
| Dashboard heading | `page.getByRole('heading', { name: 'Dashboard' })` | Confirms successful login redirect |
| Sidebar nav | `page.getByRole('complementary')` or `page.getByRole('navigation', { name: 'Sidepanel' })` | Left sidebar |
| User profile area | `page.getByRole('banner')` | Top bar containing "manda user" profile |

### Reset Password Page (`/auth/requestPasswordResetCode`)

| Element | Playwright Locator | Notes |
|---|---|---|
| Page heading | `page.getByRole('heading', { name: 'Reset Password' })` | `<h6>` level 6 |
| Username field | `page.getByRole('textbox', { name: 'Username' })` | Same locator as login page |
| Reset Password button | `page.getByRole('button', { name: 'Reset Password' })` | Green pill button |
| Cancel button | `page.getByRole('button', { name: 'Cancel' })` | Outlined green pill button |

### URL Assertions

| Assertion | Value |
|---|---|
| Login page URL contains | `/auth/login` |
| Dashboard URL contains | `/dashboard/index` |
| Reset Password URL contains | `/auth/requestPasswordResetCode` |

---

## Validation Messages

| Trigger | Element | Exact Text | Locator |
|---|---|---|---|
| Submit empty form | Below Username input | `Required` | `page.getByText('Required').nth(0)` |
| Submit empty form | Below Password input | `Required` | `page.getByText('Required').nth(1)` |
| Invalid credentials submitted | Alert banner above form | `Invalid credentials` | `page.getByRole('alert')` |

**Key observations:**
- "Required" validation is **client-side only** — no network request fires.
- "Invalid credentials" is **server-side** — fires a POST and renders on redirect.
- After invalid credentials, both form fields are **cleared** (not pre-populated with previous values).
- Input fields turn **red-bordered** on Required validation state.

---

## Network Observations

### Login form submission endpoint

| Property | Value |
|---|---|
| Method | `POST` |
| Endpoint | `/web/index.php/auth/validate` |
| Invalid credentials response | `302 → redirect to /auth/login` |
| Valid credentials response | `302 → redirect to /dashboard/index` |
| Content type | Form submission (not JSON API) — traditional form POST |

> **Important:** The login POST is classified as a "static" request by Playwright's network filter. It will only appear when using `browser_network_requests` with `static: true`. Using the default `static: false` will miss it entirely.

### Dashboard API calls (after successful login)

| Method | Endpoint | Status |
|---|---|---|
| GET | `/api/v2/dashboard/employees/time-at-work` | 200 |
| GET | `/api/v2/dashboard/employees/action-summary` | 200 |
| GET | `/api/v2/dashboard/shortcuts` | 200 |
| GET | `/api/v2/buzz/feed` | 200 |
| GET | `/api/v2/dashboard/employees/leaves` | 200 |
| GET | `/api/v2/dashboard/employees/subunit` | 200 |
| GET | `/api/v2/dashboard/employees/locations` | 200 |
| POST | `/events/push` | 200 |

### i18n messages

| Method | Endpoint | Status |
|---|---|---|
| GET | `/web/index.php/core/i18n/messages` | 200 (first load), 304 (subsequent) |

---

## Console Errors

No JavaScript errors or warnings were observed at any point during the exploration:

| State | Errors | Warnings |
|---|---|---|
| Initial page load | 0 | 0 |
| Empty form submitted | 0 | 0 |
| Invalid credentials submitted | 0 | 0 |
| Successful login / Dashboard | 0 | 0 |
| Authenticated redirect from /auth/login | 0 | 0 |
| Forgot password page | 0 | 0 |

---

## Bugs or Discrepancies vs Acceptance Criteria

### No blocking bugs found. Minor observations:

1. **"Forgot your password?" is not an anchor tag** — AC-06 says "click 'Forgot your password?'". The element is a `<p>` (paragraph) rendered with `cursor:pointer`, not an `<a>` link. This is semantically incorrect (accessibility issue — screen readers won't announce it as a link/button). Locator must use `getByText` not `getByRole('link')`.

2. **Form fields cleared after invalid credentials** — The spec does not explicitly state this, but after a failed login attempt both Username and Password fields are emptied. This is standard behavior but worth noting: tests for AC-02 must re-fill fields if chaining attempts.

3. **AC-05 redirect is instantaneous** — No intermediate render of the login page occurs. `page.goto()` resolves directly to `/dashboard/index`. This means `waitForURL` assertions must target the dashboard URL, not the login URL.

4. **Login form renders a credentials hint banner** — The page publicly displays "Username: Admin / Password: admin123" in a grey hint box. This is a demo-environment artifact, not a production concern, but test assertions should not rely on this element.

5. **Dashboard shows "manda user" as logged-in user** — Not "Admin". The Admin credentials log into an account whose display name is "manda user". Tests asserting user identity should use this name, not "Admin".

---

## Test Data Used

| Field | Value | Purpose |
|---|---|---|
| Username (valid) | `Admin` | AC-01, AC-04, AC-05 |
| Password (valid) | `admin123` | AC-01, AC-04, AC-05 |
| Username (invalid attempt) | `Admin` | AC-02 |
| Password (invalid) | `invalid123` | AC-02 |
| Username (empty) | *(empty)* | AC-03 |
| Password (empty) | *(empty)* | AC-03 |
| BASE_URL | `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login` | All |
| Dashboard URL | `https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index` | AC-01, AC-04, AC-05 |
| Logout URL | `https://opensource-demo.orangehrmlive.com/web/index.php/auth/logout` | Session teardown |
| Reset Password URL | `https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode` | AC-06 |

---

## Automation Recommendations

### Fixtures & Setup

1. **Use `storageState` for AC-05** — Store the authenticated session to a JSON file once, reuse it for the active-session redirect test. Avoids re-logging in for each test run.
2. **Explicit `waitForURL` after login** — The POST → 302 pattern means the page changes URL. Always `await page.waitForURL('**/dashboard/index')` after clicking Login with valid credentials.
3. **No `waitForURL` needed for empty-field validation** — It's purely client-side; assert immediately after click.
4. **Logout via direct navigation** — Use `page.goto('.../auth/logout')` for teardown. Faster than clicking through the UI menu.

### Locator Strategy

5. **Never use CSS selectors for this page** — All interactive elements have stable `role` + `name` attributes. `getByRole` and `getByText` are fully sufficient.
6. **"Forgot your password?" must use `getByText`** — It is NOT an `<a>` or `<button>`. Using `getByRole('link')` or `getByRole('button')` will fail.
7. **"Invalid credentials" alert: use `getByRole('alert')`** — Most stable. Do NOT use `getByText` alone as the error banner structure may change.
8. **"Required" messages: use `.nth(0)` and `.nth(1)`** — Both have identical text. Index order matches DOM order (Username first, Password second).

### Test Structure

9. **AC-01 and AC-04 can share setup** — Both test valid login; differ only in submission method (button click vs Enter). Parameterize with a single describe block.
10. **AC-05 depends on AC-01** — Run after a successful login fixture. Use `test.use({ storageState })` or a beforeEach that logs in.
11. **AC-06 is independent** — Does not require login. Can run in isolation from a fresh page.
12. **Network assertion for AC-01/AC-04** — Optionally intercept `POST /auth/validate` and assert it fires with correct payload (username/password fields). Not strictly needed for happy-path but improves coverage.

### Page Object Design

```typescript
// Recommended LoginPage locators (from BasePage extension pattern)
readonly usernameInput = page.getByRole('textbox', { name: 'Username' });
readonly passwordInput = page.getByRole('textbox', { name: 'Password' });
readonly loginButton   = page.getByRole('button', { name: 'Login' });
readonly forgotPasswordLink = page.getByText('Forgot your password?');
readonly invalidCredentialsAlert = page.getByRole('alert');
readonly requiredErrors = page.getByText('Required'); // use .nth(0)/.nth(1)

// Recommended DashboardPage locator for login assertion
readonly dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });

// Recommended ResetPasswordPage locators
readonly resetPasswordHeading = page.getByRole('heading', { name: 'Reset Password' });
readonly resetPasswordButton  = page.getByRole('button', { name: 'Reset Password' });
readonly cancelButton         = page.getByRole('button', { name: 'Cancel' });
```
