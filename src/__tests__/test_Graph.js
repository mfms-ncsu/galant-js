import Graph from 'utils/Graph';

describe('Graph', () => {
  let graph;

  beforeEach(() => {
    const nodes = {
      A: { id: 'A' },
      B: { id: 'B' },
      C: { id: 'C' },
    };

    const edges = {
      'A B': { source: 'A', target: 'B' },
      'B C': { source: 'B', target: 'C' },
    };

    graph = new Graph(nodes, edges, true, '', 'test-graph', 1);
  });

  test('creates a new Graph instance', () => {
    expect(graph).toBeInstanceOf(Graph);
  });

  test('retrieves nodes', () => {
    expect(graph.getNodes()).toEqual(['A', 'B', 'C']);
  });

  test('retrieves edges', () => {
    expect(graph.getEdges()).toEqual(['A B', 'B C']);
  });

  test('retrieves number of nodes', () => {
    expect(graph.getNumberOfNodes()).toBe(3);
  });

  test('retrieves number of edges', () => {
    expect(graph.getNumberOfEdges()).toBe(2);
  });

  test('retrieves node object', () => {
    expect(graph.getNodeObject('A')).toEqual({ id: 'A' });
  });

  test('retrieves edge object', () => {
    expect(graph.getEdgeObject('A B')).toEqual({ source: 'A', target: 'B' });
  });

  test('retrieves node or edge object', () => {
    expect(graph.getNodeOrEdgeObject('A')).toEqual({ id: 'A' });
    expect(graph.getNodeOrEdgeObject('A B')).toEqual({ source: 'A', target: 'B' });
  });

  test('retrieves source of an edge', () => {
    expect(graph.source('A B')).toBe('A');
  });

  test('retrieves target of an edge', () => {
    expect(graph.target('A B')).toBe('B');
  });

  test('retrieves edges between nodes', () => {
    expect(graph.getEdgesBetween('A', 'B')).toEqual(['A B']);
    expect(graph.getEdgesBetween('A', 'C')).toEqual([]);
  });

  test('retrieves an edge between nodes', () => {
    expect(graph.getEdgeBetween('A', 'B')).toBe('A B');
    expect(graph.getEdgeBetween('A', 'C')).toBeNull();
  });

  test('retrieves the other node connected to an edge', () => {
    expect(graph.other('A', 'A B')).toBe('B');
    expect(graph.other('B', 'A B')).toBe('A');
  });

  test('retrieves incident edges', () => {
    expect(graph.incident('A')).toEqual(['A B']);
    expect(graph.incident('B')).toEqual(['A B', 'B C']);
  });

  test('retrieves incoming edges', () => {
    expect(graph.incoming('A')).toEqual([]);
    expect(graph.incoming('B')).toEqual(['A B']);
  });

  test('retrieves outgoing edges', () => {
    expect(graph.outgoing('A')).toEqual(['A B']);
    expect(graph.outgoing('B')).toEqual(['B C']);
  });

  test('retrieves adjacent nodes', () => {
    expect(graph.adjacentNodes('A')).toEqual(['B']);
    expect(graph.adjacentNodes('B')).toEqual(['A', 'C']);
  });

  test('retrieves incoming nodes', () => {
    expect(graph.incomingNodes('A')).toEqual([]);
    expect(graph.incomingNodes('B')).toEqual(['A']);
  });

  test('retrieves outgoing nodes', () => {
    expect(graph.outgoingNodes('A')).toEqual(['B']);
    expect(graph.outgoingNodes('B')).toEqual(['C']);
  });

  test('marks and unmarks nodes', () => {
    graph.mark('A');
    expect(graph.marked('A')).toBe(true);
    graph.unmark('A');
    expect(graph.marked('A')).toBe(false);
  });

  test('clears node marks', () => {
    graph.mark('A');
    graph.mark('B');
    graph.clearNodeMarks();
    expect(graph.marked('A')).toBe(false);
    expect(graph.marked('B')).toBe(false);
  });

  test('highlights and unhighlights nodes', () => {
    graph.highlight('A');
    expect(graph.highlighted('A')).toBe(true);
    graph.unhighlight('A');
    expect(graph.highlighted('A')).toBe(false);
  });

  test('highlights and unhighlights edges', () => {
    graph.highlight('A B');
    expect(graph.highlighted('A B')).toBe(true);
    graph.unhighlight('A B');
    expect(graph.highlighted('A B')).toBe(false);
  });

  test('clears node highlights', () => {
    graph.highlight('A');
    graph.highlight('B');
    graph.clearNodeHighlights();
    expect(graph.highlighted('A')).toBe(false);
    expect(graph.highlighted('B')).toBe(false);
  });

  test('clears edge highlights', () => {
    graph.highlight('A B');
    graph.highlight('B C');
    graph.clearEdgeHighlights();
    expect(graph.highlighted('A B')).toBe(false);
    expect(graph.highlighted('B C')).toBe(false);
  });

  test('colors and uncolors nodes', () => {
    graph.color('A', 'red');
    expect(graph.getColor('A')).toBe('red');
    graph.uncolor('A');
    expect(graph.hasColor('A')).toBe(false);
  });

  test('colors and uncolors edges', () => {
    graph.color('A B', 'green');
    expect(graph.getColor('A B')).toBe('green');
    graph.uncolor('A B');
    expect(graph.hasColor('A B')).toBe(false);
  });

  test('clears node colors', () => {
    graph.color('A', 'red');
    graph.color('B', 'blue');
    graph.clearNodeColors();
    expect(graph.hasColor('A')).toBe(false);
    expect(graph.hasColor('B')).toBe(false);
  });

  test('clears edge colors', () => {
    graph.color('A B', 'green');
    graph.color('B C', 'yellow');
    graph.clearEdgeColors();
    expect(graph.hasColor('A B')).toBe(false);
    expect(graph.hasColor('B C')).toBe(false);
  });

  test('labels and unlabels nodes', () => {
    graph.label('A', 'Node A');
    expect(graph.getLabel('A')).toBe('Node A');
    graph.unlabel('A');
    expect(graph.hasLabel('A')).toBe(false);
  });

  test('labels and unlabels edges', () => {
    graph.label('A B', 'Edge AB');
    expect(graph.getLabel('A B')).toBe('Edge AB');
    graph.unlabel('A B');
    expect(graph.hasLabel('A B')).toBe(false);
  });

  test('clears node labels', () => {
    graph.label('A', 'Node A');
  });
});