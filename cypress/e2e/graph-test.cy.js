/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('test the graph input', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:3000/grapheditor')
  })

  it('check adding tabs', () => {
      cy.get('.tab-locations').children().should('have.length', 2);

      cy.get('.tab-locations').children().last().click();
      cy.get('.tab-locations').children().should('have.length', 3);
      cy.get('.tab-locations').children().last().click();
      cy.get('.tab-locations').children().should('have.length', 4);
      cy.get('.tab-locations').children().last().click();
      cy.get('.tab-locations').children().should('have.length', 5);
  });

  it('check naming tabs', () => {
    cy.get('.tab-locations').children().should('have.length', 2);
    cy.get('.tab-locations').children().last().click();
    cy.get('.tab-locations').children().should('have.length', 3);

    cy.get('#filename-editor').type('asdf');
    cy.get('.tab-locations').children().eq(1).click();

    cy.get('.tab-locations').children().eq(0).should('have.text', '0asdf')
});

})
