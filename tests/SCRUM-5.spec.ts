// spec: docs/test-plans/SCRUM-5-test-plan.md
// exploratory: docs/exploratory/SCRUM-5-exploratory-notes.md

import { test as patternTest, expect } from '../fixtures/patternFixtures';
import { test as fixtureTest } from '../fixtures/testFixures';
import { LoginPage } from '../pages/LoginPage';

// ─────────────────────────────────────────────────────────────────────────────
// AC-04 — Enter key submits the login form (TC-HP-02)
// ─────────────────────────────────────────────────────────────────────────────
patternTest.describe('SCRUM-5 - Sign In', () => {
  patternTest('TC-HP-02: Login with valid credentials via Enter key (AC-04)', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Login page is displayed
    await expect(loginPage.userNameInput, 'Login page should be visible with Username field').toBeVisible();

    // 2. Fill Username field
    await loginPage.fillInput(loginPage.userNameInput, process.env.ADMIN_USERNAME!);

    // 3. Fill Password then press Enter to submit
    await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);
    await page.keyboard.press('Enter');

    // 4. Verify Dashboard loads after Enter key submission
    await expect(page.getByRole('heading', { name: 'Dashboard' }), 'Dashboard heading should be visible after Enter key login').toBeVisible();
    await loginPage.verifyUrlContains('dashboard/index');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // AC-03 — Empty field validation (TC-NEG-04, TC-NEG-05, TC-NEG-06)
  // ──────────────────────────────────────────────────────────────────────────
  patternTest('TC-NEG-04: Submit with both fields empty shows Required under each field (AC-03)', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Login page is displayed with empty Username and Password fields
    await expect(loginPage.loginButton, 'Login button should be visible').toBeVisible();

    // 2. Click Login without entering any credentials — client-side validation only
    await loginPage.click(loginPage.loginButton);

    // 3. Required messages appear under both fields; URL stays on login page
    await expect(page.getByText('Required').nth(0), 'Required validation should appear under Username field').toBeVisible();
    await expect(page.getByText('Required').nth(1), 'Required validation should appear under Password field').toBeVisible();
    await loginPage.verifyUrlContains('auth/login');
  });

  patternTest('TC-NEG-05: Submit with Username empty shows Required only under Username (AC-03)', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Fill Password only, leave Username empty
    await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);

    // 2. Click Login
    await loginPage.click(loginPage.loginButton);

    // 3. Required appears under Username; no Invalid credentials error; URL stays on login page
    await expect(page.getByText('Required'), 'Required validation should appear under Username when it is empty').toBeVisible();
    await expect(loginPage.invalidCredentialsMsg, 'Invalid credentials error should NOT appear for client-side empty field validation').not.toBeVisible();
    await loginPage.verifyUrlContains('auth/login');
  });

  patternTest('TC-NEG-06: Submit with Password empty shows Required only under Password (AC-03)', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Fill Username only, leave Password empty
    await loginPage.fillInput(loginPage.userNameInput, process.env.ADMIN_USERNAME!);

    // 2. Click Login
    await loginPage.click(loginPage.loginButton);

    // 3. Required appears under Password only; no Invalid credentials error
    await expect(page.getByText('Required'), 'Required validation should appear under Password when it is empty').toBeVisible();
    await expect(loginPage.invalidCredentialsMsg, 'Invalid credentials error should NOT appear for client-side empty field validation').not.toBeVisible();
    await loginPage.verifyUrlContains('auth/login');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // AC-06 — Forgot Password navigation (TC-HP-04)
  // ──────────────────────────────────────────────────────────────────────────
  patternTest('TC-HP-04: Forgot your password? link navigates to Reset Password page (AC-06)', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Login page is displayed — Forgot your password? is visible as a <p> element
    await expect(loginPage.forgotPasswordButton, '"Forgot your password?" should be visible on login page').toBeVisible();

    // 2. Click the Forgot your password? paragraph (NOT getByRole('link') — it is a <p> tag)
    await loginPage.click(loginPage.forgotPasswordButton);

    // 3. Reset Password page is displayed with heading, instruction, Username field, buttons
    await expect(page.getByRole('heading', { name: 'Reset Password' }), 'Reset Password heading should be visible').toBeVisible();
    await loginPage.verifyUrlContains('auth/requestPasswordResetCode');
    await expect(
      page.getByText('Please enter your username to identify your account to reset your password'),
      'Reset Password instruction text should be visible',
    ).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Username' }), 'Username field should be visible on Reset Password page').toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' }), 'Cancel button should be visible on Reset Password page').toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset Password' }), 'Reset Password button should be visible').toBeVisible();
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TC-EDGE-09 — Reset Password page empty username validation
  // ──────────────────────────────────────────────────────────────────────────
  patternTest('TC-EDGE-09: Reset Password page — submitting empty username shows Required validation', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Navigate to Reset Password page via Forgot your password? link
    await loginPage.click(loginPage.forgotPasswordButton);
    await expect(page.getByRole('heading', { name: 'Reset Password' }), 'Reset Password page should load').toBeVisible();

    // 2. Click Reset Password button with empty username field
    await page.getByRole('button', { name: 'Reset Password' }).click();

    // 3. Required validation appears; user stays on Reset Password page
    await expect(page.getByText('Required'), 'Required validation should appear under Username on Reset Password page').toBeVisible();
    await loginPage.verifyUrlContains('auth/requestPasswordResetCode');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // AC-02 — Negative Cases (deeper coverage beyond LoginTest.spec.ts)
  // ──────────────────────────────────────────────────────────────────────────
  patternTest('TC-NEG-02: Invalid username with valid password shows Invalid credentials error (AC-02)', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Type invalid username and valid password
    await loginPage.fillInput(loginPage.userNameInput, 'InvalidUser');
    await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);

    // 2. Click Login
    await loginPage.click(loginPage.loginButton);

    // 3. Invalid credentials alert visible; user stays on login page
    await expect(page.getByRole('alert'), 'Invalid credentials alert should appear for invalid username').toBeVisible();
    await expect(page.getByRole('alert'), 'Alert should contain "Invalid credentials" text').toHaveText('Invalid credentials');
    await loginPage.verifyUrlContains('auth/login');
  });

  patternTest('TC-NEG-03: Both username and password invalid shows Invalid credentials error (AC-02)', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Type both invalid credentials
    await loginPage.fillInput(loginPage.userNameInput, 'WrongUser');
    await loginPage.fillInput(loginPage.passwordInput, 'WrongPass');

    // 2. Click Login
    await loginPage.click(loginPage.loginButton);

    // 3. Invalid credentials alert visible; no Dashboard elements shown
    await expect(page.getByRole('alert'), 'Invalid credentials alert should appear for both-invalid credentials').toBeVisible();
    await expect(page.getByRole('alert'), 'Alert text should be "Invalid credentials"').toHaveText('Invalid credentials');
    await loginPage.verifyUrlContains('auth/login');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Edge Cases
  // ──────────────────────────────────────────────────────────────────────────
  patternTest('TC-EDGE-01: Username is case-insensitive — lowercase "admin" logs in successfully', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Type lowercase username and valid password
    await loginPage.fillInput(loginPage.userNameInput, 'admin');
    await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);

    // 2. Click Login
    await loginPage.click(loginPage.loginButton);

    // 3. Dashboard loads — confirming username field is case-insensitive
    await expect(page.getByRole('heading', { name: 'Dashboard' }), 'Dashboard should load confirming username is case-insensitive').toBeVisible();
    await loginPage.verifyUrlContains('dashboard/index');
  });

  patternTest('TC-EDGE-02: Password is case-sensitive — uppercase password shows Invalid credentials', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Type valid username and all-uppercase password
    await loginPage.fillInput(loginPage.userNameInput, process.env.ADMIN_USERNAME!);
    await loginPage.fillInput(loginPage.passwordInput, 'ADMIN123');

    // 2. Click Login
    await loginPage.click(loginPage.loginButton);

    // 3. Invalid credentials — password is case-sensitive
    await expect(page.getByRole('alert'), 'Invalid credentials alert should appear confirming password is case-sensitive').toBeVisible();
    await loginPage.verifyUrlContains('auth/login');
  });

  patternTest('TC-EDGE-03: Username with leading/trailing whitespace is NOT trimmed — login fails', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Type whitespace-padded username with valid password
    await loginPage.fillInput(loginPage.userNameInput, '  Admin  ');
    await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);

    // 2. Click Login
    await loginPage.click(loginPage.loginButton);

    // 3. Invalid credentials — system does not trim leading/trailing whitespace in username
    await expect(page.getByRole('alert'), 'Invalid credentials should appear — system does not trim username whitespace').toBeVisible();
    await loginPage.verifyUrlContains('auth/login');
  });

  patternTest('TC-EDGE-04: Required validation messages clear when user starts typing in each field', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Trigger both Required messages by submitting empty form
    await loginPage.click(loginPage.loginButton);
    await expect(page.getByText('Required').nth(0), 'Required should be visible under Username before typing').toBeVisible();
    await expect(page.getByText('Required').nth(1), 'Required should be visible under Password before typing').toBeVisible();

    // Scoped locators: each error is checked within its own form row to avoid
    // positional nth() fragility when one error clears before the other.
    const usernameRowError = page
      .locator('.oxd-form-row')
      .filter({ has: page.locator('input[name="username"]') })
      .getByText('Required');
    const passwordRowError = page
      .locator('.oxd-form-row')
      .filter({ has: page.locator('input[name="password"]') })
      .getByText('Required');

    // 2. Start typing in Username — its Required message clears; Password Required stays
    await loginPage.fillInput(loginPage.userNameInput, 'A');
    await expect(usernameRowError, 'Required message under Username should clear after typing').not.toBeVisible();

    // 3. Start typing in Password — its Required message clears
    await loginPage.fillInput(loginPage.passwordInput, 'a');
    await expect(passwordRowError, 'Required message under Password should clear after typing').not.toBeVisible();
  });

  patternTest('TC-EDGE-06: Login with 256-character username is handled gracefully — Invalid credentials shown', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);
    const longUsername = 'a'.repeat(256);

    // 1. Fill the Username field with 256 characters
    await loginPage.fillInput(loginPage.userNameInput, longUsername);
    await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);

    // 2. Click Login
    await loginPage.click(loginPage.loginButton);

    // 3. Application handles gracefully with Invalid credentials — no crash, user stays on login page
    await expect(page.getByRole('alert'), 'Application should show Invalid credentials for long username input').toBeVisible();
    await loginPage.verifyUrlContains('auth/login');
  });

  patternTest('TC-EDGE-07: SQL injection in Username field is rejected — Invalid credentials shown', async ({ navigateToApp }) => {
    const { page } = navigateToApp;
    const loginPage = new LoginPage(page);

    // 1. Type SQL injection payload in Username field
    await loginPage.fillInput(loginPage.userNameInput, "' OR '1'='1");
    await loginPage.fillInput(loginPage.passwordInput, 'anything');

    // 2. Click Login
    await loginPage.click(loginPage.loginButton);

    // 3. SQL injection is rejected — Invalid credentials shown, no successful login
    await expect(page.getByRole('alert'), 'SQL injection should be rejected with Invalid credentials error').toBeVisible();
    await loginPage.verifyUrlContains('auth/login');
  });

  patternTest('TC-EDGE-08: Password field masks input characters — type=password attribute verified', async ({ navigateToApp }) => {
    const { page } = navigateToApp;

    // 1. Verify the password input has type="password" so characters are masked
    await expect(page.locator('input[name="password"]'), 'Password input should have type=password to mask typed characters').toHaveAttribute('type', 'password');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests requiring pre-authenticated session (use testFixures)
// ─────────────────────────────────────────────────────────────────────────────
fixtureTest.describe('SCRUM-5 - Sign In', () => {

  // AC-05 — Active session redirects login URL to Dashboard (TC-HP-03)
  fixtureTest('TC-HP-03: Active session navigates to login URL → redirected to Dashboard without re-login (AC-05)', async ({ loginToTheApp }) => {
    const { dashboardPage } = loginToTheApp;

    // 1. Session is established — Dashboard is currently displayed
    await expect(dashboardPage.dashboardHeader, 'Dashboard should be visible after initial login').toBeVisible();

    // 2. Navigate directly to the login URL while session is active
    await dashboardPage.navigateTo(process.env.BASE_URL!);

    // 3. Browser redirects immediately to Dashboard — login form never renders
    await dashboardPage.verifyUrlContains('dashboard/index');
    await expect(dashboardPage.dashboardHeader, 'Dashboard heading should still be visible after authenticated redirect from login URL').toBeVisible();
  });

  // TC-HP-05 — Reset Password Cancel returns to Dashboard (authenticated)
  fixtureTest('TC-HP-05: Reset Password Cancel button returns authenticated user to Dashboard (AC-06)', async ({ loginToTheApp, page }) => {
    const { dashboardPage } = loginToTheApp;

    // 1. Session is established — Dashboard is visible
    await expect(dashboardPage.dashboardHeader, 'Dashboard should be visible after login').toBeVisible();

    // 2. Navigate to Reset Password page while authenticated
    await dashboardPage.navigateTo('https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode');
    await expect(page.getByRole('heading', { name: 'Reset Password' }), 'Reset Password heading should be visible').toBeVisible();

    // 3. Click Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // 4. Redirected back to Dashboard
    await dashboardPage.verifyUrlContains('dashboard/index');
    await expect(dashboardPage.dashboardHeader, 'Dashboard heading should be visible after clicking Cancel on Reset Password page').toBeVisible();
  });

  // TC-EDGE-05 — Invalid credentials error clears when user corrects credentials and retries
  fixtureTest('TC-EDGE-05: Invalid credentials error clears when user corrects credentials and retries', async ({ invalidLoginToTheApp, page }) => {
    const { loginPage } = invalidLoginToTheApp;

    // 1. Invalid login has been attempted — error message is visible on the page
    await expect(page.getByRole('alert'), 'Invalid credentials alert should be visible after failed login').toBeVisible();
    await loginPage.verifyUrlContains('auth/login');

    // 2. Fields are cleared after failed login — fill in correct credentials
    await loginPage.fillInput(loginPage.userNameInput, process.env.ADMIN_USERNAME!);
    await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);
    await loginPage.click(loginPage.loginButton);

    // 3. Alert is gone — user is redirected to Dashboard after successful retry
    await loginPage.verifyUrlContains('dashboard/index');
    await expect(page.getByRole('heading', { name: 'Dashboard' }), 'Dashboard should load after correcting credentials').toBeVisible();
  });
});
