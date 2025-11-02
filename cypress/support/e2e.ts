import "./commands";
import "cypress-plugin-api";

Cypress.on('uncaught:exception', (err, runnable) => {
  // Zwrócenie false sprawia, że Cypress nie przerywa testu.
  // Możesz tutaj również użyć cy.log(err.message), aby zobaczyć błąd w konsoli.
  return false;
});