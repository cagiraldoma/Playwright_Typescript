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

All variables are loaded via `dotenv` in `playwright.config.ts` and accessed with `process.env.VARIABLE!` throughout the codebase.

---

## Project Structure

```
Playwright_Typescript/
├── .env                                    # Environment variables (not committed)
├── .mcp.json                               # MCP server configuration
├── .prettierrc                             # Code formatter configuration
├── playwright.config.ts                    # Global Playwright configuration
├── tsconfig.json                           # TypeScript compiler options
├── buildspec.yml                           # AWS CodeBuild pipeline config
│
├── .github/workflows/
│   ├── playwright.yml                      # GitHub Actions CI/CD pipeline
│   └── copilot-setup-steps.yml             # GitHub Copilot environment setup
│
├── .claude/
│   └── agents/
│       ├── playwright-test-generator.md    # AI agent: generate tests from plans
│       ├── playwright-test-planner.md      # AI agent: explore app and plan tests
│       └── playwright-test-healer.md       # AI agent: debug and fix failing tests
│
├── pages/
│   ├── BasePage.ts                         # Abstract base class with shared UI methods
│   ├── LoginPage.ts                        # Login page POM
│   ├── DashboardPage.ts                    # Dashboard page POM
│   ├── AssignLeavePage.ts                  # Leave assignment POM
│   ├── AdminPage.ts                        # Admin module POM
│   ├── PimPage.ts                          # PIM (employee management) POM
│   ├── NavBarPage.ts                       # Navigation bar POM (stub)
│   └── patterns/
│       ├── factory-method/
│       │   └── PageFactory.ts              # Factory Method pattern implementation
│       └── singleton/
│           └── BrowserContextManager.ts    # Singleton pattern implementation
│
├── fixtures/
│   ├── testFixures.ts                      # Main test fixtures (login, navigation)
│   ├── apiFixtures.ts                      # API testing fixtures with session auth
│   └── patternFixtures.ts                  # Lightweight fixtures for pattern demos
│
├── tests/
│   ├── LoginTest.spec.ts                   # 20 login tests (happy path, negative, edge)
│   ├── DashboardTest.spec.ts               # Dashboard and leave request tests
│   ├── AdminTest.spec.ts                   # Admin module tests
│   ├── ApiTest.spec.ts                     # REST API endpoint tests
│   ├── PimPage.spec.ts                     # PIM module tests
│   └── patterns/
│       ├── factory-method.spec.ts          # Factory Method pattern demo
│       └── singleton.spec.ts               # Singleton pattern demo
│
├── utils/
│   ├── dateUtils.ts                        # Relative date helpers
│   ├── decorators.ts                       # @step decorator for test.step()
│   └── randomValuesUtils.ts                # Random value generators
│
├── specs/
│   ├── README.md                           # Specs directory guide
│   └── us-001-sign-in.plan.md             # Test plan for Sign In (US-001)
│
└── docs/
    ├── exploratory/
    │   └── SCRUM-5-exploratory-notes.md
    └── test-plans/
        └── SCRUM-5-test-plan.md
```

---

## Architecture

### Page Object Model with Inheritance

```
BasePage (base class — shared UI interaction methods)
    ├── LoginPage          extends BasePage
    ├── DashboardPage      extends BasePage
    ├── AssignLeavePage    extends BasePage
    ├── AdminPage          extends BasePage
    ├── PimPage            extends BasePage
    └── NavBarPage         extends BasePage
```

### BasePage Methods

| Method                                               | Description                               |
| ---------------------------------------------------- | ----------------------------------------- |
| `navigateTo(url)`                                    | Navigate to a URL                         |
| `click(locator)`                                     | Click an element                          |
| `fillInput(locator, value)`                          | Fill a text input                         |
| `verifyUrlContains(path)`                            | Assert current URL contains path          |
| `verifyPageUrl(url)`                                 | Assert exact URL match                    |
| `elementIsVisible(locator)`                          | Assert element is visible                 |
| `waitForElementToBeVisible(locator, timeout?)`       | Wait for element visibility               |
| `waitForElementToDisappear(locator)`                 | Wait for element to be hidden             |
| `getTextContent(locator)`                            | Get text content of an element            |
| `getAllTextContent(locator)`                         | Get array of text contents                |
| `elementHasTheText(locator, text, auxiliarText?)`    | Assert element has exact text             |
| `elementHasValue(locator, text)`                     | Assert input has a value                  |
| `selectFirstElement(locator)`                        | Click the first element in a list         |
| `selectElementByTextFromDropDown(listLocator, text)` | Filter a visible list and click by text   |
| `selectFromDropdown(optionText)`                     | Click dropdown trigger and select by role |
| `pageHasTitle(titlePage, auxiliarText?)`             | Assert page title                         |

