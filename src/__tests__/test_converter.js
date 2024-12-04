import '@testing-library/jest-dom';
import predicateConverter from 'pages/GraphView/utils/PredicateConverter';

describe("predicateConverter Tests", () => {
    test("predicate with only basic node information", () => {
        const predicate = {
            nodes: [
                { id: '1', x: 300, y: 200 },
                { id: '2', x: 100, y: 200 },
                { id: '3', x: 400, y: 200 }
            ],
            getEdgeObject: jest.fn() // Mocking the getEdgeObject method
        };

        const expectedGraphData = [
            { data: { id: '1' }, position: { x: 300, y: 200 } },
            { data: { id: '2' }, position: { x: 100, y: 200 } },
            { data: { id: '3' }, position: { x: 400, y: 200 } }
        ];

        const graphData = predicateConverter(predicate, null, null, null, null);
        expect(graphData).toEqual(expectedGraphData);
    });

    test("predicate with nodes and additional attributes", () => {
        const predicate = {
            nodes: [
                { id: '1', x: 300, y: 200, label: 'one', weight: 3, color: 'red' },
                { id: '2', x: 100, y: 200, label: 'two', marked: true, weight: 1, color: 'black' },
                { id: '3', x: 400, y: 200, highlighted: true }
            ],
            getEdgeObject: jest.fn()
        };

        const expectedGraphData = [
            { data: { id: '1', label: 'one', weight: 3, color: 'red' }, position: { x: 300, y: 200 } },
            { data: { id: '2', label: 'two', marked: true, weight: 1, color: 'black' }, position: { x: 100, y: 200 } },
            { data: { id: '3', highlighted: true }, position: { x: 400, y: 200 } }
        ];

        const graphData = predicateConverter(predicate, null, null, null, null);
        expect(graphData).toEqual(expectedGraphData);
    });

    test("predicate with nodes and undirected edges", () => {
        const predicate = {
            nodes: [
                { id: '1', x: 300, y: 200 },
                { id: '2', x: 100, y: 200 },
                { id: '3', x: 400, y: 200 }
            ],
            edges: [
                { source: '1', target: '2', weight: 5 },
                { source: '2', target: '3' }
            ],
            getEdgeObject(edge) {
                return edge;
            }
        };

        const expectedGraphData = [
            { data: { id: '1' }, position: { x: 300, y: 200 } },
            { data: { id: '2' }, position: { x: 100, y: 200 } },
            { data: { id: '3' }, position: { x: 400, y: 200 } },
            { data: { source: '1', target: '2', label: '5', weight: 5 } },
            { data: { source: '2', target: '3', label: '' } }
        ];

        const graphData = predicateConverter(predicate, null, null, true, false);
        expect(graphData).toEqual(expectedGraphData);
    });

    test("predicate with nodes and directed edges", () => {
      const predicate = {
          nodes: [
              { id: '1', x: 300, y: 200 },
              { id: '2', x: 100, y: 200 },
              { id: '3', x: 400, y: 200 }
          ],
          edges: [
              { source: '1', target: '2', label: 'edge A' },
              { source: '2', target: '3', weight: 4 },
              { source: '3', target: '1' }
          ],
          directed: true,
          getEdgeObject: jest.fn(edge => edge)
      };
  
      const expectedGraphData = [
          { data: { id: '1' }, position: { x: 300, y: 200 } },
          { data: { id: '2' }, position: { x: 100, y: 200 } },
          { data: { id: '3' }, position: { x: 400, y: 200 } },
          { data: { source: '1', target: '2', label: '' }, classes: ['directed'] },  // Label set to empty string
          { data: { source: '2', target: '3', label: '4', weight: 4 }, classes: ['directed'] }, // Weight as label
          { data: { source: '3', target: '1', label: '' }, classes: ['directed'] }
      ];
  
      const graphData = predicateConverter(predicate, null, null, true, true);
      expect(graphData).toEqual(expectedGraphData);
  });
  
  

    test("predicate with empty nodes and edges", () => {
        const predicate = { nodes: [], edges: [], getEdgeObject: jest.fn() };
        const expectedGraphData = [];
        const graphData = predicateConverter(predicate, null, null, null, null);
        expect(graphData).toEqual(expectedGraphData);
    });

    test("empty predicate", () => {
        const predicate = { getEdgeObject: jest.fn() };
        const expectedGraphData = [];
        const graphData = predicateConverter(predicate, null, null, null, null);
        expect(graphData).toEqual(expectedGraphData);
    });
});
