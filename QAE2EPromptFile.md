# AI-Agent E2E Test Automation Workflow

## How to use this file

Provide only one input:

> **"Run the E2E automation workflow for Jira story `https://carlossdet.atlassian.net/browse/SCRUM-5`"**

The orchestrator reads everything else automatically: story details, acceptance criteria, URLs, and credentials come from Jira and the project files. Nothing needs to be filled in manually.

---

## Objective

You are an AI-driven QA automation orchestrator. Given a single Jira story key, execute a complete end-to-end Playwright test automation workflow using the available MCP servers and specialized agents.

**Workflow phases:**

1. Retrieve the Jira user story via the Atlassian MCP.
2. Create a test plan using the `playwright-test-planner` agent.
3. Perform exploratory testing using the Playwright Browser MCP.
4. Auto-generate test cases using the `playwright-test-generator` agent.
5. Heal and stabilize tests using the `playwright-test-healer` agent.
6. Generate a test execution report.
7. Commit all artifacts to Git.

---

## Global Rules

- Execute phases in order. Do not skip any phase.
- Each phase reads its inputs from Jira, from the project files, or from the artifacts produced by the previous phase. Nothing is assumed or invented.
- Use semantic Playwright locators: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`, `getByTestId`.
- Never use hard-coded waits (`waitForTimeout`). Use Playwright auto-waiting and explicit assertions.
- Never hard-code credentials. Read them from environment variables or `.env`.
- Never commit `.env`, secrets, traces, videos, or screenshots unless the repo explicitly tracks them.
- Tests must be independent, repeatable, and safe to run in CI.
- If acceptance criteria are missing from the story, infer scenarios from the description and mark them clearly as assumptions.

---

## Phase 1 — Retrieve Jira User Story

### Agent / MCP Prompt

```
You are starting the E2E automation workflow for Jira story: {STORY_KEY}

Step 1 — Resolve the Atlassian cloud ID.
Call mcp__atlassian__getAccessibleAtlassianResources with no parameters.
Identify the cloud ID for the Atlassian site you have access to and use it in every subsequent Atlassian MCP call.

Step 2 — Fetch the full story.
Call mcp__atlassian__getJiraIssue with:
  - issueIdOrKey: the story key provided by the user
  - responseContentFormat: "markdown"

Step 3 — Extract and structure the following fields from the response:
  - Story key and title
  - Full description (As a / I want / So that)
  - All acceptance criteria as a numbered list
  - Application URL under test (look in the description, background section, or linked resources)
  - Any test credentials or test data mentioned
  - Priority, labels, and assignee
  - Linked issues, subtasks, or QA notes in comments

Step 4 — Produce a structured Jira Story Summary in this format:

## Jira Story Summary
- Key:
- Title:
- Application URL:
- Description:
- Acceptance Criteria: (numbered list)
- Test Data / Credentials: (if mentioned in the story)
- Dependencies:
- Testing Notes:

Step 5 — Quality gate.
If acceptance criteria are missing, infer scenarios from the description and mark them as "[ASSUMED]".
Do not proceed to Phase 2 until the summary is complete.
```

---

## Phase 2 — Create Test Plan

### Agent / MCP Prompt

```
You are a QA engineer creating a test plan for the Jira story retrieved in Phase 1.

Read the Jira Story Summary produced in Phase 1.
Extract: story key, story title, application URL, and all acceptance criteria.

Using the playwright-test-planner agent:

1. Call mcp__playwright-test__planner_setup_page to open the browser.
2. Navigate to the application URL found in the Jira story.
3. If the feature requires authentication, locate the login credentials in:
   - The Jira story summary (Phase 1 output)
   - The project .env file (ADMIN_USERNAME, ADMIN_PASSWORD)
   Log in before navigating to the target feature.
4. Explore the feature covered by the story. Interact with all relevant UI elements.
5. For each acceptance criterion:
   - Derive at least one happy-path scenario.
   - Derive at least one negative or failure scenario.
   - Identify edge cases (boundary values, empty inputs, long strings, keyboard navigation, session state, security probes).
6. Generate the test plan with this structure:

# Test Plan: {story key} - {story title}

## Scope
## Out of Scope
## Preconditions
## Test Data
## Test Scenarios
### Happy Path
### Negative Cases
### Edge Cases
## Accessibility Checks
## Cross-Browser Coverage
## Risks
## Assumptions

