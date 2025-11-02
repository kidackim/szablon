type ApiCommands = typeof import("./api");

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
  }

  // Interfejs Aliases definiuje globalny kontrakt dla wszystkich aliasów używanych w testach.
  interface Aliases {
    /** Używany do przechowywania ID nowo utworzonego posta. Typ: number. */
    newPostId: number;
    /** Używany do przechowywania pełnego obiektu posta. Typ: PostResponse. */
    postData: import("./api").PostResponse;
  }
}
