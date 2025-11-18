// cypress/support/utils/helper.ts

// Wymuszenie użycia 'require' dla stabilności modułów (CommonJS) w Cypress:
const RandExp = require('randexp');
const moment = require('moment');

// Używamy nazwanego eksportu, stabilnej metody w nowoczesnym TS/Cypress:
import { jwtDecode } from 'jwt-decode'; 

// Ustawienie polskiej lokalizacji dla moment
moment.locale('pl');

/**
 * Zestaw funkcji pomocniczych do generowania danych, formatowania dat i dekodowania JWT.
 */
export const helper = {
    /**
     * Generuje fałszywy identyfikator karty w formacie szesnastkowym (0-9A-F).
     * @param length Ilość znaków szesnastkowych do wygenerowania. Domyślnie 32 znaki.
     * @returns Wygenerowany ciąg szesnastkowy.
     */
    getFakeCard128ID(length: number = 32): string {
        return new RandExp(`[0-9A-F]{${length}}`).gen().toUpperCase();
    },

    /**
     * Zwraca aktualną datę w formacie z krótkim miesiącem w języku polskim.
     * Format: D MMM YYYY.
     * @returns Sformatowana data.
     */
    getCurrentPlDateWithShortMonth(): string {
        return moment().locale('pl').format("D MMM YYYY");
    },

    /**
     * Zwraca aktualną datę w formacie RRRR-MM-DD.
     * @returns Sformatowana data.
     */
    getCurrentPlDate(): string {
        return moment().locale('pl').format("YYYY-MM-DD");
    },

    /**
     * Dekoduje token JWT (z payloadem).
     * UWAGA: Funkcja domyślnie zwraca PAYLOAD.
     * @param encodedJWTString Zakodowany token JWT.
     * @returns Odszyfrowany token.
     */
    decodeJWTString(encodedJWTString: string): any {
        // KLUCZOWA POPRAWKA: Usunięcie { header: true } w celu uzyskania PAYLOADU.
        // Jeśli chcemy uzyskać nagłówek, musimy użyć: jwtDecode(encodedJWTString, { header: true })
        return jwtDecode(encodedJWTString);
    },
};

export default helper;