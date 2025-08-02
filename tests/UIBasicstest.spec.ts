import { expect, test } from '@playwright/test';

test ('Browser Context Playwright Test', async ({browser})=> {
    // ENFOQUE 1: Creación manual del contexto del navegador
    // Ventajas:
    // - Control total sobre el contexto (cookies, localStorage, sessionStorage)
    // - Puedes crear múltiples contextos con diferentes configuraciones
    // - Útil para pruebas que requieren diferentes estados de autenticación
    // - Permite configurar viewport, user agent, geolocation, etc.
    // Desventajas:
    // - Más código para escribir
    // - Necesitas manejar manualmente la limpieza del contexto
    
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/')
    console.log(await page.title())
    await expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy')
    await page.locator('#username').fill('rahulshetty')
    await page.locator('#password').fill('learning')
    await page.locator('#terms').click()
    await page.locator('#signInBtn').click()
    console.log(await page.locator('[style*="block"]').textContent())
    await expect(page.locator('[style*="block"]')).toContainText('Incorrect username/password.');

})

test ('First Test', async ({page})=> {
    // ENFOQUE 2: Uso del fixture 'page' directamente
    // Ventajas:
    // - Código más limpio y conciso
    // - Playwright maneja automáticamente la creación y limpieza del contexto
    // - Cada test obtiene un contexto limpio automáticamente
    // - Menos propenso a errores de memoria
    // Desventajas:
    // - Menos control sobre la configuración del contexto
    // - No puedes reutilizar el mismo contexto entre tests
    
    await page.goto('https://google.com')
    console.log(await page.title())
    await expect(page).toHaveTitle('Google')
})