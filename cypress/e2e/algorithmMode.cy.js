/**
 * Tests the algorithm mode
 * @author Julian Madrigal
 * @author Jacob Friend
 */
describe.skip('Tests Algorithm Execution Mode', () => {

    /** 
     * Currently unable to load a graph and algorithm into Galant
     * in a Cypress test. Cypress does not support testing across
     * multiple windows, which makes it difficult to interact with
     * the algorithm and graph editors. Find a work around or consider
     * a different testing framework.
     * 
     * Skipping all tests in this file for now.
    */
    
    it('Test Graph Saved With No Existing Tab', () => {
        cy.intercept('GET', '/worker.js', (req) => {
            const url = new URL(req.url);
            url.pathname = url.pathname.replace('worker.js', 'testing/mockWorker.js');
            req.url = url.href;
        }).as('modifiedRequest');

        cy.visit('http://localhost:3000/grapheditor');

        cy.get('.tab').contains('New Graph1');
        cy.contains('n a 0 0 label:From_Testing');
        cy.contains('n a 0 0 label:Updated_From_Testing');
    });

    it('Load a standard graph and execute Breadth First Search', () => {      
        // Load a standard graph

        // Load BFS algorithm

        // Step through the algorithm
    });

    it('Load a layered graph and execute Bary Center Algorithm', () => {
        // Load a layered graph
        
        cy.visit('http://localhost:3000/algorithmeditor');
        // Open a new tab
        cy.get('[data-cy="NewTabButton"]').click();
        // Load Bary Center Algorithm
    });

});