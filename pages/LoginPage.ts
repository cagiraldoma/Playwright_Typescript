import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordButton: Locator;
  readonly orangePageLink: Locator;
  readonly invalidCredentialsMsg: Locator;

  constructor(page: Page) {
    super(page);
    this.userNameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.forgotPasswordButton = page.locator(".orangehrm-login-forgot>p");
    this.orangePageLink = page.locator(
      '//div/p/a[contains(text(),"OrangeHRM, Inc")]'
    );
    this.invalidCredentialsMsg = page.locator(
      'p[class="oxd-text oxd-text--p oxd-alert-content-text"]'
    );
    
  }

  async login(username: string, password: string) {
    await this.fillInput(this.userNameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}
