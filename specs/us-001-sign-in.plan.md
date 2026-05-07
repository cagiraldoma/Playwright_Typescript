# US-001 Sign In - OrangeHRM Live - Comprehensive Test Plan

## Application Overview

Test plan for the OrangeHRM Live login page (US-001). The application is a publicly accessible HR management system demo at https://opensource-demo.orangehrmlive.com/web/index.php/auth/login. The login page presents a Username textbox, a Password textbox (type=password, no visibility toggle), a Login button, and a "Forgot your password?" link. Validation is inline: clicking Login with empty fields renders a "Required" message beneath each empty field. An invalid credential attempt renders an alert-role element containing the text "Invalid credentials". Successful login redirects to /web/index.php/dashboard/index. Navigating to the login URL while an active session exists automatically redirects to the dashboard. The Forgot Password page lives at /web/index.php/auth/requestPasswordResetCode and contains a Username field, a Cancel button (returns user to dashboard when logged in, or login page when logged out), and a Reset Password button. There is no password visibility toggle, no CAPTCHA, and no visible account-lockout counter in the UI.

## Test Scenarios

### 1. AC-01 - Valid Login Redirects to Dashboard

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-01 - Valid username and password via Login button displays Dashboard

**File:** `tests/login/tc-01-valid-login-button.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads with a heading of 'Login', a Username textbox, a Password textbox, and a Login button visible
  2. Type 'Admin' into the Username textbox
    - expect: The Username field contains the text 'Admin'
  3. Type 'admin123' into the Password textbox
    - expect: The Password field is populated (characters are masked)
  4. Click the 'Login' button
    - expect: The page navigates to /web/index.php/dashboard/index
    - expect: The page heading 'Dashboard' is visible in the top banner
    - expect: The sidebar navigation is visible with links Admin, PIM, Leave, Time, Recruitment, My Info, Performance, Dashboard, Directory, Maintenance, Claim, Buzz
    - expect: No error alert is shown on the page

#### 1.2. TC-07 - Valid username and password via Enter key displays Dashboard

**File:** `tests/login/tc-07-valid-login-enter-key.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type 'Admin' into the Username textbox
    - expect: The Username field contains 'Admin'
  3. Type 'admin123' into the Password textbox
    - expect: The Password field is populated
  4. Press the Enter key (do NOT click the Login button)
    - expect: The form is submitted
    - expect: The page navigates to /web/index.php/dashboard/index
    - expect: The Dashboard heading is visible
    - expect: No error alert is shown

#### 1.3. TC-11 - Username field is case-sensitive (wrong case returns Invalid credentials)

**File:** `tests/login/tc-11-username-case-sensitive.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type 'admin' (all lowercase) into the Username textbox
    - expect: The Username field contains 'admin'
  3. Type 'admin123' into the Password textbox
    - expect: The Password field is populated
  4. Click the Login button
    - expect: An alert element appears containing the text 'Invalid credentials'
    - expect: The URL remains on the login page (/auth/login)
    - expect: The user is NOT redirected to the Dashboard

#### 1.4. TC-12 - Credentials with leading or trailing whitespace are rejected

**File:** `tests/login/tc-12-whitespace-credentials.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type ' Admin' (with a leading space) into the Username textbox
    - expect: The Username field shows ' Admin'
  3. Type 'admin123' into the Password textbox
    - expect: The Password field is populated
  4. Click the Login button
    - expect: An alert element appears containing 'Invalid credentials'
    - expect: The URL remains on the login page
    - expect: The application does NOT strip whitespace and log in the user

### 2. AC-02 - Invalid Credentials Show Error Message

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC-02 - Invalid username with valid password shows Invalid credentials alert

