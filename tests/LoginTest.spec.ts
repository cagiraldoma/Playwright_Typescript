import { test, expect } from '../fixtures/testFixtures';

test('Login Success', async ({ loginToTheApp }) => {
  const { dashboardPage } = loginToTheApp;
  await expect(dashboardPage.dashboardHeader, 'Dashboard header not visible after login').toBeVisible();
  await dashboardPage.verifyUrlContains('dashboard/index');
  await dashboardPage.pageHasTitle('OrangeHRM');
});

test('Validate Invalid Credentials Message', async ({ invalidLoginToTheApp }) => {
  const { loginPage } = invalidLoginToTheApp;
  await expect(loginPage.invalidCredentialsMsg, 'Invalid credentials message not displayed').toHaveText('Invalid credentials');
  await loginPage.verifyPageUrl('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await loginPage.pageHasTitle('OrangeHRM', 'Pague Title is diffenrent');
});

test('TC-HP-02: Login with valid credentials via Enter key (AC-04)', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await expect(loginPage.userNameInput, 'Login page should be visible with Username field').toBeVisible();
  await loginPage.fillInput(loginPage.userNameInput, process.env.ADMIN_USERNAME!);
  await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Dashboard' }), 'Dashboard heading should be visible after Enter key login').toBeVisible();
  await loginPage.verifyUrlContains('dashboard/index');
});

test('TC-HP-03: Active session navigates to login URL → redirected to Dashboard without re-login (AC-05)', async ({ loginToTheApp }) => {
  const { dashboardPage } = loginToTheApp;
  await expect(dashboardPage.dashboardHeader, 'Dashboard should be visible after initial login').toBeVisible();
  await dashboardPage.navigateTo(process.env.BASE_URL!);
  await dashboardPage.verifyUrlContains('dashboard/index');
  await expect(dashboardPage.dashboardHeader, 'Dashboard heading should still be visible after authenticated redirect from login URL').toBeVisible();
});

test('TC-HP-04: Forgot your password? link navigates to Reset Password page (AC-06)', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await expect(loginPage.forgotPasswordButton, '"Forgot your password?" should be visible on login page').toBeVisible();
  await loginPage.click(loginPage.forgotPasswordButton);
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

test('TC-HP-05: Reset Password Cancel button returns authenticated user to Dashboard (AC-06)', async ({ loginToTheApp, page }) => {
  const { dashboardPage } = loginToTheApp;
  await expect(dashboardPage.dashboardHeader, 'Dashboard should be visible after login').toBeVisible();
  await dashboardPage.navigateTo('https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode');
  await expect(page.getByRole('heading', { name: 'Reset Password' }), 'Reset Password heading should be visible').toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await dashboardPage.verifyUrlContains('dashboard/index');
  await expect(dashboardPage.dashboardHeader, 'Dashboard heading should be visible after clicking Cancel on Reset Password page').toBeVisible();
});

test('TC-NEG-02: Invalid username with valid password shows Invalid credentials error (AC-02)', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await loginPage.fillInput(loginPage.userNameInput, 'InvalidUser');
  await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);
  await loginPage.click(loginPage.loginButton);
  await expect(page.getByRole('alert'), 'Invalid credentials alert should appear for invalid username').toBeVisible();
  await expect(page.getByRole('alert'), 'Alert should contain "Invalid credentials" text').toHaveText('Invalid credentials');
  await loginPage.verifyUrlContains('auth/login');
});

test('TC-NEG-03: Both username and password invalid shows Invalid credentials error (AC-02)', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await loginPage.fillInput(loginPage.userNameInput, 'WrongUser');
  await loginPage.fillInput(loginPage.passwordInput, 'WrongPass');
  await loginPage.click(loginPage.loginButton);
  await expect(page.getByRole('alert'), 'Invalid credentials alert should appear for both-invalid credentials').toBeVisible();
  await expect(page.getByRole('alert'), 'Alert text should be "Invalid credentials"').toHaveText('Invalid credentials');
  await loginPage.verifyUrlContains('auth/login');
});

test('TC-NEG-04: Submit with both fields empty shows Required under each field (AC-03)', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await expect(loginPage.loginButton, 'Login button should be visible').toBeVisible();
  await loginPage.click(loginPage.loginButton);
  await expect(page.getByText('Required').nth(0), 'Required validation should appear under Username field').toBeVisible();
  await expect(page.getByText('Required').nth(1), 'Required validation should appear under Password field').toBeVisible();
  await loginPage.verifyUrlContains('auth/login');
});

test('TC-NEG-05: Submit with Username empty shows Required only under Username (AC-03)', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);
  await loginPage.click(loginPage.loginButton);
  await expect(page.getByText('Required'), 'Required validation should appear under Username when it is empty').toBeVisible();
  await expect(loginPage.invalidCredentialsMsg, 'Invalid credentials error should NOT appear for client-side empty field validation').not.toBeVisible();
  await loginPage.verifyUrlContains('auth/login');
});

test('TC-NEG-06: Submit with Password empty shows Required only under Password (AC-03)', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await loginPage.fillInput(loginPage.userNameInput, process.env.ADMIN_USERNAME!);
  await loginPage.click(loginPage.loginButton);
  await expect(page.getByText('Required'), 'Required validation should appear under Password when it is empty').toBeVisible();
  await expect(loginPage.invalidCredentialsMsg, 'Invalid credentials error should NOT appear for client-side empty field validation').not.toBeVisible();
  await loginPage.verifyUrlContains('auth/login');
});