Each test scenario must include: test name, preconditions, steps, expected result, and the AC it covers.

7. Call mcp__playwright-test__planner_save_plan to save the plan.
8. Save the file to: docs/test-plans/{story-key}-test-plan.md

Quality gate: every acceptance criterion from Phase 1 must map to at least one test scenario.
```

---

## Phase 3 — Exploratory Testing

### Agent / MCP Prompt

```
You are performing exploratory testing on the live application before automating any tests.

Read the Jira Story Summary from Phase 1 to get:
- Application URL
- Feature to explore
- Acceptance criteria
- Any test credentials mentioned

If credentials are not in the Jira story, read them from the project .env file:
- ADMIN_USERNAME and ADMIN_PASSWORD for valid login scenarios
- ADMIN_INVALID_PASSWORD for negative scenarios

Using the Playwright Browser MCP (mcp__playwright__*):

1. Call mcp__playwright__browser_navigate to open the application URL.
2. If authentication is required to reach the feature under test, complete the login flow first.
3. Navigate to the feature covered by the Jira story.
4. For each acceptance criterion from Phase 1, perform the corresponding user interaction.
   After each interaction, call mcp__playwright__browser_snapshot to capture the DOM state.
5. Call mcp__playwright__browser_take_screenshot at key states:
   - Successful action completed
   - Error or validation message displayed
   - Redirect or page change triggered
6. For every interactive element, record the most stable locator available.
   Prefer: getByRole, getByLabel, getByText, getByPlaceholder.
   Avoid CSS classes that look auto-generated.
7. Call mcp__playwright__browser_network_requests to verify:
   - HTTP method used (GET, POST, etc.)
   - Endpoint called
   - Response status code
   for each form submission or significant user action.
8. Call mcp__playwright__browser_console_messages to check for JavaScript errors during any interaction.
9. Note any observed behavior that contradicts the acceptance criteria from Phase 1.

Save findings to: docs/exploratory/{story-key}-exploratory-notes.md

Use this structure:
# Exploratory Testing Notes: {story key}
## Environment
## User Flow Observed
## Stable Locators Found
## Validation Messages
## Network Observations
## Console Errors
## Bugs or Discrepancies vs Acceptance Criteria
## Test Data Used
## Automation Recommendations

Quality gate: do not proceed to Phase 4 until stable locators have been identified for all interactive elements in the acceptance criteria.
```

---

## Phase 4 — Auto-Generate Playwright Tests

### Agent / MCP Prompt

```
You are generating Playwright test cases for the Jira story retrieved in Phase 1.
Read ALL referenced artifacts and project files before writing any code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — READ ALL INPUTS FIRST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read these files before generating anything:

  1. Phase 1 output — Jira Story Summary (story key, title, URL, acceptance criteria)
  2. Phase 2 output — docs/test-plans/{story-key}-test-plan.md
  3. Phase 3 output — docs/exploratory/{story-key}-exploratory-notes.md (stable locators)
  4. fixtures/testFixures.ts         <- primary fixture file for UI tests
  5. fixtures/patternFixtures.ts     <- navigation-only and raw-page fixtures
  6. fixtures/apiFixtures.ts         <- authenticated API context fixture
  7. pages/BasePage.ts               <- base class with all shared methods
  8. pages/LoginPage.ts              <- reference Page Object
  9. pages/DashboardPage.ts          <- reference Page Object
  10. tests/LoginTest.spec.ts        <- reference spec (import style, assertion style)
  11. tests/DashboardTest.spec.ts    <- reference spec (describe block style)
  12. utils/decorators.ts            <- @step decorator definition
  13. utils/dateUtils.ts             <- date calculation helper
  14. utils/randomValuesUtils.ts     <- random value helper

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — PROJECT ARCHITECTURE (mandatory — do not deviate)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INHERITANCE HIERARCHY:
  BasePage (pages/BasePage.ts)
    ├── LoginPage
    ├── DashboardPage
    ├── AssignLeavePage   (uses dateUtils)
    ├── AdminPage
    ├── PimPage
    └── NavBarPage
  All new Page Objects MUST extend BasePage.