---

## Fixtures

Located in `fixtures/testFixures.ts`. Extend Playwright's `base` and provide pre-configured page objects.

> **Note:** The filename has an intentional typo — `testFixures.ts` (missing one 't'). Do not rename without updating all imports.

| Fixture                | Behavior                                                     | Returns                                                                       |
| ---------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `navigateToApp`        | Navigates to `BASE_URL` only — no login                      | `{ page, loginPage }`                                                         |
| `loginToTheApp`        | Navigates to `BASE_URL` and logs in with valid credentials   | `{ basePage, loginPage, dashboardPage, assignLeavePage, adminPage, pimPage }` |
| `invalidLoginToTheApp` | Navigates to `BASE_URL` and logs in with invalid credentials | `{ basePage, loginPage, dashboardPage }`                                      |

**Usage — always import `test` from the fixtures, not from `@playwright/test`:**

```typescript
import { test, expect } from '../fixtures/testFixures';

// Unauthenticated test (just navigate to login page)
test('My unauthenticated test', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  // ...
});

// Authenticated test
test('My authenticated test', async ({ loginToTheApp }) => {
  const { dashboardPage, pimPage } = loginToTheApp;
  // ...
});

// Invalid login test
test('My error test', async ({ invalidLoginToTheApp }) => {
  const { loginPage } = invalidLoginToTheApp;
  // ...
});
```

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific file
npx playwright test tests/LoginTest.spec.ts

# Run tests matching a name pattern
npx playwright test -g "TC-NEG"

# Run in UI mode (interactive)
npx playwright test --ui

# Run with visible browser
npx playwright test --headed

# Run in debug mode
npx playwright test --debug
```

---

## Test Coverage

### LoginTest.spec.ts (20 tests)

| Test ID    | Description                                                           | Fixture                |
| ---------- | --------------------------------------------------------------------- | ---------------------- |
| —          | Login Success                                                         | `loginToTheApp`        |
| —          | Validate Invalid Credentials Message                                  | `invalidLoginToTheApp` |
| TC-HP-02   | Login via Enter key (AC-04)                                           | `navigateToApp`        |
| TC-HP-03   | Active session redirects login URL to Dashboard (AC-05)               | `loginToTheApp`        |
| TC-HP-04   | Forgot password link navigates to Reset Password page (AC-06)         | `navigateToApp`        |
| TC-HP-05   | Reset Password Cancel returns authenticated user to Dashboard (AC-06) | `loginToTheApp`        |
| TC-NEG-02  | Invalid username + valid password → Invalid credentials (AC-02)       | `navigateToApp`        |
| TC-NEG-03  | Both credentials invalid → Invalid credentials (AC-02)                | `navigateToApp`        |
| TC-NEG-04  | Empty form submit → Required under both fields (AC-03)                | `navigateToApp`        |
| TC-NEG-05  | Empty username only → Required under username (AC-03)                 | `navigateToApp`        |
| TC-NEG-06  | Empty password only → Required under password (AC-03)                 | `navigateToApp`        |
| TC-EDGE-01 | Username is case-insensitive                                          | `navigateToApp`        |
| TC-EDGE-02 | Password is case-sensitive                                            | `navigateToApp`        |
| TC-EDGE-03 | Whitespace-padded username is not trimmed                             | `navigateToApp`        |
| TC-EDGE-04 | Required messages clear when user starts typing                       | `navigateToApp`        |
| TC-EDGE-05 | Invalid credentials error clears after successful retry               | `invalidLoginToTheApp` |
| TC-EDGE-06 | 256-character username handled gracefully                             | `navigateToApp`        |
| TC-EDGE-07 | SQL injection payload is rejected                                     | `navigateToApp`        |
| TC-EDGE-08 | Password field has `type=password` attribute                          | `navigateToApp`        |
| TC-EDGE-09 | Reset Password page — empty username shows Required                   | `navigateToApp`        |

### Other Spec Files

| File                              | Tests | Module                               |
| --------------------------------- | ----- | ------------------------------------ |
| `DashboardTest.spec.ts`           | 1     | Leave request creation               |
| `AdminTest.spec.ts`               | 1     | Create system user                   |
| `ApiTest.spec.ts`                 | 3     | REST API (employees, holidays, CRUD) |
| `PimPage.spec.ts`                 | 1     | Add and search employee              |
| `patterns/factory-method.spec.ts` | 2     | Factory Method pattern demo          |
| `patterns/singleton.spec.ts`      | 4     | Singleton pattern demo               |

**Total: 32 test cases**

---

## API Testing

`ApiTest.spec.ts` uses `apiFixtures.ts` which performs a browser login, captures session cookies, and then creates an `APIRequestContext` with those credentials — no separate auth token needed.

```typescript
import { test } from '../fixtures/apiFixtures';

