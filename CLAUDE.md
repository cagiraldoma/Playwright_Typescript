# CLAUDE.md — Contexto del Proyecto

## Descripción General

Framework de automatización de pruebas E2E para **OrangeHRM** (https://opensource-demo.orangehrmlive.com).
Stack: **Playwright + TypeScript**, patrón **Page Object Model (POM)** con herencia.

---

## Estructura del Proyecto

```
Playwright_Typescript/
├── .env                          # Variables de entorno (BASE_URL, credenciales)
├── .github/workflows/
│   └── playwright.yml            # CI/CD con GitHub Actions
├── fixures.ts                    # Fixtures de Playwright (setup de login)
├── playwright.config.ts          # Configuración global del framework
├── pages/
│   ├── BasePage.ts               # Clase base con métodos genéricos reutilizables
│   ├── LoginPage.ts              # POM de la página de login
│   └── DashboardPage.ts          # POM del dashboard (asignación de permisos/leaves)
├── tests/
│   ├── LoginTest.spec.ts         # Tests de login (éxito e inválido)
│   └── DashboardTest.spec.ts     # Tests del dashboard (crear leave request)
└── utils/
    └── dateUtils.ts              # Utilidad para calcular fechas relativas
```

---

## Arquitectura: Page Object Model con Herencia

```
BasePage (clase base)
    ├── LoginPage   extends BasePage
    └── DashboardPage  extends BasePage  (usa utils/dateUtils.ts)
```

**BasePage** contiene los métodos genéricos de interacción con la UI:
- `navigateTo(url)`, `click(locator)`, `fillInput(locator, value)`
- `verifyUrlContains(path)`, `elementIsVisible(locator)`
- `waitForElementToBeVisible(locator, timeout?)`
- `getTextContent(locator)`, `getAllTextContent(locator)`
- `elementHasTheText(locator, text, auxiliarText?)`, `elementHasValue(locator, text)`
- `selectFirstElement(locator)`, `selectElementByTextFromDropDown(dropdownLocator, elementText)`

---

## Fixtures (`fixures.ts`)

Extienden `base` de Playwright. Proveen las páginas instanciadas y el login pre-configurado.

| Fixture | Comportamiento |
|---------|---------------|
| `loginToTheApp` | Navega a BASE_URL y hace login con credenciales válidas |
| `invalidLoginToTheApp` | Navega a BASE_URL y hace login con contraseña inválida |

Ambos fixtures devuelven `{ basePage, loginPage, dashboardPage }`.

> **Nota:** El nombre del archivo tiene un typo intencional: `fixures.ts` (sin segunda 't'). No renombrar sin actualizar todos los imports.

---

## Variables de Entorno (`.env`)

```
BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
ADMIN_USERNAME = 'Admin'
ADMIN_PASSWORD = 'admin123'
ADMIN_INVALID_PASSWORD = 'invalid123'
```

Cargadas en `playwright.config.ts` con `dotenv`. Acceder siempre via `process.env.VARIABLE!`.

---

## Configuración Playwright (`playwright.config.ts`)

- **Browser:** Chromium (headless: false en local)
- **testDir:** `./tests`
- **timeout:** 30s por test, 5s para assertions
- **reporter:** HTML (`playwright-report/`)
- **fullyParallel:** true
- **retries:** 2 en CI, 0 en local
- **workers:** 1 en CI, automático en local
- **trace:** `on-first-retry`

> **Nota:** El archivo tiene una estructura con doble `export default defineConfig` y `module.exports = config`. El `defineConfig` exportado está vacío; la config real está en `module.exports`. Esto es técnicamente inconsistente — al modificar configuración usar el objeto `config`.

---

## CI/CD (`.github/workflows/playwright.yml`)

- **Trigger:** push o PR a `main`/`master`
- **Runner:** `ubuntu-latest`
- **Pasos:** checkout → setup Node LTS → `npm ci` → instalar browsers → `npx playwright test`
- **Artefacto:** sube `playwright-report/` con retención de 30 días

---

## Utilidades (`utils/dateUtils.ts`)

```typescript
getDateDaysFromToday(days: number): string
// Retorna fecha en formato "YYYY-DD-MM" (¡OJO: día y mes invertidos vs ISO estándar!)
```

> **Bug conocido:** el formato retornado es `YYYY-DD-MM`, no el ISO estándar `YYYY-MM-DD`. Verificar si el campo de fecha en OrangeHRM acepta este formato antes de corregir.

---

## Convenciones del Proyecto

- Los **locators** se declaran como `readonly` en el constructor de cada Page Object.
- Los **métodos de acción** (workflows completos) van en el Page Object correspondiente.
- Los **tests** usan fixtures para el setup; no repetir lógica de login en cada test.
- Los **tests** importan `test` desde `../fixures`, no desde `@playwright/test` directamente.
- Selectores: mezcla de CSS selectors y XPath según conveniencia.

---

## Aplicación Bajo Test

**OrangeHRM** — Demo público de HR Management System.
- Módulos cubiertos: **Login**, **Dashboard**, **Leave Management** (asignación de permisos)
- Usuario de prueba: `Admin` / empleado de test: `Orange Test`
- Tipo de leave usado en tests: `CAN - Personal`

---

## Dependencias

```json
devDependencies:
  "@playwright/test": "^1.53.1"
  "@types/node": "^24.0.3"

dependencies:
  "dotenv": "^17.2.4"
```