**File:** `tests/login/tc-02-invalid-username.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type 'NonExistentUser' into the Username textbox
    - expect: The field contains 'NonExistentUser'
  3. Type 'admin123' into the Password textbox
    - expect: The Password field is populated
  4. Click the Login button
    - expect: An alert element with role='alert' is displayed
    - expect: The alert contains exactly the text 'Invalid credentials'
    - expect: The URL remains /web/index.php/auth/login
    - expect: Both Username and Password textboxes remain visible and interactable
    - expect: No stack trace, database error, or internal system information is exposed in the UI

#### 2.2. TC-03 - Valid username with invalid password shows Invalid credentials alert

**File:** `tests/login/tc-03-invalid-password.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type 'Admin' into the Username textbox
    - expect: The field contains 'Admin'
  3. Type 'invalid123' into the Password textbox
    - expect: The Password field is populated
  4. Click the Login button
    - expect: An alert element is displayed containing 'Invalid credentials'
    - expect: The URL remains on the login page
    - expect: No success redirect occurs
    - expect: No system error details are exposed

#### 2.3. TC-13 - Incorrect username and incorrect password both show same generic error

**File:** `tests/login/tc-13-both-invalid-credentials.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type 'WrongUser' into the Username textbox
    - expect: The field is populated
  3. Type 'WrongPass' into the Password textbox
    - expect: The field is populated
  4. Click the Login button
    - expect: The alert contains 'Invalid credentials'
    - expect: The error message is identical to TC-02 and TC-03 (no hint about which field is wrong)
    - expect: URL remains on login page

#### 2.4. TC-08 - SQL injection in username field does not expose database error

**File:** `tests/login/tc-08-sql-injection-username.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type the SQL injection payload "' OR '1'='1" into the Username textbox
    - expect: The field accepts the text as-is
  3. Type 'anything' into the Password textbox
    - expect: The field is populated
  4. Click the Login button
    - expect: Login fails — no unauthorized access is granted
    - expect: The alert shows 'Invalid credentials' or stays on login page
    - expect: No SQL error, stack trace, or database detail is visible in the UI
    - expect: No HTTP 500 response is triggered

#### 2.5. TC-14 - XSS payload in username field is not rendered as script

**File:** `tests/login/tc-14-xss-username.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type the XSS payload '<script>alert(1)</script>' into the Username textbox
    - expect: The characters are entered as literal text
  3. Type 'admin123' into the Password textbox
    - expect: The field is populated
  4. Click the Login button
    - expect: No JavaScript alert dialog fires
    - expect: The script tag is not executed
    - expect: The page shows 'Invalid credentials' or stays on login page with the payload rendered as escaped text

#### 2.6. TC-15 - Very long username input (255+ characters) does not crash the application

**File:** `tests/login/tc-15-long-username.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type a string of 300 consecutive 'a' characters into the Username textbox
    - expect: The field either accepts or truncates the input without error
  3. Type 'admin123' into the Password textbox
    - expect: The Password field is populated
  4. Click the Login button
    - expect: Login fails with 'Invalid credentials' or a validation message
    - expect: The page does not crash, freeze, or show an unhandled server error
    - expect: No HTTP 500 is triggered

#### 2.7. TC-16 - Very long password input (255+ characters) does not crash the application

**File:** `tests/login/tc-16-long-password.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type 'Admin' into the Username textbox
    - expect: The field is populated
  3. Type a string of 300 consecutive 'a' characters into the Password textbox
    - expect: The field either accepts or truncates the input
  4. Click the Login button
    - expect: Login fails without a server error
    - expect: The alert shows 'Invalid credentials' or a validation message
    - expect: No HTTP 500 or unhandled exception is visible

### 3. AC-03 - Empty Fields Show Required Validation

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC-04 - Empty username with valid password shows Required under Username

**File:** `tests/login/tc-04-empty-username.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly with no validation messages visible
  2. Leave the Username textbox empty and type 'admin123' into the Password textbox
    - expect: Password field is populated, Username field remains empty
  3. Click the Login button
    - expect: A 'Required' validation message appears directly beneath the Username textbox
    - expect: No 'Required' message appears under the Password field
    - expect: No 'Invalid credentials' alert is shown
    - expect: The URL remains on the login page
    - expect: The Username textbox is highlighted in an error state (red border or similar visual indicator)