test('GET employees', async ({ authenticatedRequest }) => {
  const response = await authenticatedRequest.get('/api/v2/pim/employees');
  expect(response.status()).toBe(200);
});
```

---

## Design Patterns

### Factory Method (`pages/patterns/factory-method/PageFactory.ts`)

Abstract factory for creating page objects. Decouples test code from concrete page classes.

```typescript
abstract class PageFactory {
  abstract createPage(page: Page): BasePage;
  async navigateAndGetPage(page: Page, url: string): Promise<BasePage>;
}

class LoginPageFactory extends PageFactory {
  createPage(page: Page): LoginPage {
    return new LoginPage(page);
  }
}

class DashboardPageFactory extends PageFactory {
  createPage(page: Page): DashboardPage {
    return new DashboardPage(page);
  }
}
```

### Singleton (`pages/patterns/singleton/BrowserContextManager.ts`)

Single shared browser context across tests — useful when multiple tests need the same authenticated session.

```typescript
class BrowserContextManager {
  static getInstance(browser: Browser): BrowserContextManager;
  async getContext(): Promise<BrowserContext>;
  async closeContext(): Promise<void>;
  static resetInstance(): void;
}
```

---

## Utilities

### `utils/decorators.ts`

```typescript
@step
// Method decorator that wraps async methods in test.step() automatically
// Attach to page object methods to get step-level reporting without explicit wrappers
```

### `utils/dateUtils.ts`

```typescript
getDateDaysFromToday(days: number): string
// Returns a date string in "YYYY-DD-MM" format
// ⚠️ Note: day and month are inverted vs ISO standard — matches OrangeHRM input format
```

### `utils/randomValuesUtils.ts`

```typescript
getRandomInt(): string
// Returns a random integer as a string — used for employee IDs and unique identifiers
```

---

## BDD-Style Tests with test.step

Tests follow a Given / When / Then structure using `test.step()` — no Cucumber or extra dependencies.

```typescript
test('Should add a new employee successfully', async ({ loginToTheApp }) => {
  const { dashboardPage, pimPage } = loginToTheApp;

  await test.step('Given the user is on the PIM module', async () => {
    await dashboardPage.click(dashboardPage.pimNavButton);
  });

  await test.step('When the user submits the new employee form', async () => {
    await pimPage.addNewEmployee('Carlos', 'Test', '12345678');
  });

  await test.step('Then a success alert should be visible', async () => {
    await pimPage.elementIsVisible(pimPage.successAlert);
  });
});
```

The `@step` decorator on page object methods achieves the same result automatically:

```typescript
class LoginPage extends BasePage {
  @step
  async login(username: string, password: string) {
    await this.fillInput(this.userNameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}
```

---

## AI Agents

This project integrates with **Claude Code** and uses three specialized sub-agents located in `.claude/agents/`. These agents run via Claude Code's agent system and use MCP tools to interact with the browser and test runner directly.

### playwright-test-planner

Explores the application and creates comprehensive test plans.

**When to use:** Before writing tests for a new feature or user story.

**What it does:**

- Navigates the application using browser MCP tools
- Maps user flows and identifies edge cases
- Generates structured test plan documents in `specs/`
- Captures screenshots for documentation

**Trigger via Claude Code:**

```
/playwright-test-planner
```

---

### playwright-test-generator

Generates Playwright test code from an existing test plan.

**When to use:** After a test plan has been created in `specs/` and you want to generate the spec file.

**What it does:**

- Reads the test plan from `specs/`
- Uses browser MCP tools to inspect locators live in the app
- Writes working `*.spec.ts` files with proper structure
- Follows the project conventions (fixtures, POM, no describe blocks)

**Trigger via Claude Code:**

```
/playwright-test-generator
```

---

### playwright-test-healer

Debugs and fixes failing Playwright tests automatically.

**When to use:** When tests are failing in CI or locally after an app change.

**What it does:**

- Runs the test suite to identify failing tests
- Opens the browser and debugs each failure
- Analyzes broken locators, timing issues, and assertion mismatches
- Rewrites only the broken parts and verifies the fix with a re-run

**Trigger via Claude Code:**

```
/playwright-test-healer
```

---

### How sub-agents work

Each agent runs with a **fresh context** — it has no memory of previous conversations. When launched by the orchestrator (Claude Code CLI), the agent receives:

1. A task description with enough context to work independently
2. Access to MCP tools for browser interaction and file operations
3. Instructions to save discoveries to persistent memory (Engram)

Agents can be chained:

```
playwright-test-planner → creates specs/us-002-feature.plan.md
        ↓
playwright-test-generator → creates tests/FeatureTest.spec.ts
        ↓
playwright-test-healer → fixes any failures after app changes
```

---

## MCP Servers

MCP (Model Context Protocol) servers extend Claude Code with additional tools. Configured in `.mcp.json`.

```json
{
  "mcpServers": {
    "playwright-test": {
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"]
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### `playwright-test` server

Exposes Playwright's **test runner** as MCP tools. Used by the `playwright-test-healer` agent.

| Tool                   | Description                               |
| ---------------------- | ----------------------------------------- |
| `test_run`             | Run the full test suite or specific files |
| `test_list`            | List all available tests                  |
| `test_debug`           | Debug a specific failing test             |
| `generator_read_log`   | Read the test generator log               |
| `generator_write_test` | Write a test to a spec file               |

### `playwright` server

Exposes Playwright's **browser automation** as MCP tools. Used by the planner and generator agents to inspect the live application.

| Tool                       | Description                                |
| -------------------------- | ------------------------------------------ |
| `browser_navigate`         | Navigate to a URL                          |
| `browser_snapshot`         | Capture accessibility snapshot             |
| `browser_take_screenshot`  | Capture screenshot                         |
| `browser_click`            | Click an element                           |
| `browser_type`             | Type text into a field                     |
| `browser_fill_form`        | Fill an entire form                        |
| `browser_generate_locator` | Generate a reliable locator for an element |
| `browser_wait_for`         | Wait for a condition                       |
| `browser_evaluate`         | Execute JavaScript in the page             |
| `browser_network_requests` | Inspect network traffic                    |

---

## Playwright Configuration

| Setting        | Value          |
| -------------- | -------------- |
| Browser        | Chromium       |
| Headless       | `true`         |
| Timeout        | 30s            |
| Assert timeout | 5s             |
| Retries        | 0 local / 2 CI |
| Workers        | 1              |
| Trace          | always         |
| Video          | on             |
| Reporter       | HTML           |

---

## Reports

After running tests, open the HTML report:

```bash
npx playwright show-report
```

The report includes:

- Pass / fail status per test
- Step-by-step breakdown (via `test.step` and `@step` decorator)
- Video recordings
- Traces (always enabled — viewable at trace.playwright.dev)
- Screenshots on failure

---

## CI/CD

### GitHub Actions (`.github/workflows/playwright.yml`)

- **Trigger:** push or PR to `main` / `master`
- **Runner:** `ubuntu-latest`
- **Timeout:** 60 minutes
- **Steps:** checkout → Node LTS → `npm ci` → install browsers → create `.env` from secrets → `npx playwright test`
- **Artifact:** uploads `playwright-report/` with 30-day retention

### AWS CodeBuild (`buildspec.yml`)

Alternative pipeline for AWS-hosted environments.

---

## Modules Covered

| Module           | Description                             | Test File               |
| ---------------- | --------------------------------------- | ----------------------- |
| Login            | Valid, invalid, edge cases, security    | `LoginTest.spec.ts`     |
| Dashboard        | Navigation, leave assignment            | `DashboardTest.spec.ts` |
| Leave Management | Create leave request (`CAN - Personal`) | `DashboardTest.spec.ts` |
| Admin            | Create system user, assign role         | `AdminTest.spec.ts`     |
| PIM              | Add and search employees                | `PimPage.spec.ts`       |
| REST API         | Employees, holidays CRUD                | `ApiTest.spec.ts`       |

**Test credentials:** `Admin` / `admin123`
**Employee used in tests:** `Orange Test`

---

## Known Issues

- `utils/dateUtils.ts` returns dates in `YYYY-DD-MM` format (day and month inverted vs ISO `YYYY-MM-DD`). This matches the OrangeHRM date input — verify before changing.
- `slowMo` is set to `50000ms` in `playwright.config.ts` — intentionally slows execution for visibility. Reduce for faster local runs.

---

## Resources

- [Playwright Docs](https://playwright.dev/)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright MCP](https://github.com/microsoft/playwright-mcp)
- [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com)
- [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code)
