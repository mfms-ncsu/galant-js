/**
 * Testing for GraphUtils
 * @author Christina Albores
 */

import { calculateGraphScalar, applyScalar, extractPositions, applyPositions, transformPositions, roundPositions } from 'pages/GraphView/utils/GraphUtils';

describe('GraphUtils', () => {
  describe('calculateGraphScalar', () => {
    it('should correctly calculate the scalar for graph', () => {
      const nodes = [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: -1, y: -5 }];
      expect(calculateGraphScalar(nodes)).toBeCloseTo(100);
    });
  });

  describe('applyScalar', () => {
    it('should correctly apply scalar to node coordinates', () => {
      const nodes = { a: { x: 1, y: 2 }, b: { x: 3, y: 4 } };
      const scalar = 2;
      applyScalar(nodes, scalar);
      expect(nodes.a).toEqual({ x: 2, y: 4 });
      expect(nodes.b).toEqual({ x: 6, y: 8 });
    });
  });

  describe('extractPositions', () => {
    it('should correctly extract positions from a graph', () => {
      const graph = { nodes: { a: { x: 1, y: 2 }, b: { x: 3, y: 4 } } };
      expect(extractPositions(graph)).toEqual({ a: { x: 1, y: 2 }, b: { x: 3, y: 4 } });
    });
  });

  describe('applyPositions', () => {
    it('should correctly apply positions to a graph', () => {
      const graph = { nodes: { a: { x: 1, y: 2 }, b: { x: 3, y: 4 } } };
      const positions = { a: { x: 5, y: 6 }, b: { x: 7, y: 8 } };
      const newGraph = applyPositions(graph, positions);
      expect(newGraph.nodes.a).toEqual({ x: 5, y: 6 });
      expect(newGraph.nodes.b).toEqual({ x: 7, y: 8 });
    });
  });

  describe('transformPositions', () => {
    it('should correctly transform positions based on scalar', () => {
      const positions = { a: { x: 1, y: 2 }, b: { x: 3, y: 4 } };
      const scalar = 2;
      expect(transformPositions(positions, scalar)).toEqual({ a: { x: 2, y: 4 }, b: { x: 6, y: 8 } });
    });
  });

  describe('roundPositions', () => {
    it('should correctly round positions to nearest integer', () => {
      const positions = { a: { x: 1.5, y: 2.4 }, b: { x: 3.6, y: 4.8 } };
      expect(roundPositions(positions)).toEqual({ a: { x: 2, y: 2 }, b: { x: 4, y: 5 } });
    });
  });
});
