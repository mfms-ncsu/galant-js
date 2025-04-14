/**
 * Tests the algorithm mode
 * @author Julian Madrigal
 * @author Jacob Friend
 */
describe('Test Graph Edit Mode', () => {
    it.only('New Graph Saved', () => {
        cy.visit('http://localhost:3000');
        cy.get('[data-cy="cytoscape-instance"]').should('be.visible');
        cy.get('[data-id="layer0-selectbox"]').rightclick();
        cy.get('[data-cy="edit-context-menu"] > :nth-child(1)').click();
        const saveChanges = cy.get('#edit-overlay').contains('Save Changes');
        saveChanges.click();
    });


    it('Test Graph Saved With No Existing Tab', () => {
        cy.intercept('GET', '/worker.js', (req) => {
            const url = new URL(req.url);
            url.pathname = url.pathname.replace('worker.js', 'testing/mockWorkerGraphAlgorithm.js');
            req.url = url.href;
        }).as('modifiedRequest');

        cy.visit('http://localhost:3000');
        cy.get("#algorithm-controls").should('be.visible');
        cy.get("#algorithm-name").should('have.text', 'Mock Algorithm');
        cy.get("#terminate-algorithm").click();
        cy.get("#confirmation-prompt-confirm").click();

    })
});
