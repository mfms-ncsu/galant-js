describe('Test Algorithm Editor', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('http://localhost:3000/algorithmeditor')
    })
  
    it('Monaco Editor exists', () => {
        // Old test
        // cy.get('.monaco-editor').should('exist');

        // New test
        // Open a blank editor tab
        cy.get('[data-cy="NewTabButton"]').click();
        cy.get('[data-cy="BlankTab"]').click();

        // Monaco editor should render
        cy.get('[data-cy="MonacoEditor"]').should('exist');
    });

    it('Examples dropdown appears', () => {
        cy.get('#new-button').click();
        cy.get('#examples-dropdown').should('be.visible');
    })

    it('Example Added', () => {
        cy.get('#new-button').click();
        cy.get('#examples-dropdown').contains('Breadth-First Search').click();
        cy.get('.tab').contains('Breadth-First Search');
    })

    it('Ensure LocalStorage is properly read on refresh', () => {
        cy.get('#new-button').click();
        cy.get('#examples-dropdown').contains('Breadth-First Search').click();
        cy.window().should(win => {
            expect(win.localStorage.getItem('AlgorithmFiles')).to.exist;
        });
        cy.visit('http://localhost:3000/algorithmeditor');
        cy.get('.tab').contains('Breadth-First Search');
    })
});