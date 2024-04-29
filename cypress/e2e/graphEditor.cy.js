describe('Test Graph Editor', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('http://localhost:3000/grapheditor')
    })
  
    it('Monaco Editor exists', () => {
        cy.get('.monaco-editor').should('exist');
    });

    it('Examples dropdown appears', () => {
        cy.get('#new-button').click();
        cy.get('#examples-dropdown').should('be.visible');
    })

    it('Example Added', () => {
        cy.get('#new-button').click();
        cy.get('#examples-dropdown').contains('NCSU Map Graph').click();
        cy.get('.tab').contains('NCSU Map Graph');
    })

    it('Ensure LocalStorage is properly read on refresh', () => {
        cy.get('#new-button').click();
        cy.get('#examples-dropdown').contains('NCSU Map Graph').click();
        cy.window().should(win => {
            expect(win.localStorage.getItem('GraphFiles')).to.exist;
        });
        cy.visit('http://localhost:3000/grapheditor');
        cy.get('.tab').contains('NCSU Map Graph');
    })
});