import PostPayloads from '../fixtures/payloads/newPost.json';

/**
 * Definicja interfejsu dla ciała odpowiedzi POST/GET dla pojedynczego Posta.
 */
export interface PostResponse {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Definicja oczekiwanego payloadu do wysłania.
interface NewPostPayload {
  userId: number;
  title: string;
  body?: string; 
}

// Definiujemy oczekiwany typ odpowiedzi na poziomie funkcji, używając globalnego typu
type PostResponseChainable = Cypress.Chainable<Cypress.Response<PostResponse>>;

/**
 * Czysta funkcja TypeScript zawierająca logikę pobierania posta.
 */
export function getPost(postId: number): PostResponseChainable {
  return cy.api({ 
    method: 'GET',
    url: `/posts/${postId}`,
    failOnStatusCode: false,
  });
}

/**
 * Czysta funkcja TypeScript zawierająca logikę tworzenia posta.
 */
export function createPost(titleKey: 'validPost' | 'invalidPost', customUserId?: number): PostResponseChainable {
  const payload: NewPostPayload = { ...PostPayloads[titleKey] } as NewPostPayload;
  
  if (customUserId !== undefined) {
    payload.userId = customUserId;
  }
  
const API_TOKEN = Cypress.env('API_TOKEN') as string;

  return cy.api({ 
    method: 'POST',
    url: '/posts',
    body: payload,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`, 
      'Content-type': 'application/json; charset=UTF-8',
    },
    failOnStatusCode: false,
  });
}