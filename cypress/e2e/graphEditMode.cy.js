describe.skip('Test Graph Editor', () => {  
    
    /** 
     * Currently unable to load a graph and algorithm into Galant
     * in a Cypress test. Cypress does not support testing across
     * multiple windows, which makes it difficult to interact with
     * the algorithm and graph editors. Find a work around or consider
     * a different testing framework.
     * 
     * Skipping all tests in this file for now.
    */

    it('Graph Loaded', () => {
        // Invalid work around to load a graph during a Cypress test
        cy.intercept('GET', '/worker.js', (req) => {
            const url = new URL(req.url);
            url.pathname = url.pathname.replace('worker.js', 'testing/mockWorkerGraph.js');
            req.url = url.href;
        }).as('modifiedRequest');

        cy.visit('http://localhost:3000');
        cy.window().should('have.property', 'cytoscape');

        const cytoscape = cy.window()
        .then((window) => {
            return window.cytoscape;
        })
        .then(async cytoscape => {
            expect(cytoscape.elements().length).to.be.equal(0);
            cy.wait(1500);
            return cytoscape;
        })
        .then(async cytoscape => {
            expect(cytoscape.nodes().length).to.be.equal(2);
            cytoscape.getElementById('a').emit('cxttap');
            const nodeContextMenu = cy.get('#node-context-menu');
            nodeContextMenu.should('exist');

            const idInput = nodeContextMenu.get('#node-id');
            idInput.should('have.value', 'a');

            const weightInput = nodeContextMenu.get("#node-weight");
            weightInput.type('12').blur();
            cy.get("#node-context-menu").invoke('attr', 'style', 'display: none;')
            cy.wait(1000);

            return cytoscape;

        })
        .then(async cytoscape => {
            const anEdge = cytoscape.getElementById('a').connectedEdges()[0];
            cy.log(anEdge.id());
            anEdge.emit('cxttap');
            const edgeContextMenu = cy.get('#edge-context-menu');
            edgeContextMenu.should('exist');

            const weightInput = edgeContextMenu.get("#edge-weight");
            weightInput.type('12').blur();
            cy.get("#edge-context-menu").invoke('attr', 'style', 'display: none;')
            cy.wait(1000);
            cy.contains('Save Changes').click();
        });
    });

});