test('TC-EDGE-01: Username is case-insensitive — lowercase "admin" logs in successfully', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await loginPage.fillInput(loginPage.userNameInput, 'admin');
  await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);
  await loginPage.click(loginPage.loginButton);
  await expect(page.getByRole('heading', { name: 'Dashboard' }), 'Dashboard should load confirming username is case-insensitive').toBeVisible();
  await loginPage.verifyUrlContains('dashboard/index');
});

test('TC-EDGE-02: Password is case-sensitive — uppercase password shows Invalid credentials', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await loginPage.fillInput(loginPage.userNameInput, process.env.ADMIN_USERNAME!);
  await loginPage.fillInput(loginPage.passwordInput, 'ADMIN123');
  await loginPage.click(loginPage.loginButton);
  await expect(page.getByRole('alert'), 'Invalid credentials alert should appear confirming password is case-sensitive').toBeVisible();
  await loginPage.verifyUrlContains('auth/login');
});

test('TC-EDGE-03: Username with leading/trailing whitespace is NOT trimmed — login fails', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await loginPage.fillInput(loginPage.userNameInput, '  Admin  ');
  await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);
  await loginPage.click(loginPage.loginButton);
  await expect(page.getByRole('alert'), 'Invalid credentials should appear — system does not trim username whitespace').toBeVisible();
  await loginPage.verifyUrlContains('auth/login');
});

test('TC-EDGE-04: Required validation messages clear when user starts typing in each field', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await loginPage.click(loginPage.loginButton);
  await expect(page.getByText('Required').nth(0), 'Required should be visible under Username before typing').toBeVisible();
  await expect(page.getByText('Required').nth(1), 'Required should be visible under Password before typing').toBeVisible();

  // Scoped locators avoid nth() fragility when one error clears before the other
  const usernameRowError = page
    .locator('.oxd-form-row')
    .filter({ has: page.locator('input[name="username"]') })
    .getByText('Required');
  const passwordRowError = page
    .locator('.oxd-form-row')
    .filter({ has: page.locator('input[name="password"]') })
    .getByText('Required');

  await loginPage.fillInput(loginPage.userNameInput, 'A');
  await expect(usernameRowError, 'Required message under Username should clear after typing').not.toBeVisible();
  await loginPage.fillInput(loginPage.passwordInput, 'a');
  await expect(passwordRowError, 'Required message under Password should clear after typing').not.toBeVisible();
});

test('TC-EDGE-05: Invalid credentials error clears when user corrects credentials and retries', async ({ invalidLoginToTheApp, page }) => {
  const { loginPage } = invalidLoginToTheApp;
  await expect(page.getByRole('alert'), 'Invalid credentials alert should be visible after failed login').toBeVisible();
  await loginPage.verifyUrlContains('auth/login');
  await loginPage.fillInput(loginPage.userNameInput, process.env.ADMIN_USERNAME!);
  await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);
  await loginPage.click(loginPage.loginButton);
  await loginPage.verifyUrlContains('dashboard/index');
  await expect(page.getByRole('heading', { name: 'Dashboard' }), 'Dashboard should load after correcting credentials').toBeVisible();
});

test('TC-EDGE-06: Login with 256-character username is handled gracefully — Invalid credentials shown', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  const longUsername = 'a'.repeat(256);
  await loginPage.fillInput(loginPage.userNameInput, longUsername);
  await loginPage.fillInput(loginPage.passwordInput, process.env.ADMIN_PASSWORD!);
  await loginPage.click(loginPage.loginButton);
  await expect(page.getByRole('alert'), 'Application should show Invalid credentials for long username input').toBeVisible();
  await loginPage.verifyUrlContains('auth/login');
});

test('TC-EDGE-07: SQL injection in Username field is rejected — Invalid credentials shown', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await loginPage.fillInput(loginPage.userNameInput, "' OR '1'='1");
  await loginPage.fillInput(loginPage.passwordInput, 'anything');
  await loginPage.click(loginPage.loginButton);
  await expect(page.getByRole('alert'), 'SQL injection should be rejected with Invalid credentials error').toBeVisible();
  await loginPage.verifyUrlContains('auth/login');
});

test('TC-EDGE-08: Password field masks input characters — type=password attribute verified', async ({ navigateToApp }) => {
  const { page } = navigateToApp;
  await expect(page.locator('input[name="password"]'), 'Password input should have type=password to mask typed characters').toHaveAttribute('type', 'password');
});

test('TC-EDGE-09: Reset Password page — submitting empty username shows Required validation', async ({ navigateToApp }) => {
  const { page, loginPage } = navigateToApp;
  await loginPage.click(loginPage.forgotPasswordButton);
  await expect(page.getByRole('heading', { name: 'Reset Password' }), 'Reset Password page should load').toBeVisible();
  await page.getByRole('button', { name: 'Reset Password' }).click();
  await expect(page.getByText('Required'), 'Required validation should appear under Username on Reset Password page').toBeVisible();
  await loginPage.verifyUrlContains('auth/requestPasswordResetCode');
});
