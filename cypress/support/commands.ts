import { getPost, createPost } from "./api";

// Rejestracja funkcji API jako komendy Cypress (np. cy.getPost, cy.createPost).
Cypress.Commands.add("getPost", getPost);
Cypress.Commands.add("createPost", createPost);

// Nowa Custom Command: setAlias
// Umożliwia zapisanie dowolnej wartości pod aliasem Cypress z zachowaniem jej typu.
function setAliasCommand<T = unknown>(
  aliasName: string,
  value: T,
): Cypress.Chainable<T> {
  // cy.wrap(value).as(aliasName) zapisuje wartość. { log: false } ukrywa krok w logach Cypress.
  return cy
    .wrap(value, { log: false })
    .as(aliasName)
    .then(() => value);
}

Cypress.Commands.add("setAlias", setAliasCommand);
