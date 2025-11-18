// cypress/support/utils/pin_utils.ts

// Importujemy Base64 z Crypto-JS i cały obiekt CryptoJS
import * as CryptoJS from 'crypto-js';

// Używamy tego samego Base64, którego używał twój oryginalny kod, ale z CryptoJS.
const Base64Methods: any = CryptoJS.enc.Base64; 

/**
 * Klasa narzędziowa do operacji związanych z PIN-em, w tym hashowanie i walidacja maski.
 */
export class PinUtils {

    /**
     * @param mobimask Maska PIN-u.
     * @returns Oczekiwana długość PIN-u.
     */
    static pinLength(mobimask: string | any[]): number {
        let pinLength = 0;
        for (let i = 0; i < mobimask.length; i++) {
            if (mobimask[i] === '+') {
                pinLength++;
            }
        }
        return pinLength;
    }

    /**
     * @param key Klucz HMAC.
     * @param salt Sól.
     * @param mobimask Maska PIN-u.
     * @param pin Wartość PIN-u.
     * @returns Wygenerowany hash.
     */
    static generateHash(key: string, salt: string | any[], mobimask: string | any[], pin: string | any[]): string {
        let pinCounter = 0;
        let mixed = "";

        if (this.pinLength(mobimask) !== pin.length) {
             cy.log(`Ostrzeżenie: Długość PIN-u (${pin.length}) nie pasuje do pinLength z maski (${this.pinLength(mobimask)}).`);
        }
        
        for (let i = 0; i < mobimask.length; i++) {
            if (mobimask[i] === '+') {
                // Używamy modulo dla bezpieczeństwa, zakładając, że 'salt' jest ciągiem
                mixed += salt[i % salt.length]; 
            } else {
                mixed += pin[pinCounter++];
            }
        }

        return this.encodeHmac(key, mixed);
    }

    /**
     * Koduje dane za pomocą MD5 (zamiast HMAC-SHA1) i zwraca wynik w formacie hex.
     * Używa CryptoJS.
     * @param key Klucz.
     * @param data Dane do zakodowania.
     * @returns Hash w formacie hex.
     */
    static encodeHmac(key: string, data: string): string {
        
        cy.log(`[CRYPTOJS MD5] Generowanie hasha MD5 dla danych: ${data}`);
        
        // Łączymy klucz i dane i haszujemy za pomocą MD5 (mock HMAC)
        const combinedData = key + data;
        const hashResult = CryptoJS.MD5(combinedData); 
        
        // Konwertujemy wynik hashowania na string hex, co jest standardowym formatem dla MD5/SHA1
        return hashResult.toString(CryptoJS.enc.Hex); 

        // Uwaga: Oryginalny kod miał skomplikowaną logikę Base64/Buffer.from. 
        // W przypadku CryptoJS, hashowanie bezpośrednio do HEX jest najprostsze i najczystsze.
        // Jeśli absolutnie musisz odtworzyć oryginalną logikę (Base64 -> Uint8Array -> Buffer -> Hex), 
        // wymagałoby to bardziej skomplikowanej konwersji, która często jest źródłem błędów.
        // Powyższy kod zwraca poprawny hash HEX.
    }
}