#### 3.2. TC-05 - Valid username with empty password shows Required under Password

**File:** `tests/login/tc-05-empty-password.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly with no validation messages visible
  2. Type 'Admin' into the Username textbox and leave the Password textbox empty
    - expect: Username field contains 'Admin', Password field is empty
  3. Click the Login button
    - expect: A 'Required' validation message appears directly beneath the Password textbox
    - expect: No 'Required' message appears under the Username field
    - expect: No 'Invalid credentials' alert is shown
    - expect: The URL remains on the login page

#### 3.3. TC-06 - Both username and password empty shows Required under both fields

**File:** `tests/login/tc-06-both-empty.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly with no validation messages visible
  2. Do not type anything into either the Username or Password textbox
    - expect: Both fields remain empty
  3. Click the Login button
    - expect: A 'Required' validation message appears beneath the Username textbox
    - expect: A 'Required' validation message appears beneath the Password textbox
    - expect: Both validation messages are displayed simultaneously
    - expect: No 'Invalid credentials' alert is shown
    - expect: The URL remains on the login page

#### 3.4. TC-17 - Whitespace-only username shows Required validation

**File:** `tests/login/tc-17-whitespace-only-username.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type three space characters into the Username textbox
    - expect: The Username field appears filled but contains only whitespace
  3. Type 'admin123' into the Password textbox
    - expect: The Password field is populated
  4. Click the Login button
    - expect: Either a 'Required' validation message appears (if the app trims whitespace before validation), or an 'Invalid credentials' alert appears
    - expect: The user is NOT logged in
    - expect: The URL remains on the login page

#### 3.5. TC-18 - Validation messages clear when user starts typing in the field

**File:** `tests/login/tc-18-validation-clears-on-type.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Leave both Username and Password empty and click the Login button
    - expect: 'Required' validation messages appear beneath both fields
  3. Click into the Username textbox and begin typing 'Admin'
    - expect: The 'Required' message under the Username field disappears or is no longer visible as the user types
  4. Click into the Password textbox and begin typing 'admin123'
    - expect: The 'Required' message under the Password field disappears or is no longer visible as the user types

### 4. AC-04 - Enter Key Submits the Login Form

**Seed:** `tests/seed.spec.ts`

#### 4.1. TC-07 - Pressing Enter in Password field submits form and logs in (covered in AC-01 suite)

**File:** `tests/login/tc-07-enter-key-password-field.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type 'Admin' into the Username textbox
    - expect: The field is populated
  3. Click into the Password textbox and type 'admin123'
    - expect: The Password field is populated
  4. Press the Enter key while focus is on the Password textbox
    - expect: The form submits without requiring a click on the Login button
    - expect: The page navigates to /web/index.php/dashboard/index
    - expect: The Dashboard heading is visible

#### 4.2. TC-19 - Pressing Enter in Username field submits form and logs in

**File:** `tests/login/tc-19-enter-key-username-field.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type 'Admin' into the Username textbox
    - expect: The field is populated
  3. Tab to the Password textbox and type 'admin123'
    - expect: The Password field is populated
  4. Tab back to the Username textbox and press the Enter key while focus is on Username
    - expect: The form submits
    - expect: The page navigates to /web/index.php/dashboard/index
    - expect: The Dashboard heading is visible

#### 4.3. TC-20 - Pressing Enter with empty fields triggers Required validation (not a crash)

**File:** `tests/login/tc-20-enter-key-empty-fields.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Do not type anything into either field; press the Enter key while focus is on the Username textbox
    - expect: 'Required' validation messages appear beneath both empty fields
    - expect: The URL remains on the login page
    - expect: No crash or unhandled error occurs

### 5. AC-05 - Active Session Redirects to Dashboard on Login URL Visit

**Seed:** `tests/seed.spec.ts`

#### 5.1. TC-10 - Logged-in user navigating to login URL is redirected to Dashboard

**File:** `tests/login/tc-10-active-session-redirects.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login and log in with credentials Admin / admin123
    - expect: Login succeeds and the Dashboard page loads at /web/index.php/dashboard/index
  2. While the session is active, manually navigate the browser to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login in the same browser context
    - expect: The application does NOT display the login page
    - expect: The browser is immediately redirected to /web/index.php/dashboard/index
    - expect: The Dashboard heading and sidebar navigation are visible
    - expect: No login prompt is shown

