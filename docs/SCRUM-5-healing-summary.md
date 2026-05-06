# Healing Summary: SCRUM-5

## Failures Found

| Test | Status | Error |
|------|--------|-------|
| TC-EDGE-04: Required validation messages clear when user starts typing in each field | FAILED | `expect(locator).not.toBeVisible()` — `getByText('Required').nth(0)` resolved to the Password field's "Required" message (still visible) instead of the already-cleared Username one |

## Root Causes

**TC-EDGE-04 — Fragile positional locator**

The original assertion used `page.getByText('Required').nth(0)` to check that the Username field's validation message cleared after the user typed a character. This is inherently fragile:

1. When the form is submitted empty, two "Required" spans are rendered — index 0 = Username, index 1 = Password.
2. After typing 'A' into Username, that field's "Required" disappears. The Password "Required" is still visible.
3. At that point `getByText('Required').nth(0)` resolves to the **Password** span (now the only one, index 0). That span IS visible, so `.not.toBeVisible()` fails.

The test logic was sound — the application clears validation correctly — but the selector assumed a fixed DOM ordering that breaks as items are removed from the list.

## Changes Applied

**File: `tests/SCRUM-5.spec.ts` — TC-EDGE-04 (line 223)**

Replaced positional `.nth()` selectors with scoped locators that anchor each error message to its parent `.oxd-form-row` container using Playwright's `.filter({ has: ... })` API. Each row contains exactly one `<input>` (by `name` attribute), making the scope unambiguous regardless of how many errors are currently visible.

```typescript
// Before (fragile — nth() breaks when errors clear one at a time)
await expect(page.getByText('Required').nth(0), '...').not.toBeVisible();

// After (scoped — locator is always tied to the correct field row)
const usernameRowError = page
  .locator('.oxd-form-row')
  .filter({ has: page.locator('input[name="username"]') })
  .getByText('Required');
const passwordRowError = page
  .locator('.oxd-form-row')
  .filter({ has: page.locator('input[name="password"]') })
  .getByText('Required');

await expect(usernameRowError, '...').not.toBeVisible();
// ... type in password ...
await expect(passwordRowError, '...').not.toBeVisible();
```

## Remaining Issues (product bugs, not test issues)

None. All 18 tests reflect correct application behavior.

Note: TC-EDGE-05 experienced a single transient `page.goto` timeout (30 s) during the second full-suite run caused by network latency on the public OrangeHRM demo server. It passed immediately on individual retry and on the subsequent full-suite run. This is an infrastructure concern, not a test defect. The existing `retries: 2` CI setting in `playwright.config.ts` handles this.

## Final Status

**18 / 18 passed — quality gate met.**

| Run | Passed | Failed |
|-----|--------|--------|
| Initial | 17 | 1 (TC-EDGE-04) |
| After fix | 17 | 1 (TC-EDGE-05, transient network) |
| Final confirmation | 18 | 0 |
