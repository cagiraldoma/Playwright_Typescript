# E2E Test Report: SCRUM-5 - [US-001] Sign In - OrangeHRM Live

## Summary

| | |
|---|---|
| **Story** | SCRUM-5 — [US-001] Sign In - OrangeHRM Live |
| **Execution Date** | 2026-05-06 |
| **Final Status** | ✅ PASS |
| **Tests Passed** | 18 / 18 |
| **Tests Failed** | 0 |
| **Tests Skipped** | 0 |
| **Duration** | ~1m 48s |

---

## Environment

| | |
|---|---|
| **Application** | OrangeHRM OS 5.8 |
| **URL** | https://opensource-demo.orangehrmlive.com/web/index.php/auth/login |
| **Browser** | Chromium (Desktop Chrome) |
| **Playwright** | ^1.53.1 |
| **Workers** | 1 |
| **Execution Mode** | Sequential (fullyParallel: false) |

---

## Acceptance Criteria Coverage

| AC | Description | Tests | Status |
|---|---|---|---|
| AC-01 | Valid login → Dashboard displayed | TC-HP-01 (LoginTest.spec.ts) | ✅ Pass |
| AC-02 | Invalid credentials → error message shown | TC-NEG-01 (LoginTest.spec.ts), TC-NEG-02, TC-NEG-03 | ✅ Pass |
| AC-03 | Empty fields → Required validation | TC-NEG-04, TC-NEG-05, TC-NEG-06, TC-EDGE-04 | ✅ Pass |
| AC-04 | Enter key login | TC-HP-02 | ✅ Pass |
| AC-05 | Active session redirects login URL | TC-HP-03 | ✅ Pass |
| AC-06 | Forgot password link → Reset Password page | TC-HP-04, TC-HP-05, TC-EDGE-09 | ✅ Pass |

---

## Test Execution — SCRUM-5.spec.ts (18 tests)

| # | Test Name | AC | Status |
|---|---|---|---|
| 1 | TC-HP-02: Login via Enter key | AC-04 | ✅ Pass |
| 2 | TC-NEG-04: Both fields empty → Required on both | AC-03 | ✅ Pass |
| 3 | TC-NEG-05: Username empty only → Required on Username | AC-03 | ✅ Pass |
| 4 | TC-NEG-06: Password empty only → Required on Password | AC-03 | ✅ Pass |
| 5 | TC-HP-04: Forgot password link → Reset Password page | AC-06 | ✅ Pass |
| 6 | TC-EDGE-09: Reset Password — empty username → Required | AC-06 | ✅ Pass |
| 7 | TC-NEG-02: Invalid username + valid password | AC-02 | ✅ Pass |
| 8 | TC-NEG-03: Both credentials invalid | AC-02 | ✅ Pass |
| 9 | TC-EDGE-01: Username case-insensitive (lowercase "admin" works) | AC-01 | ✅ Pass |
| 10 | TC-EDGE-02: Password case-sensitive (ADMIN123 fails) | AC-02 | ✅ Pass |
| 11 | TC-EDGE-03: Whitespace username not trimmed → fails | AC-02 | ✅ Pass |
| 12 | TC-EDGE-04: Required messages clear on typing | AC-03 | ✅ Pass |
| 13 | TC-EDGE-06: 256-char username → graceful Invalid credentials | AC-02 | ✅ Pass |
| 14 | TC-EDGE-07: SQL injection in username → rejected | Security | ✅ Pass |
| 15 | TC-EDGE-08: Password field type=password verified | Security | ✅ Pass |
| 16 | TC-HP-03: Active session → redirect to Dashboard | AC-05 | ✅ Pass |
| 17 | TC-HP-05: Reset Password Cancel → returns to Dashboard | AC-06 | ✅ Pass |
| 18 | TC-EDGE-05: Error clears on correct retry | AC-02 | ✅ Pass |

*TC-HP-01 and TC-NEG-01 are covered in tests/LoginTest.spec.ts (not duplicated).*

---

## Healing Applied (Phase 5)

**TC-EDGE-04** required a locator fix. The original positional `.nth(0)/.nth(1)` selectors on `getByText('Required')` became ambiguous once one error cleared. Fixed by scoping each "Required" locator to its parent `.oxd-form-row` container via `.filter({ has: page.locator('input[name="username"]') })`. Root cause was test code, not a product defect.

---

## Issues Found

None. All 6 acceptance criteria pass. Zero console errors detected during exploration. No product defects identified.

---

## Risks

| Risk | Severity | Notes |
|---|---|---|
| Demo environment availability | Medium | App is a public demo — may have downtime or data resets between runs |
| Test data dependency | Low | Tests use the built-in Admin account — not affected by data resets |
| Username case-insensitivity | Info | "admin" (lowercase) logs in successfully — not documented in AC, worth clarifying with PO |

---

## Recommendation

✅ **PASS — Story SCRUM-5 is ready to move to Done.**

All acceptance criteria are fully automated and passing. The suite is CI-safe, independent, and uses no hard-coded waits or credentials.
