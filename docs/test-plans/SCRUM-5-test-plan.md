# Test Plan: SCRUM-5 - [US-001] Sign In - OrangeHRM Live

## Application Overview

This test plan covers the Sign In functionality for OrangeHRM Live (https://opensource-demo.orangehrmlive.com/web/index.php/auth/login). The login page presents a Username field, a Password field, a Login button, and a "Forgot your password?" link. On successful authentication the user is redirected to the Dashboard at /web/index.php/dashboard/index. The page also shows social media links (LinkedIn, Facebook, Twitter, YouTube) and version information (OrangeHRM OS 5.8). The password reset flow navigates to /web/index.php/auth/requestPasswordResetCode and provides a Username field plus Cancel and Reset Password buttons. An active session causes the login URL to redirect immediately to the Dashboard without displaying the login form. All six acceptance criteria from SCRUM-5 are covered: happy-path login, invalid credentials, empty field validation, Enter-key submission, session-redirect behaviour, and the Forgot Password navigation.

## Test Scenarios

### 1. Happy Path - Successful Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-HP-01: Login with valid credentials via Login button (AC-01)

**File:** `tests/login/TC-HP-01-valid-login-button.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed with the heading 'Login', a Username field, a Password field, a Login button, and a 'Forgot your password?' link
  2. Locate the Username textbox and type 'Admin'
    - expect: The Username field contains the text 'Admin'
  3. Locate the Password textbox and type 'admin123'
    - expect: The Password field is filled (characters are masked)
  4. Click the 'Login' button
    - expect: The browser navigates to the Dashboard URL: /web/index.php/dashboard/index
    - expect: The page heading 'Dashboard' is visible
    - expect: The top-right user profile area is visible (showing the logged-in user name)
    - expect: The left-side navigation menu is visible with modules: Admin, PIM, Leave, Time, Recruitment, My Info, Performance, Dashboard, Directory, Maintenance, Claim, Buzz
    - expect: No error message or alert is displayed

#### 1.2. TC-HP-02: Login with valid credentials via Enter key (AC-04)

**File:** `tests/login/TC-HP-02-valid-login-enter-key.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Click the Username textbox and type 'Admin'
    - expect: The Username field contains 'Admin'
  3. Click the Password textbox, type 'admin123', then press the Enter key
    - expect: The browser navigates to the Dashboard URL: /web/index.php/dashboard/index
    - expect: The page heading 'Dashboard' is visible
    - expect: The navigation menu with all HR modules is present
    - expect: No error message is displayed

#### 1.3. TC-HP-03: Active session redirects login URL to Dashboard (AC-05)

**File:** `tests/login/TC-HP-03-active-session-redirect.spec.ts`

**Steps:**
  1. Open a browser session that already has a valid authenticated session cookie (log in as Admin with password admin123 first)
    - expect: The Dashboard page is displayed after initial login
  2. In the same browser session, navigate directly to the login URL: https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The browser does NOT display the login form
    - expect: The browser is redirected immediately to the Dashboard at /web/index.php/dashboard/index
    - expect: The Dashboard heading and navigation menu are visible
    - expect: No re-authentication is required

#### 1.4. TC-HP-04: Forgot Password link navigates to Reset Password page (AC-06)

**File:** `tests/login/TC-HP-04-forgot-password-navigation.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed with the 'Forgot your password?' link visible
  2. Click the 'Forgot your password?' link
    - expect: The browser navigates to /web/index.php/auth/requestPasswordResetCode
    - expect: The page displays the heading 'Reset Password'
    - expect: The page displays the instruction text: 'Please enter your username to identify your account to reset your password'
    - expect: A Username input field is visible
    - expect: A 'Cancel' button and a 'Reset Password' button are visible

#### 1.5. TC-HP-05: Reset Password Cancel button returns user to Dashboard when authenticated

**File:** `tests/login/TC-HP-05-reset-password-cancel.spec.ts`

**Steps:**
  1. Log in with valid credentials (Admin / admin123) so a session exists
    - expect: Dashboard is displayed
  2. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode
    - expect: The Reset Password page is displayed
  3. Click the 'Cancel' button
    - expect: The browser navigates back to the Dashboard at /web/index.php/dashboard/index
    - expect: The Dashboard heading and navigation are visible

### 2. Negative Cases - Invalid Credentials and Validation

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC-NEG-01: Login with valid username and invalid password shows error (AC-02)

**File:** `tests/login/TC-NEG-01-invalid-password.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Type 'Admin' in the Username field
    - expect: The Username field contains 'Admin'
  3. Type 'invalid123' in the Password field
    - expect: The Password field is filled
  4. Click the 'Login' button
    - expect: An alert/error message with the text 'Invalid credentials' is displayed on the page
    - expect: The URL remains at /web/index.php/auth/login (user is NOT redirected to the Dashboard)
    - expect: The Username and Password fields are still present and accessible
    - expect: No Dashboard navigation is shown

#### 2.2. TC-NEG-02: Login with invalid username and valid password shows error (AC-02)

**File:** `tests/login/TC-NEG-02-invalid-username.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Type 'InvalidUser' in the Username field
    - expect: The Username field contains 'InvalidUser'
  3. Type 'admin123' in the Password field
    - expect: The Password field is filled
  4. Click the 'Login' button
    - expect: An alert/error message with the text 'Invalid credentials' is displayed
    - expect: The URL remains at /web/index.php/auth/login
    - expect: The login form is still visible

#### 2.3. TC-NEG-03: Login with both username and password invalid shows error (AC-02)

**File:** `tests/login/TC-NEG-03-both-invalid.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Type 'WrongUser' in the Username field and 'WrongPass' in the Password field
    - expect: Both fields contain the entered text
  3. Click the 'Login' button
    - expect: An alert/error message with the text 'Invalid credentials' is displayed
    - expect: The user remains on the login page
    - expect: No Dashboard elements are visible

#### 2.4. TC-NEG-04: Submit login form with both fields empty shows Required validation (AC-03)

**File:** `tests/login/TC-NEG-04-empty-both-fields.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed with empty Username and Password fields
  2. Click the 'Login' button without entering any text in either field
    - expect: A 'Required' validation message appears beneath the Username field
    - expect: A 'Required' validation message appears beneath the Password field
    - expect: The URL remains at /web/index.php/auth/login
    - expect: No 'Invalid credentials' error message appears
    - expect: No Dashboard navigation is shown

#### 2.5. TC-NEG-05: Submit login form with only Username empty shows Required validation (AC-03)

**File:** `tests/login/TC-NEG-05-empty-username-only.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Leave the Username field empty and type 'admin123' in the Password field
    - expect: The Password field contains 'admin123', the Username field is empty
  3. Click the 'Login' button
    - expect: A 'Required' validation message appears beneath the Username field
    - expect: No validation message appears beneath the Password field (which is filled)
    - expect: The URL remains at /web/index.php/auth/login

#### 2.6. TC-NEG-06: Submit login form with only Password empty shows Required validation (AC-03)

**File:** `tests/login/TC-NEG-06-empty-password-only.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Type 'Admin' in the Username field and leave the Password field empty
    - expect: The Username field contains 'Admin', the Password field is empty
  3. Click the 'Login' button
    - expect: A 'Required' validation message appears beneath the Password field
    - expect: No validation message appears beneath the Username field (which is filled)
    - expect: The URL remains at /web/index.php/auth/login

### 3. Edge Cases - Boundary and Special Input Conditions

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC-EDGE-01: Login with correct username in different case (case-sensitivity check)

**File:** `tests/login/TC-EDGE-01-username-case-sensitivity.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Type 'admin' (all lowercase) in the Username field and 'admin123' in the Password field
    - expect: Both fields are filled
  3. Click the 'Login' button
    - expect: If login succeeds: the Dashboard is displayed, confirming the system is case-insensitive for usernames
    - expect: If login fails: the 'Invalid credentials' error is shown, confirming the system is case-sensitive for usernames

#### 3.2. TC-EDGE-02: Login with correct password in different case (password case-sensitivity check)

**File:** `tests/login/TC-EDGE-02-password-case-sensitivity.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Type 'Admin' in the Username field and 'ADMIN123' (all uppercase) in the Password field
    - expect: Both fields are filled
  3. Click the 'Login' button
    - expect: The 'Invalid credentials' error message is displayed, confirming the password field is case-sensitive
    - expect: The user remains on the login page

#### 3.3. TC-EDGE-03: Login with leading and trailing whitespace in Username

**File:** `tests/login/TC-EDGE-03-whitespace-username.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Type '  Admin  ' (with leading and trailing spaces) in the Username field and 'admin123' in the Password field
    - expect: The Username field contains the padded string
  3. Click the 'Login' button
    - expect: If the system trims whitespace: the Dashboard is displayed
    - expect: If the system does not trim whitespace: the 'Invalid credentials' error is displayed

#### 3.4. TC-EDGE-04: Validation messages clear after user starts typing corrected input

**File:** `tests/login/TC-EDGE-04-validation-message-clears.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Click the 'Login' button with both fields empty to trigger the 'Required' validation messages
    - expect: Both 'Required' messages are visible beneath the Username and Password fields
  3. Click the Username field and start typing 'Admin'
    - expect: The 'Required' validation message beneath the Username field disappears as soon as text is entered
  4. Click the Password field and start typing 'admin123'
    - expect: The 'Required' validation message beneath the Password field disappears as soon as text is entered

#### 3.5. TC-EDGE-05: Invalid credentials error clears when user modifies credentials and retries

**File:** `tests/login/TC-EDGE-05-error-clears-on-retry.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Type 'Admin' in Username and 'invalid123' in Password, then click 'Login'
    - expect: The 'Invalid credentials' alert is visible
  3. Clear the Password field and type the correct password 'admin123', then click 'Login'
    - expect: The 'Invalid credentials' alert is no longer visible
    - expect: The user is redirected to the Dashboard at /web/index.php/dashboard/index

#### 3.6. TC-EDGE-06: Login with very long username input (boundary input test)

**File:** `tests/login/TC-EDGE-06-long-username-input.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Type a string of 256 characters (e.g., repeated 'a' characters) in the Username field and 'admin123' in the Password field
    - expect: The Username field accepts the input without crashing or throwing a JS error
  3. Click the 'Login' button
    - expect: The application handles the input gracefully
    - expect: Either an 'Invalid credentials' error is shown or a field-length validation message appears
    - expect: No unhandled JavaScript errors occur in the console
    - expect: The user remains on the login page

#### 3.7. TC-EDGE-07: Login with SQL injection string in Username field (security edge case)

**File:** `tests/login/TC-EDGE-07-sql-injection-username.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Type the string \"' OR '1'='1\" in the Username field and 'anything' in the Password field
    - expect: The fields accept the input
  3. Click the 'Login' button
    - expect: The application does NOT log in successfully
    - expect: The 'Invalid credentials' error message is displayed
    - expect: The user remains on the login page
    - expect: No server error (HTTP 500) occurs
    - expect: No unhandled JavaScript errors occur in the console

#### 3.8. TC-EDGE-08: Password field masks characters as they are typed

**File:** `tests/login/TC-EDGE-08-password-masking.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Click the Password field and type 'admin123'
    - expect: The typed characters are displayed as dots or asterisks (masked)
    - expect: The actual password text is NOT visible in the field
    - expect: The password field has type='password' attribute

#### 3.9. TC-EDGE-09: Reset Password page submission with empty username field

**File:** `tests/login/TC-EDGE-09-reset-password-empty-username.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Click the 'Forgot your password?' link
    - expect: The Reset Password page is displayed at /web/index.php/auth/requestPasswordResetCode
  3. Leave the Username field empty and click the 'Reset Password' button
    - expect: A validation message appears indicating the Username field is required or the field is highlighted
    - expect: The user remains on the Reset Password page
    - expect: No password reset email confirmation is shown

#### 3.10. TC-EDGE-10: Login page loads correctly with browser back navigation after logout

**File:** `tests/login/TC-EDGE-10-browser-back-after-logout.spec.ts`

**Steps:**
  1. Log in with valid credentials (Admin / admin123) so the Dashboard is displayed
    - expect: Dashboard is visible
  2. Click the user profile dropdown in the top-right corner and log out of the application
    - expect: The user is logged out and the Login page is displayed
  3. Press the browser Back button
    - expect: The application does NOT allow access to protected pages without re-authentication
    - expect: Either the Login page is shown again or the user is redirected to the Login page
    - expect: No cached Dashboard content is accessible without a valid session

### 4. Accessibility Checks

**Seed:** `tests/seed.spec.ts`

#### 4.1. TC-A11Y-01: Login page keyboard-only navigation

**File:** `tests/login/TC-A11Y-01-keyboard-navigation.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Press Tab to navigate through all interactive elements on the page: Username field, Password field, Login button, and 'Forgot your password?' link
    - expect: Each interactive element receives visible focus in a logical order
    - expect: The focus indicator is clearly visible on each focused element
    - expect: No interactive elements are skipped or unreachable via keyboard
  3. With focus on the Username field, type 'Admin'. Press Tab to move to the Password field, type 'admin123'. Press Tab to reach the Login button and press Space or Enter to submit
    - expect: The form submits successfully via keyboard only
    - expect: The Dashboard is displayed
    - expect: No mouse interaction was required to complete the login

#### 4.2. TC-A11Y-02: Login form fields have proper labels and ARIA attributes

**File:** `tests/login/TC-A11Y-02-form-labels-aria.spec.ts`

**Steps:**
  1. Open a fresh browser session with no existing cookies and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The Login page is displayed
  2. Inspect the Username input field for its accessible label using the accessibility tree
    - expect: The Username field has an accessible name of 'Username' visible in the accessibility tree
  3. Inspect the Password input field for its accessible label
    - expect: The Password field has an accessible name of 'Password' visible in the accessibility tree
  4. Inspect the Login button for its accessible name
    - expect: The Login button has an accessible name of 'Login'
  5. After triggering the 'Invalid credentials' error, inspect the alert element
    - expect: The error alert has role='alert' so screen readers announce it immediately
