// cypress/support/utils/sql_utils.ts

/**
 * Interfejs odpowiedzi z bazy danych dla operacji SELECT w tasku Cypress.
 */
interface DBResponse {
    rows: Array<{ [key: string]: any }>;
    // Umożliwia dodanie innych metadanych, np. z mocka
    changes?: number; 
    [key: string]: any; 
}

/**
 * Klasa narzędziowa do interakcji z bazą danych poprzez cy.task('sqlQuery').
 */
export class SqlUtils {

    /**
     * Generuje unikalny identyfikator GUID i aliasuje go jako '@guid'.
     * @returns Cykl Cypress z wygenerowanym GUID.
     */
    static generateGuid(): Cypress.Chainable<string> {
        const SQL_GENERATE_GUID = "select TESTS_HELPER.generate_guid() as guid from dual";

        return cy.task<DBResponse>("sqlQuery", SQL_GENERATE_GUID, { log: false }).then((resolvedValue) => {
            expect(resolvedValue.rows).to.have.length(1); 
            
            const guid = resolvedValue.rows[0].GUID || resolvedValue.rows[0].guid;
            
            if (!guid) {
                 throw new Error("SqlUtils.generateGuid: Nie udało się odnaleźć wartości GUID.");
            }
            
            cy.log(`SQL: Generated GUID: ${guid}`);
            // Zwracamy Chainable dla aliasu i końcowej wartości
            return cy.wrap(guid as string, { log: false }).as("guid").then(() => guid as string);
        });
    }

    /**
     * Tworzy fałszywy token w bazie danych ze statusem CREATED.
     * Poprawione: Gwarantuje zwrot cyklu Cypress dla łańcuchowania.
     */
    static generateFakeCreatedToken(
        card128Id: string | number, 
        walletId: string | number, 
        ruleId: string | number, 
        tur: string
    ): Cypress.Chainable<unknown> {
        cy.log(`SQL: Inserting CREATED token for Card ID: ${card128Id}`);
        const SQL_INSERT_FAKE_TOKEN = `
            DECLARE
                v_dig_id number (18);
                v_dig_card_id number (18);
            BEGIN
                select dig_seq.nextval into v_dig_id from dual;
                select crd_id into v_dig_card_id from cards where crd_128_id = '${card128Id}';
                TESTS_HELPER.insert_digitization_req(
                    p_dig_id => v_dig_id,
                    p_dig_card_id => v_dig_card_id,
                    p_dig_wallet_id => '${walletId}',
                    p_dig_rule_id => '${ruleId}',
                    p_dig_create_date => sysdate-0.1
                );
                TESTS_HELPER.insert_token(
                    p_tok_id => v_dig_id,
                    p_tok_status => 'CREATED',
                    p_tok_unique_reference => '${tur}',
                    p_tok_create_date => sysdate-0.1
                );
            END;
        `;
        return cy.task("sqlQuery", SQL_INSERT_FAKE_TOKEN);
    }

    /**
     * Tworzy fałszywy token w bazie danych ze statusem ACTIVE.
     * Poprawione: Gwarantuje zwrot cyklu Cypress dla łańcuchowania.
     */
    static generateFakeActiveToken(
        card128Id: string | number, 
        walletId: string | number, 
        ruleId: string | number
    ): Cypress.Chainable<unknown> {
        cy.log(`SQL: Inserting ACTIVE token for Card ID: ${card128Id}`);
        const SQL_INSERT_FAKE_TOKEN = `
            DECLARE
                v_dig_id number (18);
                v_dig_card_id number (18);
            BEGIN
                select dig_seq.nextval into v_dig_id from dual;
                select crd_id into v_dig_card_id from cards where crd_128_id = '${card128Id}';
                TESTS_HELPER.insert_digitization_req(
                    p_dig_id => v_dig_id,
                    p_dig_card_id => v_dig_card_id,
                    p_dig_wallet_id => '${walletId}',
                    p_dig_rule_id => '${ruleId}'
                );
                TESTS_HELPER.insert_token(
                    p_tok_id => v_dig_id,
                    p_tok_status => 'ACTIVE',
                    p_tok_unique_reference => TESTS_HELPER.generate_guid
                );
            END;
        `;
        return cy.task("sqlQuery", SQL_INSERT_FAKE_TOKEN);
    }

    /**
     * Usuwa blokadę zmiany statusu tokenu.
     * Poprawione: Gwarantuje zwrot cyklu Cypress dla łańcuchowania.
     */
    static updateTokenStatusChangeLockExp(card128Id: string | number): Cypress.Chainable<unknown> {
        cy.log(`SQL: Removing lock expiration for Card ID: ${card128Id}`);
        const SQL_UPDATE_TOK_STATUS_CHANGE_LOCK_EXP = `
            DECLARE
                v_card_id number (18);
            BEGIN
                select crd_id into v_card_id from cards where crd_128_id = '${card128Id}';
                update tokens
                set TOK_STATUS_CHANGE_LOCK_EXP = null
                where tok_crd_id = v_card_id;
            END;
        `;
        return cy.task("sqlQuery", SQL_UPDATE_TOK_STATUS_CHANGE_LOCK_EXP);
    }
}