#### 5.2. TC-21 - Browser back button after login does not return to login page

**File:** `tests/login/tc-21-back-button-after-login.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page is displayed
  2. Log in with credentials Admin / admin123
    - expect: The Dashboard page loads at /web/index.php/dashboard/index
  3. Click the browser Back button
    - expect: Either the browser stays on the Dashboard (or is immediately redirected back to Dashboard)
    - expect: The login form is not accessible to a logged-in user via the back button
    - expect: If the login page briefly appears, the session cookie causes an immediate redirect to Dashboard

### 6. AC-06 - Forgot Password Link Opens Reset Password Page

**Seed:** `tests/seed.spec.ts`

#### 6.1. TC-09 - Clicking Forgot your password? navigates to Reset Password page

**File:** `tests/login/tc-09-forgot-password-link.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login in a fresh unauthenticated browser context
    - expect: The login page loads with the 'Forgot your password?' paragraph visible
  2. Click the 'Forgot your password?' link
    - expect: The page navigates to /web/index.php/auth/requestPasswordResetCode
    - expect: A 'Reset Password' heading (level 6) is visible
    - expect: The instruction text 'Please enter your username to identify your account to reset your password' is visible
    - expect: A Username textbox is present
    - expect: A 'Cancel' button and a 'Reset Password' button are both visible
    - expect: No login form elements (Password field, Login button) are on this page

#### 6.2. TC-22 - Cancel button on Reset Password page returns user to login page when not authenticated

**File:** `tests/login/tc-22-reset-password-cancel.spec.ts`

**Steps:**
  1. Open a fresh unauthenticated browser context and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page is displayed
  2. Click 'Forgot your password?' to reach the Reset Password page
    - expect: The Reset Password page loads at /web/index.php/auth/requestPasswordResetCode
  3. Click the 'Cancel' button without entering a username
    - expect: The user is navigated back to the login page at /web/index.php/auth/login
    - expect: The login form is visible with Username and Password fields
    - expect: No error message is shown

#### 6.3. TC-23 - Reset Password page submits with empty username shows Required validation

**File:** `tests/login/tc-23-reset-password-empty-username.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode directly
    - expect: The Reset Password page loads correctly
  2. Leave the Username textbox empty and click the 'Reset Password' button
    - expect: A validation message appears indicating the Username field is required
    - expect: The page does not navigate away
    - expect: No email is sent
    - expect: No server error occurs

#### 6.4. TC-24 - Reset Password page with a valid username shows confirmation

**File:** `tests/login/tc-24-reset-password-valid-username.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode directly
    - expect: The Reset Password page loads correctly
  2. Type 'Admin' into the Username textbox
    - expect: The field is populated with 'Admin'
  3. Click the 'Reset Password' button
    - expect: A confirmation message is displayed (e.g., 'Reset Password link sent successfully' or similar)
    - expect: The page does not expose whether the account exists or not (prevents user enumeration)
    - expect: No server error occurs

#### 6.5. TC-25 - Reset Password page with non-existent username shows same confirmation (prevent user enumeration)

**File:** `tests/login/tc-25-reset-password-nonexistent-username.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode directly
    - expect: The Reset Password page loads correctly
  2. Type 'ThisUserDoesNotExist99999' into the Username textbox
    - expect: The field is populated
  3. Click the 'Reset Password' button
    - expect: The response message is identical to TC-24 (same confirmation, no distinction between existing and non-existing users)
    - expect: No error reveals whether the account exists
    - expect: No server error occurs

### 7. Edge Cases - UI Behavior and Accessibility

**Seed:** `tests/seed.spec.ts`

#### 7.1. TC-26 - Password field masks characters and has no visibility toggle

**File:** `tests/login/tc-26-password-masked.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Inspect the Password textbox element type attribute
    - expect: The input type is 'password', confirming characters are masked
  3. Verify there is no toggle icon (eye icon or 'Show'/'Hide' button) adjacent to the Password field
    - expect: No visibility toggle exists in the password field container
    - expect: The password remains masked at all times with no UI control to reveal it

