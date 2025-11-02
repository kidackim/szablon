// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    specPattern: 'cypress/e2e/**/*.ts',
    supportFile: 'cypress/support/e2e.ts', 

    setupNodeEvents(on, config) {
    }
  },
  env: {
    API_TOKEN: 'FAKE_API_KEY_dsa98das98d',
  },
  
  reporter: 'mocha-junit-reporter',
  reporterOptions: {
    // Wskazuje na katalog wyjściowy dla plików XML
    mochaFile: 'cypress/results/junit/[hash].xml', 
    // Opcja do konsoli jest przydatna w diagnostyce CI
    toConsole: true,
  },
});