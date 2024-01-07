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

describe('test the main webpage loads correctly', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, 'open')
      }
    })
  })

  it('ensure header elements', () => {
      cy.get('.nav-elements > ul:nth-child(1)').children().should('have.length', 5);
  });

  it('check order of buttons', () => {
      cy.get('.nav-elements > ul:nth-child(1)').children().eq(0).should('have.text', 'Algorithm Editor');  
      cy.get('.nav-elements > ul:nth-child(1)').children().eq(1).should('have.text', 'Graph Editor');      
  })

  it('ensure success message', () => {
    cy.get('.me-auto').should('have.text', 'Main');
    cy.get('.toast-body').should('have.text', 'Program Loaded Successfully');
  })

  it('test close message', () => {
    cy.get('.btn-close').click();
    cy.get('.me-auto').should('not.exist');
  }) 

  it('test hamburger menu', () => {
    cy.get('.GraphPanel').should('not.exist');
    cy.get('.hamburger > button:nth-child(1)').click();
    cy.get('.GraphPanel').should('exist');  
    cy.get('.hamburger > button:nth-child(1)').click();
    cy.get('.GraphPanel').should('not.exist'); 
  })

  it('open algorithm editor', () => {
    cy.get('.nav-elements > ul:nth-child(1)').children().eq(0).click();
    cy.window().its('open').should('be.called');
  })

  it('open graph editor', () => {
    cy.get('.nav-elements > ul:nth-child(1)').children().eq(1).click();
    cy.window().its('open').should('be.called');
  })
})
