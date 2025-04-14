/**
 * Tests Algorithm Editor functionality
 * @author Jacob Friend
 */
describe('Test Algorithm Editor', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('http://localhost:3000/algorithmeditor')
    })
  
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
    })

    it('Example Added', () => {
        // Open a new tab
        cy.get('[data-cy="NewTabButton"]').click();
        // Select BFS Algorithm
        cy.contains('Breadth-First Search').click();
        // BFS tab should open
        cy.contains('Breadth-First Search').should('exist');
    })

    it('Ensure LocalStorage is properly read on refresh', () => {
        // Open a new tab
        cy.get('[data-cy="NewTabButton"]').click();
        // Select BFS Algorithm
        cy.contains('Breadth-First Search').click();
        cy.window().should(win => {
            expect(win.localStorage.getItem('algorithmTabs')).to.exist;
        });
        cy.visit('http://localhost:3000/algorithmeditor');
        // BFS tab should persist through refresh
        cy.contains('Breadth-First Search').should('exist');
    })
});