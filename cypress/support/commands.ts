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

// --- Nowa komenda: getAPIToken ---
Cypress.Commands.add("getAPIToken", () => {
    // Komenda wykonuje proces zewnętrzny Java do pobrania tokena
    return cy.exec("java -jar token-generator/token-generator-0.0.7.jar -f token-generator/generator.properties")
        .then((result) => {
            if (result.code !== 0) {
                console.log("Error while fetching keycloak token: " + result.stderr);
                // Rzucenie błędu w przypadku niepowodzenia
                throw new Error("Failed to fetch API token: " + result.stderr);
            }
            
            // Parsowanie tokena z wyjścia stdout
            let outputLines = result.stdout.split('\n');
            // Oczekiwany format w stdout to "key=value"
            let token = outputLines[0].split('=')[1].trim(); 
            
            // Zapisanie tokena jako aliasu Cypress
            cy.wrap(token).as("apiToken");
            cy.log(`API Token fetched successfully and aliased as @apiToken.`);
            return token; // Zwraca token, jeśli chcemy go użyć w następnym .then()
        });
});