FIXTURE FILES AND WHAT THEY EXPOSE:

  fixtures/testFixures.ts — use this for most UI tests:

    loginToTheApp -> { basePage, loginPage, dashboardPage, assignLeavePage, adminPage, pimPage }
      Behavior: navigates to process.env.BASE_URL!
                logs in with process.env.ADMIN_USERNAME! + process.env.ADMIN_PASSWORD!

    invalidLoginToTheApp -> { basePage, loginPage, dashboardPage }
      Behavior: navigates to process.env.BASE_URL!
                logs in with process.env.ADMIN_USERNAME! + process.env.ADMIN_INVALID_PASSWORD!

  fixtures/patternFixtures.ts — use when you need raw page access without POM instances:

    navigateToApp -> { page }
      Behavior: navigates to process.env.BASE_URL! only — no login performed

    loginToTheApp -> { page, browser }
      Behavior: navigates and logs in — returns raw page and browser

  fixtures/apiFixtures.ts — use only for API-level tests:

    authenticatedRequest -> APIRequestContext
      Behavior: performs UI login, extracts session cookies, returns an API context

ENVIRONMENT VARIABLES (from .env — never hard-code these values):
  process.env.BASE_URL!                  <- application login page URL
  process.env.ADMIN_USERNAME!            <- valid test username
  process.env.ADMIN_PASSWORD!            <- valid test password
  process.env.ADMIN_INVALID_PASSWORD!    <- intentionally wrong password for negative tests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — AVAILABLE BASE PAGE METHODS (use these — do not re-implement)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  navigateTo(url: string)
  click(locator: Locator)
  fillInput(locator: Locator, value: string)
  verifyUrlContains(path: string)                    <- toHaveURL with regex
  verifyPageUrl(url: string)                         <- toHaveURL with exact string
  elementIsVisible(locator: Locator)
  waitForElementToDisappear(locator: Locator)
  waitForElementToBeVisible(locator: Locator, timeout?)
  getTextContent(locator: Locator)
  getAllTextContent(locator: Locator)
  elementHasTheText(locator, text, auxiliarText?)    <- toHaveText with optional message
  elementHasValue(locator: Locator, text: string)
  selectFirstElement(locator: Locator)
  selectElementByTextFromDropDown(dropdownLocator, elementText)
  selectFromDropdown(optionText: string)             <- uses getByRole('option')
  pageHasTitle(titlePage: string, auxiliarText?)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — AVAILABLE UTILITY FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  utils/dateUtils.ts:
    getDateDaysFromToday(days: number): string
      Returns a date in YYYY-DD-MM format. Day and month are intentionally swapped —
      this matches the OrangeHRM date input field format. Do not "fix" this.

  utils/randomValuesUtils.ts:
    getRandomInt(): string
      Returns a random integer as a string. Use when test data must be unique per run.

  utils/decorators.ts:
    @step
      Wraps a Page Object method in test.step() for Playwright HTML report visibility.
      Apply to every business action method in new Page Objects.
      Import: import { step } from '../utils/decorators';

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — HOW TO CREATE A NEW PAGE OBJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the feature under test requires a Page Object that does not exist yet, create it
following this exact pattern (mirror the style of LoginPage.ts and DashboardPage.ts):

  import { Page, Locator } from '@playwright/test';
  import { BasePage } from './BasePage';
  import { step } from '../utils/decorators';

  export class FeaturePage extends BasePage {
    readonly primaryInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
      super(page);
      this.primaryInput = page.locator('input[name="fieldName"]');
      this.submitButton = page.getByRole('button', { name: 'Submit' });
    }

    @step
    async performAction(param: string): Promise<void> {
      await this.fillInput(this.primaryInput, param);
      await this.click(this.submitButton);
    }
  }

Rules for Page Objects:
  - All locators must be readonly and declared in the constructor.
  - Prefer getByRole / getByLabel / getByText / getByPlaceholder over CSS or XPath.
  - Only use CSS selectors or XPath when semantic locators are not viable.
  - Every business method (not simple getters) must have the @step decorator.
  - Call BasePage methods inside Page Object methods — do not call page.* directly.
  - Save the file to: pages/{FeatureName}Page.ts