#### 7.2. TC-27 - Tab key navigates between Username, Password, and Login button in correct order

**File:** `tests/login/tc-27-tab-key-navigation.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads and the Username field has initial focus
  2. Press the Tab key once
    - expect: Focus moves to the Password textbox
  3. Press the Tab key again
    - expect: Focus moves to the Login button
  4. Press the Tab key again
    - expect: Focus moves to the 'Forgot your password?' paragraph/link

#### 7.3. TC-28 - Pasting credentials via clipboard into Username and Password fields works

**File:** `tests/login/tc-28-clipboard-paste.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Use the browser's clipboard API or keyboard shortcut (Ctrl+V) to paste 'Admin' into the Username textbox
    - expect: The Username field contains 'Admin' from the paste operation
  3. Paste 'admin123' into the Password textbox
    - expect: The Password field is populated via paste
  4. Click the Login button
    - expect: Login succeeds
    - expect: The page navigates to /web/index.php/dashboard/index
    - expect: Paste is not blocked by the application

#### 7.4. TC-29 - Login page displays correct version number and copyright footer

**File:** `tests/login/tc-29-footer-content.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Inspect the footer area of the login card
    - expect: The footer shows 'OrangeHRM OS 5.8'
    - expect: The copyright paragraph contains '© 2005 - 2026' and an 'OrangeHRM, Inc' link
    - expect: Social media links (LinkedIn, Facebook, Twitter, YouTube) are visible in the footer

#### 7.5. TC-30 - Login page renders correctly on mobile viewport (responsive layout)

**File:** `tests/login/tc-30-mobile-viewport.spec.ts`

**Steps:**
  1. Set the browser viewport to 375x812 pixels (iPhone 14 equivalent) and navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The page loads without horizontal scrollbars
  2. Inspect the login form layout
    - expect: The company logo, Username field, Password field, Login button, and 'Forgot your password?' link are all visible within the viewport
    - expect: No UI elements overflow or are clipped
    - expect: The form is usable without zooming

#### 7.6. TC-31 - Page title and company branding image are correct on login page

**File:** `tests/login/tc-31-page-title-branding.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The page loads
  2. Check the browser tab title
    - expect: The page title is 'OrangeHRM'
  3. Verify the company branding image at the top of the login card
    - expect: An image with alt text 'company-branding' is visible
    - expect: The OrangeHRM logo image with alt text 'orangehrm-logo' is visible

#### 7.7. TC-32 - Error alert dismissed after correcting credentials and logging in successfully

**File:** `tests/login/tc-32-error-alert-clears-on-success.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
    - expect: The login page loads correctly
  2. Type 'Admin' in Username and 'invalid123' in Password, then click Login
    - expect: The 'Invalid credentials' alert appears on the page
  3. Clear the Password field and type 'admin123', then click Login
    - expect: The 'Invalid credentials' alert is no longer visible
    - expect: The page navigates to /web/index.php/dashboard/index
    - expect: Login completes successfully

#### 7.8. TC-33 - Network request to login endpoint uses POST method and HTTPS

**File:** `tests/login/tc-33-network-request-security.spec.ts`

**Steps:**
  1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login and open the browser's network monitor
    - expect: The login page loads correctly
  2. Type 'Admin' in Username, 'admin123' in Password, and click the Login button while monitoring network traffic
    - expect: The login request is sent via HTTP POST method
    - expect: The request is made over HTTPS (not HTTP)
    - expect: The password value is NOT visible in the URL query string
    - expect: Credentials are sent in the POST body, not as URL parameters
