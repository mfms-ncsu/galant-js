/**
 * Tests the Galant graph editor
 * @author Jacob Friend
 */
describe('Test Graph Editor', () => {
    
    beforeEach(() => {
      cy.visit('http://localhost:3000/grapheditor')
    });
  
    it('Monaco Editor exists', () => {
        // Open a blank editor tab
        cy.get('[data-cy="NewTabButton"]').click();
        cy.get('[data-cy="BlankTab"]').click();

        // Monaco editor should render
        cy.get('[data-cy="MonacoEditor"]').should('exist');
    });

    it('Examples dropdown appears', () => {
        // Open a new tab
        cy.get('[data-cy="NewTabButton"]').click();
        // Check for list of algorithm examples
        cy.get('[data-cy="ExamplesHeader"]').should('exist');
    });

    it('Example Added', () => {
        // Open a new tab
        cy.get('[data-cy="NewTabButton"]').click();
        // Select NCSU Graph
        cy.contains('NCSU Logo').click();
        // NCSU Graph should open
        cy.contains('NCSU Logo').should('exist');
    });

    it.only('Ensure LocalStorage is properly read on refresh', () => {
        // Open a new tab
        cy.get('[data-cy="NewTabButton"]').click();
        // Select BFS Algorithm
        cy.contains('NCSU Logo').click();
        cy.window().should(win => {
            expect(win.localStorage.getItem('graphTabs')).to.exist;
        });
        cy.visit('http://localhost:3000/grapheditor');
        // BFS tab should persist through refresh
        cy.contains('NCSU Logo').should('exist');
    });

});