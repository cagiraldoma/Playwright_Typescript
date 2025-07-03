# Playwright TypeScript - Proyecto de Testing E2E

Este proyecto utiliza **Playwright** con **TypeScript** para realizar pruebas de testing end-to-end (E2E) automatizadas.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Ejecutar Tests](#ejecutar-tests)
- [Comandos Útiles](#comandos-útiles)
- [Configuración del Proyecto](#configuración-del-proyecto)
- [Ejemplos de Tests](#ejemplos-de-tests)
- [Reportes](#reportes)
- [Troubleshooting](#troubleshooting)

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **Git**

### Verificar instalaciones:

```bash
node --version
npm --version
git --version
```

## 🚀 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone
   cd Playwright_Typescript
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Instalar navegadores de Playwright:**
   ```bash
   npx playwright install
   ```

## ⚙️ Configuración

El proyecto ya viene configurado con `playwright.config.ts` que incluye:

- **Timeout global:** 40 segundos
- **Timeout para aserciones:** 5 segundos
- **Navegador por defecto:** Chromium
- **Modo headless:** Desactivado (los navegadores se abren visiblemente)
- **Reportes:** HTML
- **Tests paralelos:** Activados

### Configuración actual:

```typescript
{
  testDir: './tests',
  timeout: 40 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  fullyParallel: true,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    browserName: 'chromium',
    headless: false,
  }
}
```

## 📁 Estructura del Proyecto

```
Playwright_Typescript/
├── tests/                          # Tests principales
│   └── UIBasicstest.spec.ts       # Tests básicos de UI
├── tests-examples/                 # Ejemplos de tests
│   └── demo-todo-app.spec.ts      # Demo completo de todo app
├── playwright-report/              # Reportes HTML generados
├── test-results/                   # Resultados de tests
├── playwright.config.ts            # Configuración de Playwright
├── package.json                    # Dependencias del proyecto
└── README.md                       # Este archivo
```

## 🧪 Ejecutar Tests

### Comandos básicos:

```bash
# Ejecutar todos los tests
npx playwright test

# Ejecutar tests en modo UI (interfaz gráfica)
npx playwright test --ui

# Ejecutar tests específicos
npx playwright test tests/UIBasicstest.spec.ts

# Ejecutar tests con navegador visible
npx playwright test --headed

# Ejecutar tests en modo debug
npx playwright test --debug
```

### Ejecutar tests específicos:

```bash
# Por archivo
npx playwright test UIBasicstest.spec.ts

# Por nombre de test
npx playwright test -g "First Test"

# Por proyecto (navegador)
npx playwright test --project=chromium
```

## 🔧 Comandos Útiles

### Desarrollo y debugging:

```bash
# Abrir Playwright Inspector
npx playwright test --debug

# Generar código de test desde el inspector
npx playwright codegen https://example.com

# Instalar navegadores específicos
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit

# Actualizar Playwright
npx playwright install
```

### Reportes y análisis:

```bash
# Ver reporte HTML
npx playwright show-report

# Ver traces (si están habilitados)
npx playwright show-trace trace.zip

# Ejecutar tests y generar reporte
npx playwright test --reporter=html
```

## ⚙️ Configuración del Proyecto

### Modificar timeouts:

En `playwright.config.ts`:

```typescript
const config = ({
  timeout: 40 * 1000,        // Timeout global
  expect: {
    timeout: 5 * 1000,       // Timeout para aserciones
  },
  // ...
});
```

### Cambiar navegador:

```typescript
use: {
  browserName: 'firefox',    // o 'webkit', 'chromium'
  headless: true,            // true para modo headless
},
```

### Agregar más navegadores:

Descomenta en `playwright.config.ts`:

```typescript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
],
```

## 📝 Ejemplos de Tests

### Test básico con fixture `page`:

```typescript
import { test, expect } from '@playwright/test';

test('Mi primer test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example Domain');
});
```

### Test con contexto manual:

```typescript
test('Test con contexto manual', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://example.com');
  // ... tus tests
  
  await context.close();
});
```

### Test con before/after hooks:

```typescript
test.describe('Suite de tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com');
  });

  test('Test 1', async ({ page }) => {
    // Tu test aquí
  });

  test('Test 2', async ({ page }) => {
    // Otro test
  });
});
```

## 📊 Reportes

### Reporte HTML:

Después de ejecutar los tests, puedes ver el reporte HTML:

```bash
npx playwright show-report
```

El reporte incluye:
- ✅ Tests exitosos
- ❌ Tests fallidos
- 📸 Screenshots automáticos
- 🎬 Videos (si están habilitados)
- 📝 Traces (si están habilitados)

### Configurar reportes adicionales:

En `playwright.config.ts`:

```typescript
reporter: [
  ['html'],
  ['json', { outputFile: 'test-results/results.json' }],
  ['junit', { outputFile: 'test-results/results.xml' }]
],
```

## 🔍 Troubleshooting

### Problemas comunes:

1. **Error: "browser not found"**
   ```bash
   npx playwright install
   ```

2. **Tests muy lentos**
   - Revisa los timeouts en `playwright.config.ts`
   - Considera usar `headless: true`

3. **Tests fallan intermitentemente**
   - Aumenta el timeout de aserciones
   - Usa `waitFor` en lugar de `expect` inmediato

4. **Problemas con selectores**
   - Usa `page.locator()` con selectores más específicos
   - Considera usar `data-testid` en tu aplicación

### Debugging:

```bash
# Modo debug con pausa
npx playwright test --debug

# Ver logs detallados
DEBUG=pw:api npx playwright test

# Generar trace para análisis
npx playwright test --trace on
```

## 📚 Recursos Adicionales

- [Documentación oficial de Playwright](https://playwright.dev/)
- [Guía de TypeScript con Playwright](https://playwright.dev/docs/test-typescript)
- [Selectores recomendados](https://playwright.dev/docs/locators)
- [Mejores prácticas](https://playwright.dev/docs/best-practices)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

---

¡Listo para comenzar a escribir tests! 🚀

