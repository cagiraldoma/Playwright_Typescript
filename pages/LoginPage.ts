import { Page, Locator } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly userNameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly forgotPasswordButton: Locator;
    readonly orangePageLink: Locator

    constructor(page: Page) {
        this.userNameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('button[type="submit"]');
        this.forgotPasswordButton = page.locator(".orangehrm-login-forgot>p");
        this.orangePageLink = page.locator('//div/p/a[contains(text(),"OrangeHRM, Inc")]')
    }
    async validLogin() {
        await this.userNameInput.click()
        await this.passwordInput.click()
    }

}
