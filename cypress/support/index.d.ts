type ApiCommands = typeof import("./api");

// Dodatkowe deklaracje dla modułów JS
declare class PinUtils {
    static pinLength(mobimask: string): number;
    static generateHash(key: string, salt: string, mobimask: string, pin: string): string;
    static encodeHmac(key: string, data: string): string;
}

declare class SqlUtils {
    static generateGuid(): Cypress.Chainable<string>;
    static generateFakeCreatedToken(card128Id: string, walletId: string, ruleId: string, tur: string): Cypress.Chainable<any>;
    static generateFakeActiveToken(card128Id: string, walletId: string, ruleId: string): Cypress.Chainable<any>;
    static updateTokenStatusChangeLockExp(card128Id: string): Cypress.Chainable<any>;
}

declare module './utils/helper' {
    interface Helper {
        getFakeCard128ID(length?: number): string;
        getCurrentPlDateWithShortMonth(): string;
        getCurrentPlDate(): string;
        decodeJWTString(encodedJWTString: string): any; // Zależy od 'jwt-decode'
    }
    const helper: Helper;
    export = helper;
}
// Koniec dodatkowych deklaracji

declare namespace Cypress {
  // Rozszerzenie Chainable o nasze Custom Commands.
  interface Chainable {
    // Komendy API dziedziczą sygnatury z api.ts.
    getPost: ApiCommands["getPost"];
    createPost: ApiCommands["createPost"];

    /**
     * Sygnatura dla setAlias.
     * Używa kluczy K z interfejsu Aliases, wymuszając poprawne nazwy aliasów i ich typy.
     */
    setAlias<K extends keyof Aliases>(
      aliasName: K,
      value: Aliases[K],
    ): Chainable<Aliases[K]>;

    /**
     * Wykonuje zewnętrzny proces Java, aby pobrać token API,
     * a następnie zapisuje go pod aliasem @apiToken.
     */
    getAPIToken(): Chainable<string>;
  }

  // Interfejs Aliases definiuje globalny kontrakt dla wszystkich aliasów używanych w testach.
  interface Aliases {
    /** Używany do przechowywania ID nowo utworzonego posta. Typ: number. */
    newPostId: number;
    /** Używany do przechowywania pełnego obiektu posta. Typ: PostResponse. */
    postData: import("./api").PostResponse;
    /** Alias dla GUID generowanego przez SqlUtils. Typ: string. */
    guid: string; 
    /** Używany do przechowywania pobranego tokena API (np. JWT). Typ: string. */
    apiToken: string; 
  }
}