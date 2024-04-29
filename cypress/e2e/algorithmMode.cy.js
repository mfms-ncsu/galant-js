/**
 * Tests the algorithm mode
 * @author Julian Madrigal
 */
describe('Test Graph Edit Mode', () => {
    it('New Graph Saved', () => {
        cy.visit('http://localhost:3000');
        cy.get('#cytoscape-instance').rightclick();
        const newNode = cy.get('#edit-context-menu').contains('New Node');
        newNode.click();
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
