import users from '../fixtures/users.json';
import postPayloads from '../fixtures/payloads/newPost.json';
import { PostResponse } from '../support/api'; 

describe('Posts API Check (jsonplaceholder.typicode.com)', () => {

    const validUserId = users.validUser.id;

    describe('Positive Scenarios: Creation and Retrieval', () => {

        it('should successfully create a post (status 201) and alias the ID', () => {
            cy.log(`Starting post creation test`);

            cy.createPost('validPost', validUserId).then((response) => {
                // 1. Walidacja statusu
                expect(response.status).to.eq(201);
                
                // Walidacja body (jest poprawnie typowana)
                expect(response.body).to.have.property('id').and.be.a('number');
                expect(response.body.userId).to.eq(validUserId);
                
                // Aliasowanie
                const newPostId = response.body.userId;
                cy.setAlias('newPostId', newPostId); 
                cy.setAlias('postData', response.body);
            });

            // 2. Odczyt aliasu ID
            cy.get<number>('@newPostId').then((postId) => {
                cy.log(`Post ID zapisane w aliasie: ${postId}`);

                // Wywołanie żądania GET i asercja statusu
                cy.getPost(postId).its('status').should('eq', 200);
            });
            
            // 3. Odczyt aliasu z całym obiektem PostResponse
            cy.get<PostResponse>('@postData').then((post) => {
                cy.log(`Tytuł posta zapisany w aliasie obiektu: ${post.title}`);
                expect(post.userId).to.eq(validUserId);
            });
        });

        it('should retrieve a post with valid ID (status 200)', () => {
            const existingPostId = 1;

            cy.getPost(existingPostId).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.id).to.eq(existingPostId);
                expect(response.body).to.have.property('title');
            });
        });
    });

    describe('Negative Scenarios: Errors', () => {

        it('should return 404 for a non-existent post ID', () => {
            const nonExistentId = 99999;
            cy.log(`Starting 404 test for ID: ${nonExistentId}`);
            
            cy.getPost(nonExistentId).then((response) => {
                expect(response.status).to.eq(404);
                expect(response.body).to.be.empty;
            });
        });

        it('should handle missing body fields in POST (API limitation check)', () => {
            cy.createPost('invalidPost').then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.title).to.eq(postPayloads.invalidPost.title);
            });
        });
    });
});