If the new Page Object is needed inside a fixture, add it to fixtures/testFixures.ts:
  - Instantiate it: const featurePage = new FeaturePage(page);
  - Include it in the MyFixure type definition.
  - Include it in the use({...}) call of the relevant fixture.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6 — WHICH FIXTURE TO CHOOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Test needs valid login + full POM pages  -> loginToTheApp         (testFixures.ts)
  Test validates a failed login attempt    -> invalidLoginToTheApp  (testFixures.ts)
  Test needs page navigation only          -> navigateToApp         (patternFixtures.ts)
  Test exercises the login page itself     -> navigateToApp (patternFixtures.ts) +
                                              instantiate LoginPage manually in the test
  Test is API-level                        -> authenticatedRequest  (apiFixtures.ts)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7 — IMPORT CONVENTION (critical)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  For UI tests using POM fixtures:
    import { test, expect } from '../fixtures/testFixures';

  For tests using navigation-only or raw-page fixtures:
    import { test, expect } from '../fixtures/patternFixtures';

  For API-level tests:
    import { test, expect } from '../fixtures/apiFixtures';

  NEVER import test directly from '@playwright/test' in spec files.
  The file tests/seed.spec.ts uses a direct import — it is a scratch file, do not copy its pattern.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 8 — ASSERTION STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Always pass a meaningful error message as the second argument to expect():

    await expect(locator, 'Dashboard header should be visible after login').toBeVisible();
    await expect(locator, 'Error message text mismatch').toHaveText('Invalid credentials');
    await expect(page, 'URL should contain dashboard path').toHaveURL(/dashboard/);

  Prefer Page Object assertion methods when they cover the need:
    await dashboardPage.verifyUrlContains('dashboard/index');
    await dashboardPage.pageHasTitle('OrangeHRM');
    await loginPage.elementHasTheText(loginPage.invalidCredentialsMsg, 'Invalid credentials');

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 9 — TEST FILE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Group tests by acceptance criterion area using test.describe.
  Use a flat test() (no describe wrapper) only for standalone single scenarios.
  File name: tests/{story-key}.spec.ts

  Template:

    import { test, expect } from '../fixtures/testFixures';

    test.describe('{story-key} - {Feature Area}', () => {

      test('should {describe expected behavior}', async ({ loginToTheApp }) => {
        const { dashboardPage } = loginToTheApp;
        // Act
        // Assert with error message
      });

    });

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 10 — GENERATE AND SAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Generate one test file that covers all acceptance criteria from Phase 1.
  Use the stable locators identified in the Phase 3 exploratory notes.
  Do not duplicate coverage already present in tests/LoginTest.spec.ts
  or tests/DashboardTest.spec.ts.

  Save the test file to: tests/{story-key}.spec.ts
  If a new Page Object was created: pages/{FeatureName}Page.ts
  If the fixture was extended: fixtures/testFixures.ts

Quality gate: every acceptance criterion from Phase 1 must have at least one test.
No test may contain hard-coded credentials, arbitrary timeouts, or missing assertions.
```

---

## Phase 5 — Heal and Stabilize Tests

### Agent / MCP Prompt

```
You are debugging and fixing failing Playwright tests. Fix root causes only — never weaken assertions to force a pass.

Using the playwright-test-healer agent:

Read the Phase 1 Jira Story Summary to confirm the story key and the application URL.
Read the test file produced in Phase 4: tests/{story-key}.spec.ts

Step 1 — Run the test suite.
Call mcp__playwright-test__test_run for the test file from Phase 4.

Step 2 — List all tests and their current status.
Call mcp__playwright-test__test_list.

Step 3 — For each failing test:
  a. Call mcp__playwright-test__test_debug with the failing test name to get the full error and stack trace.
  b. Open the application URL from Phase 1 and call mcp__playwright-test__browser_snapshot
     to inspect the live DOM at the point of failure.
  c. If the issue is a broken locator, call mcp__playwright-test__browser_generate_locator
     to find a stable replacement.
  d. Identify the root cause:
     - Broken or stale locator → update the locator
     - Timing issue → replace with proper Playwright waiting strategy
     - Wrong assertion → fix the expected value based on observed behavior
     - Missing test data → update the setup
     - Real product defect → do NOT fix the test; document the bug instead
  e. Apply the minimal change that fixes the root cause.
  f. Re-run the specific test to confirm it passes before moving to the next failure.

Step 4 — After all fixes, run the full suite one final time to confirm no regressions.

Step 5 — Produce a healing summary and save it to: docs/{story-key}-healing-summary.md

