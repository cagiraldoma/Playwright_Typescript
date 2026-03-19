# Playwright TypeScript — E2E Testing Framework

End-to-end test automation framework for **OrangeHRM** using **Playwright + TypeScript** with the **Page Object Model (POM)** pattern and class inheritance.

**Application under test:** https://opensource-demo.orangehrmlive.com

---

## Prerequisites

- Node.js 16+
- npm
- Git

---

## Installation

```bash
git clone <repo-url>
cd Playwright_Typescript
npm install
npx playwright install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
BASE_URL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=admin123
ADMIN_INVALID_PASSWORD=invalid123
```

---

## Project Structure

```
Playwright_Typescript/
├── .env                              # Environment variables (not committed)
├── .github/workflows/
│   └── playwright.yml               # GitHub Actions CI/CD pipeline
├── buildspec.yml                    # AWS CodeBuild config
├── playwright.config.ts             # Global Playwright configuration
├── fixtures/
│   └── testFixures.ts               # Custom fixtures (login setup)
├── pages/
│   ├── BasePage.ts                  # Base class with reusable UI methods
│   ├── LoginPage.ts                 # Login page POM
│   ├── DashboardPage.ts             # Dashboard page POM
│   ├── AssignLeavePage.ts           # Leave assignment POM
│   ├── AdminPage.ts                 # Admin module POM
│   └── PimPage.ts                   # PIM (employee management) POM
├── tests/
│   ├── LoginTest.spec.ts            # Login tests (valid + invalid)
│   ├── DashboardTest.spec.ts        # Dashboard / leave request tests
│   ├── AdminTest.spec.ts            # Admin module tests
│   └── PimPage.spec.ts              # PIM module tests
└── utils/
    ├── dateUtils.ts                 # Relative date helpers
    └── randomValuesUtils.ts         # Random value generators
```

---

## Architecture

### Page Object Model with Inheritance

```
BasePage (base class — shared UI interaction methods)
    ├── LoginPage        extends BasePage
    ├── DashboardPage    extends BasePage
    ├── AssignLeavePage  extends BasePage
    ├── AdminPage        extends BasePage
    └── PimPage          extends BasePage
```

### BasePage Methods

| Method | Description |
|--------|-------------|
| `navigateTo(url)` | Navigate to a URL |
| `click(locator)` | Click an element |
| `fillInput(locator, value)` | Fill a text input |
| `selectFromDropdown(locator, text)` | Click dropdown trigger, then select by role option |
| `selectElementByTextFromDropDown(listLocator, text)` | Filter a visible list and click by text |
| `selectFirstElement(locator)` | Click the first element in a list |
| `verifyUrlContains(path)` | Assert current URL matches a pattern |
| `elementIsVisible(locator)` | Assert element is visible |
| `waitForElementToBeVisible(locator, timeout?)` | Wait for element to be visible |
| `getTextContent(locator)` | Get text content of an element |
| `getAllTextContent(locator)` | Get all text contents from a locator |
| `elementHasTheText(locator, text)` | Assert element has exact text |
| `elementHasValue(locator, text)` | Assert input has a value |

---

## Fixtures

Located in `fixtures/testFixures.ts`. Extend Playwright's `base` and provide pre-configured page objects.

| Fixture | Behavior |
|---------|----------|
| `loginToTheApp` | Navigates to `BASE_URL` and logs in with valid credentials. Returns `{ basePage, loginPage, dashboardPage, assignLeavePage, adminPage, pimPage }` |
| `invalidLoginToTheApp` | Navigates to `BASE_URL` and logs in with invalid credentials. Returns `{ basePage, loginPage, dashboardPage }` |

**Usage in tests — always import `test` from the fixtures, not from `@playwright/test`:**

```typescript
import { test } from '../fixtures/testFixures';

test('My test', async ({ loginToTheApp }) => {
  const { dashboardPage, pimPage } = loginToTheApp;
  // ...
});
```

---

## Playwright Configuration

> **Note:** `playwright.config.ts` has two exports: `export default defineConfig({})` (empty) and `module.exports = config` (the real config). When modifying settings, always edit the `config` object.

| Setting | Local | CI |
|---------|-------|----|
| Browser | Chromium | Chromium |
| Headless | `true` | `true` |
| Timeout | 30s | 30s |
| Assert timeout | 5s | 5s |
| Retries | 0 | 2 |
| Workers | auto | 1 |
| Parallel | yes | yes |
| Trace | always | always |
| Reporter | HTML | HTML |

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific file
npx playwright test tests/LoginTest.spec.ts

# Run tests by name
npx playwright test -g "Success Add Employee"

# Run in UI mode (interactive)
npx playwright test --ui

# Run with visible browser
npx playwright test --headed

# Run in debug mode
npx playwright test --debug
```

---

## Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

The report includes:
- Pass / fail status per test
- Step-by-step breakdown (via `test.step`)
- Traces (enabled for all runs)
- Screenshots on failure
- Error context files in `test-results/`

To enable additional reporters in `playwright.config.ts`:

```typescript
reporter: [
  ['html'],
  ['json', { outputFile: 'test-results/results.json' }],
  ['junit', { outputFile: 'test-results/results.xml' }],
],
```

---

## BDD-Style Tests with test.step

Tests follow a Given / When / Then structure using `test.step()` — no Cucumber or extra dependencies needed.

```typescript
test('Should add a new employee successfully', async ({ loginToTheApp }) => {
  const { dashboardPage, pimPage, basePage } = loginToTheApp;

  await test.step('Given the user is on the PIM module', async () => {
    await dashboardPage.click(dashboardPage.pimNavButton);
  });

  await test.step('When the user submits the new employee form', async () => {
    await pimPage.addNewEmployee('Carlos', 'Test', '12345678');
  });

  await test.step('Then a success alert should be visible', async () => {
    await basePage.elementIsVisible(pimPage.successAlert);
  });
});
```

---

## Utilities

### `utils/dateUtils.ts`

```typescript
getDateDaysFromToday(days: number): string
// Returns a date string in "YYYY-DD-MM" format
// Note: day and month are inverted vs ISO standard — matches OrangeHRM input format
```

### `utils/randomValuesUtils.ts`

```typescript
getRandomInt(): string
// Returns a random integer as a string (used for employee IDs, etc.)
```

---

## CI/CD

### GitHub Actions (`.github/workflows/playwright.yml`)

- **Trigger:** push or PR to `main` / `master`
- **Runner:** `ubuntu-latest`
- **Steps:** checkout → Node LTS setup → `npm ci` → install browsers → `npx playwright test`
- **Artifact:** uploads `playwright-report/` with 30-day retention

### AWS CodeBuild (`buildspec.yml`)

Separate pipeline for AWS environments.

---

## Known Issues

- `playwright.config.ts` has a duplicate export structure. The `export default defineConfig({})` is empty — the real config lives in `module.exports = config`.
- `utils/dateUtils.ts` returns dates in `YYYY-DD-MM` format (day and month inverted vs ISO `YYYY-MM-DD`). This matches the OrangeHRM date input — do not change without verifying the UI behavior first.

---

## Modules Covered

| Module | Tests |
|--------|-------|
| Login | Valid login, invalid credentials |
| Dashboard | Navigation |
| Leave Management | Create leave request (`CAN - Personal`) |
| Admin | Add system user, assign role |
| PIM | Add new employee |

**Test user:** `Admin` / `admin123`
**Employee used in tests:** `Orange Test`

---

## Resources

- [Playwright Docs](https://playwright.dev/)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com)
