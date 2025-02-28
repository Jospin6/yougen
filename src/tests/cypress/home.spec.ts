import { } from "cypress"

// cypress/integration/home.spec.ts
describe('Home Page', () => {
    it('should display the homepage correctly', () => {
        cy.visit('http://localhost:3000'); // Assure-toi que ton app Next.js est en cours d'exécution
        cy.contains('Welcome to Next.js!'); // Vérifie la présence du texte
    });
});
