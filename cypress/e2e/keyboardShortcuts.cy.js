/**
 * Tests Galant's shortcut keys and preferences options
 * @author Jacob Friend
 */
describe('Tests shortcut keys and preferences buttons', () => {
	
	beforeEach(() => {
		cy.visit('http://localhost:3000');
		
		// Enable shortcut keys by clicking an overlay button
		cy.contains('Layout').should('be.visible').click();
		cy.contains('Layout').click();
		// Track when a new window opens
		cy.window().then((win) => {
			cy.stub(win, 'open').as('windowOpen')
		});
	});

	it.only('Ensure preferences keyboard shortcuts trigger appropriate event', () => {
		// Controls pop-up appears with all styling options
		cy.contains('Controls:visible').should('not.exist');
		cy.get('body').type('v');
		cy.contains('Controls').should('be.visible');
		cy.contains('Auto Camera').should('be.visible');
		cy.contains('Evenly-Spaced Layout').should('be.visible');

		// Node Settings pop-up appears with all styling options
		cy.contains('Node Settings:visible').should('not.exist');
		cy.get('body').type('n');
		cy.contains('Node Settings').should('be.visible');
		cy.contains('Display Weights').should('be.visible');
		cy.contains('Display Labels').should('be.visible');
		cy.contains('Node Radius').should('be.visible');

		// Controls pop-up appears with all styling options
		cy.contains('Edge Settings:visible').should('not.exist');
		cy.get('body').type('e');
		cy.contains('Edge Settings').should('be.visible');
		cy.contains('Directed').should('be.visible');
	});

	it('Ensure Algorithm (a) shortcut triggers appropriate event', () => {
		// Simulate 'a' shortcut keypress
		cy.get('body').type('a');
		
		// Ensure each shortcut key goes to the appropriate editor
		cy.get('@windowOpen').then((stub) => {
			expect(stub.getCall(0)).to.be.calledWith('/algorithmeditor');
		});
	});

	it('Ensure Graph (g) shortcut triggers appropriate event', () => {
		// Simulate 'g' shortcut keypress
		cy.get('body').type('g');
		
		// Ensure each shortcut key goes to the appropriate editor
		cy.get('@windowOpen').then((stub) => {
			expect(stub.getCall(0)).to.be.calledWith('/grapheditor');
		});
	});

	it('Ensure Help (h) shortcut triggers appropriate event', () => {
		// Simulate 'h' shortcut keypress
		cy.get('body').type('h');
		
		// Ensure each shortcut key goes to the appropriate editor
		cy.get('@windowOpen').then((stub) => {
			expect(stub.getCall(0)).to.be.calledWith('/instructions');
		});
	});

});