Use this structure:
# Healing Summary: {story key}
## Failures Found
## Root Causes
## Changes Applied
## Remaining Issues (product bugs, not test issues)
## Final Status

Quality gate: the full suite must pass locally before proceeding to Phase 6.
If tests still fail due to confirmed product bugs, document them and continue — do not block the workflow.
```

---

## Phase 6 — Generate Test Report

### Agent / MCP Prompt

```
You are generating the final QA test execution report.

Read the Phase 1 Jira Story Summary to get the story key, title, and application URL.
Read the healing summary from Phase 5: docs/{story-key}-healing-summary.md

Step 1 — Run the final test execution.
Check package.json for a test script. If one exists, use it.
Otherwise run: npx playwright test tests/{story-key}.spec.ts --reporter=html

Step 2 — Read the execution results:
  - Total tests
  - Passed / Failed / Skipped count
  - Duration
  - Any error messages from remaining failures

Step 3 — Produce the Markdown report and save it to: reports/{story-key}-e2e-test-report.md

Use this structure:
# E2E Test Report: {story key} - {story title}
## Summary
## Environment (URL, browser, date)
## Test Execution (total / pass / fail / skip / duration)
## Results by Acceptance Criterion
## Known Issues (product bugs documented in Phase 5)
## Risks
## Recommendation (pass / conditional pass / blocked)

Quality gate: the report must reflect the ACTUAL latest execution results.
Do not report tests as passing unless the most recent run confirms it.
```

---

## Phase 7 — Commit to Git

### Agent / MCP Prompt

```
You are committing all QA automation artifacts to the repository.

Read the Phase 1 Jira Story Summary to get the story key and feature name.

Step 1 — Run git status to see what changed.

Step 2 — Run the test suite one final time to confirm a clean pass:
npx playwright test tests/{story-key}.spec.ts
If tests fail, stop. Do not commit a broken suite unless explicitly instructed.

Step 3 — Stage only the following files:
  git add docs/test-plans/{story-key}-test-plan.md
  git add docs/exploratory/{story-key}-exploratory-notes.md
  git add tests/{story-key}.spec.ts
  git add docs/{story-key}-healing-summary.md
  git add reports/{story-key}-e2e-test-report.md
Also stage any new or modified page objects under pages/ created during this workflow.

Step 4 — Do NOT stage:
  .env, playwright-report/, test-results/, *.png, *.webm, *.zip, *.trace

Step 5 — Commit with conventional commit format:
git commit -m "{story-key}: add e2e automation for {feature name from story title}"

Step 6 — Do NOT push. Return the commit hash.

Quality gate: only commit if Phase 6 confirms the suite passed (or all failures are documented product bugs).
```

---

## Final Deliverables

When the workflow completes, respond with:

```
# Automation Completed

## Jira Story
{key} — {title}

## Tests Created
{count} tests in tests/{story-key}.spec.ts

## Execution Result
{pass} passed / {fail} failed / {skip} skipped

## Artifacts
- docs/test-plans/{story-key}-test-plan.md
- docs/exploratory/{story-key}-exploratory-notes.md
- tests/{story-key}.spec.ts
- docs/{story-key}-healing-summary.md
- reports/{story-key}-e2e-test-report.md

## Git Commit
{hash}

## Notes / Risks
{any remaining issues or assumptions}
```

---

## Failure Handling

If any phase fails in a way that blocks the next phase:

1. Stop and document the failure.
2. Do not fabricate results or skip ahead.
3. Report using this format:

```
# Automation Blocked

## Blocked Phase
{phase number and name}

## Reason
{what failed and why}

## Evidence
{error message, screenshot reference, or relevant output}

## Recommended Next Action
{what should be done to unblock}
```

---

## Best Practices Checklist

Before closing the workflow, verify:

- [ ] Jira story was retrieved via Atlassian MCP — no data was assumed.
- [ ] Every acceptance criterion maps to at least one test scenario.
- [ ] Exploratory testing was performed on the live application.
- [ ] Stable locators were identified and used in the generated tests.
- [ ] No credentials, secrets, or environment-specific data are hard-coded in test files.
- [ ] No arbitrary timeouts are present in any test.
- [ ] Tests passed locally before committing.
- [ ] Only relevant files were staged for commit.
- [ ] Commit message references the Jira story key.
- [ ] Report reflects the actual latest execution results.
