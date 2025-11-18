// cypress/e2e/new-helpers.spec.ts

import { SqlUtils } from '../support/utils/sql_utils';
import { PinUtils } from '../support/utils/pin_utils';
import helper from '../support/utils/helper'; 

// Mock danych testowych
const MOCK_CARD_ID = '0123456789ABCDEF';
const MOCK_WALLET_ID = 1000;
const MOCK_RULE_ID = 'RENA-A';
const MOCK_TUR = 'UNIQUE_TUR_456';
const PIN_KEY = 'super_secret_key';
const PIN_SALT = '1234567890abcdef';
const PIN_MASK = 'NNNN++++++'; 
const USER_PIN = '7890';

describe('Demo: Użycie nowych Helperów i Utility (TypeScript)', () => {

    // Poprawiony blok beforeEach: użycie cy.wrap() gwarantuje, że task jest Chainable.
    beforeEach(() => {
        // Używamy cy.stub() na cy.task, aby kontrolować jego zachowanie
        cy.stub(cy, 'task').callsFake((taskName, sqlQuery) => {
            if (taskName === 'sqlQuery') {
                cy.log(`Mock: Executing SQL task: ${sqlQuery.substring(0, 50)}...`);
                
                if (sqlQuery.includes('TESTS_HELPER.generate_guid()')) {
                    // Zwraca Cy.Chainable z wynikiem dla SELECT
                    return cy.wrap({ rows: [{ GUID: 'MOCK-GUID-A7A7-48CF-910E' }] });
                }
                
                // Zwraca Cy.Chainable z wynikiem dla INSERT/UPDATE. 
                // "changes: 1" umożliwia asercję .should('have.property', 'changes').
                return cy.wrap({ rows: [], changes: 1 });
            }
            // Zwracamy Cy.Chainable dla nieznanych tasków
            return cy.wrap(null);
        }) as any;
    });

    // --- 1. Demonstracja helper.ts (General Helpers) ---
    it('1. Powinien poprawnie użyć general helper functions', () => {
        cy.log('*** Testowanie General Helper Functions ***');
        
        const fakeCardId = helper.getFakeCard128ID(32);
        expect(fakeCardId).to.match(/^[0-9A-F]{32}$/);
        
        const formattedDate = helper.getCurrentPlDateWithShortMonth();
        expect(formattedDate).to.match(/\d{1,2} \w{3} \d{4}/); 
        
        const mockJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ1NiwibmFtZSI6IkphbiIsImlhdCI6MTY3ODAwMDAwMH0.s_q5L3F8vK_g9rJ2yY0Q6F1g0Y4rJ0xV7A2L2X8L0F0';
        const decodedToken = helper.decodeJWTString(mockJwt);
        expect(decodedToken.userId).to.eq(456); 
    });

    // --- 2. Demonstracja SqlUtils (DB operations) ---
    it('2. Powinien użyć SqlUtils do operacji na bazie danych i poprawnie użyć .should()', () => {
        cy.log('*** Testowanie SQL Utilities ***');

        // A. Generowanie GUID i aliasowanie
        SqlUtils.generateGuid().then((guid) => {
            expect(guid).to.be.a('string').and.include('MOCK-GUID');
        });

        // C. Tworzenie fałszywego tokenu (CREATED) - Działa dzięki cy.wrap() w mocku
        SqlUtils.generateFakeCreatedToken(MOCK_CARD_ID, MOCK_WALLET_ID, MOCK_RULE_ID, MOCK_TUR)
          .should('have.property', 'changes').and('be.gt', 0);

        // D. Usuwanie blokady statusu
        SqlUtils.updateTokenStatusChangeLockExp(MOCK_CARD_ID)
          .should('have.property', 'changes').and('be.gt', 0);
    });

    // --- 3. Demonstracja PinUtils (PIN hashing) ---
    it('3. Powinien użyć PinUtils do operacji na PIN-ach', () => {
        cy.log('*** Testowanie PIN Utilities ***');

        const length = PinUtils.pinLength(PIN_MASK); 
        expect(length).to.eq(6); 

        const pinHash = PinUtils.generateHash(PIN_KEY, PIN_SALT, PIN_MASK, USER_PIN);

        // Weryfikacja formatu hasha (standardowa długość dla MD5 to 32 znaki HEX)
        expect(pinHash).to.be.a('string').and.have.length(32); 
        cy.log(`Generated PIN Hash: ${pinHash}`);
    });
});