import { test } from '../../fixtures/patternFixtures';
import { LoginPageFactory } from '../../pages/patterns/factory-method/PageFactory';
import { LoginPage } from '../../pages/LoginPage';

const VALID_USER = process.env.ADMIN_USERNAME!;
const VALID_PASS = process.env.ADMIN_PASSWORD!;
const INVALID_PASS = process.env.ADMIN_INVALID_PASSWORD!;

test.describe('Factory Method Pattern — Login Scenarios', () => {
  test('Login Success: LoginPageFactory crea LoginPage y autentica correctamente', async ({ navigateToApp }) => {
    const { page } = navigateToApp;

    const factory = new LoginPageFactory();
    const loginPage = factory.createPage(page) as LoginPage;

    await loginPage.login(VALID_USER, VALID_PASS);

    await loginPage.verifyUrlContains('/dashboard');
  });

  test('Login Fail: LoginPageFactory crea LoginPage y muestra error con credenciales inválidas', async ({ navigateToApp }) => {
    const { page } = navigateToApp;

    const factory = new LoginPageFactory();
    const loginPage = factory.createPage(page) as LoginPage;

    await loginPage.login(VALID_USER, INVALID_PASS);

    await loginPage.elementIsVisible(loginPage.invalidCredentialsMsg);
  });
});
