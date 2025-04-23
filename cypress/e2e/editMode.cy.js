/**
 * Tests manually creating a graph with Cytoscape interface
 * @author Jacob Friend
 */
describe('Test Graph Edit Mode', () => {
    
    beforeEach(() => {
        // Create a simple graph of new nodes with an edge
        cy.visit('http://localhost:3000');
        cy.get('[data-cy="cytoscape-instance"]').should('be.visible');
        // Add two nodes
        cy.get('[data-id="layer0-selectbox"]').rightclick(300, 300, {force: true});
        cy.get('[data-cy="new-node-button"]').click();
        cy.get('[data-id="layer0-selectbox"]').rightclick(400, 400, {force: true});
        cy.get('[data-cy="new-node-button"]').click();
        // Add an edge
        cy.get('[data-id="layer0-selectbox"]').rightclick();
        cy.get('[placeholder="Source"]').type('0');
        cy.get('[placeholder="Destination"]').type('1');
        cy.contains('New Edge').click();
    });

    it('Save a graph', () => {
        cy.contains('Save Changes').click();
    });

    it('Delete two nodes', () => {
        cy.get('[data-id="layer0-selectbox"]').rightclick(300, 300, {force: true});
        cy.contains('Delete Node').click();
        cy.get('[data-id="layer0-selectbox"]').rightclick(400, 400, {force: true});
        cy.contains('Delete Node').click();
    });

    it('Remove and add back changes', () => {
        // Revert changes back
        cy.get('[data-id="layer0-selectbox"]').rightclick(300, 300, {force: true});
        cy.get('[data-cy="change-back"]').click();
        cy.get('[data-cy="change-back"]').click();
        cy.get('[data-cy="change-back"]').click();
        // Go forward to add back the changes
        cy.get('[data-id="layer0-selectbox"]').rightclick(400, 400, {force: true});
        cy.get('[data-cy="change-forward"]').click();
        cy.get('[data-cy="change-forward"]').click();
        cy.get('[data-cy="change-forward"]').click();
    });
    
});
