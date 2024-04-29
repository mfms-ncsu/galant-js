/**
 * Testing for UC2 GraphEditHistory.js
 * @author Christina Albores
 */
import GraphEditHistory from 'pages/GraphView/utils/GraphEditHistory.js';
import Graph from 'utils/Graph';
import '@testing-library/jest-dom';
import { enablePatches } from 'immer';
import { render, screen, act } from '@testing-library/react';
import { useImmer } from 'use-immer'; // Import useImmer

enablePatches(); // Enable patches for useImmer

describe('GraphEditHistory', () => {
    let graphEditHistory;

    /**
     * Test component used for initializing GraphEditHistory with useImmer.
     */
    const TestComponent = () => {
        // Initialize graphEditHistoryData with useImmer inside a functional component
        const [graphEditHistoryData, updateGraphEditHistory] = useImmer({
            history: [],
            current: -1
        });

        // Initialize graphEditHistory using the data from useImmer
        graphEditHistory = new GraphEditHistory(graphEditHistoryData, updateGraphEditHistory);

        return null; // This component does not render anything, so we return null
    };



    // The act function from @testing-library/react ensures that all updates to state and the 
    // DOM caused by rendering React components are settled before making assertions or other 
    // testing operations. It's employed within beforeEach hooks and test cases to guarantee 
    // synchronous processing of component updates and changes, reflecting real-world React 
    // behavior and preventing issues like race conditions in tests.

    beforeEach(() => {
        act(() => {
            render(<TestComponent />); // Render the test component inside act()
        });
    });

    test('add method adds a snapshot to history', () => {
        act(() => {
            expect(graphEditHistory.history).toHaveLength(0);
            expect(graphEditHistory.current).toBe(-1);
            
            const snapshot0 = new Graph({}, {}, false, 'Graph0');
            graphEditHistory.add(snapshot0);
        });

        expect(graphEditHistory.history).toHaveLength(1);
        expect(graphEditHistory.current).toBe(0);

        act(() => {
            const snapshot1 = new Graph({}, {}, false, 'Graph1');
            graphEditHistory.add(snapshot1);
        });

        expect(graphEditHistory.history).toHaveLength(2);
        expect(graphEditHistory.current).toBe(1);

        act(() => {
            const snapshot2 = new Graph({}, {}, false, 'Graph2');
            graphEditHistory.add(snapshot2);
        });

        expect(graphEditHistory.history).toHaveLength(3);
        expect(graphEditHistory.current).toBe(2);

    });

    test('undo method moves current index to previous snapshot', () => {
        act(() => {
            expect(graphEditHistory.history).toHaveLength(0);
            expect(graphEditHistory.current).toBe(-1);
            
            const snapshot0 = new Graph({}, {}, false, 'Graph0');
            const snapshot1 = new Graph({}, {}, false, 'Graph1');
            graphEditHistory.add(snapshot0);
            graphEditHistory.add(snapshot1);
        });

        expect(graphEditHistory.history).toHaveLength(2);
        expect(graphEditHistory.current).toBe(1);
        
        act(() => {
            graphEditHistory.undo();
        });

        expect(graphEditHistory.history).toHaveLength(2);
        expect(graphEditHistory.current).toBe(0);
    });

        test('redo method moves current index to next snapshot', () => {
        
        act(() => {
            expect(graphEditHistory.history).toHaveLength(0);
            expect(graphEditHistory.current).toBe(-1);
            
            const snapshot0 = new Graph({}, {}, false, 'Graph0');
            const snapshot1 = new Graph({}, {}, false, 'Graph1');
            graphEditHistory.add(snapshot0);
            graphEditHistory.add(snapshot1);
        });

        expect(graphEditHistory.history).toHaveLength(2);
        expect(graphEditHistory.current).toBe(1);
        
        act(() => {
            graphEditHistory.undo();
        });

        expect(graphEditHistory.history).toHaveLength(2);
        expect(graphEditHistory.current).toBe(0);

        act(() => {
            graphEditHistory.redo();
        });

        expect(graphEditHistory.history).toHaveLength(2);
        expect(graphEditHistory.current).toBe(1);
    });


    test('revert method clears all snapshots except initial graph', () => {
        act(() => {
            expect(graphEditHistory.history).toHaveLength(0);
            expect(graphEditHistory.current).toBe(-1);
            
            const snapshot0 = new Graph({}, {}, false, 'Graph0');
            const snapshot1 = new Graph({}, {}, false, 'Graph1');
            const snapshot2 = new Graph({}, {}, false, 'Graph2');
            graphEditHistory.add(snapshot0);
            graphEditHistory.add(snapshot1);
            graphEditHistory.add(snapshot2);
        });

        expect(graphEditHistory.history).toHaveLength(3);
        expect(graphEditHistory.current).toBe(2);
        
        act(() => {
            graphEditHistory.revert();
        });

        expect(graphEditHistory.history).toHaveLength(1);
        expect(graphEditHistory.current).toBe(0);

    });


        test('getCurrentSnapshot method returns the current snapshot', () => {
            expect(graphEditHistory.history).toHaveLength(0);
            expect(graphEditHistory.current).toBe(-1);
            const snapshot0 = new Graph({}, {}, false, 'Graph0');
            act(() => {
                graphEditHistory.add(snapshot0);
            });
    
            expect(graphEditHistory.history).toHaveLength(1);
            expect(graphEditHistory.current).toBe(0);
            expect(graphEditHistory.getCurrentSnapshot()).toEqual(snapshot0);
    
            const snapshot1 = new Graph({}, {}, false, 'Graph1');
            act(() => {
                graphEditHistory.add(snapshot1);
            });
    
            expect(graphEditHistory.history).toHaveLength(2);
            expect(graphEditHistory.current).toBe(1);
            expect(graphEditHistory.getCurrentSnapshot()).toEqual(snapshot1);
    

            const snapshot2 = new Graph({}, {}, false, 'Graph2');
            act(() => {
                graphEditHistory.add(snapshot2);
            });
    
            expect(graphEditHistory.history).toHaveLength(3);
            expect(graphEditHistory.current).toBe(2);
            expect(graphEditHistory.getCurrentSnapshot()).toEqual(snapshot2);

            act(() => {
                graphEditHistory.undo();
            });

            expect(graphEditHistory.history).toHaveLength(3);
            expect(graphEditHistory.current).toBe(1);
            expect(graphEditHistory.getCurrentSnapshot()).toEqual(snapshot1);


            act(() => {
                graphEditHistory.redo();
            });

            expect(graphEditHistory.history).toHaveLength(3);
            expect(graphEditHistory.current).toBe(2);
            expect(graphEditHistory.getCurrentSnapshot()).toEqual(snapshot2);


            act(() => {
                graphEditHistory.undo();
                graphEditHistory.undo();
            });

            expect(graphEditHistory.history).toHaveLength(3);
            expect(graphEditHistory.current).toBe(0);
            expect(graphEditHistory.getCurrentSnapshot()).toEqual(snapshot0);

        });

        test('getLatestSnapshot method returns the latest snapshot', () => {
            expect(graphEditHistory.history).toHaveLength(0);
            expect(graphEditHistory.current).toBe(-1);
            expect(graphEditHistory.getLatestSnapshot()).toEqual(undefined);
            const snapshot0 = new Graph({}, {}, false, 'Graph0');
            act(() => {
                graphEditHistory.add(snapshot0);
            });
    
            expect(graphEditHistory.history).toHaveLength(1);
            expect(graphEditHistory.current).toBe(0);
            expect(graphEditHistory.getLatestSnapshot()).toEqual(snapshot0);
            
    
            const snapshot1 = new Graph({}, {}, false, 'Graph1');
            act(() => {
                graphEditHistory.add(snapshot1);
            });
    
            expect(graphEditHistory.history).toHaveLength(2);
            expect(graphEditHistory.current).toBe(1);
            expect(graphEditHistory.getLatestSnapshot()).toEqual(snapshot1);
    

            const snapshot2 = new Graph({}, {}, false, 'Graph2');
            act(() => {
                graphEditHistory.add(snapshot2);
            });
    
            expect(graphEditHistory.history).toHaveLength(3);
            expect(graphEditHistory.current).toBe(2);
            expect(graphEditHistory.getLatestSnapshot()).toEqual(snapshot2);

            act(() => {
                graphEditHistory.undo();
            });

            expect(graphEditHistory.history).toHaveLength(3);
            expect(graphEditHistory.current).toBe(1);
            expect(graphEditHistory.getCurrentSnapshot()).toEqual(snapshot1);
            expect(graphEditHistory.getLatestSnapshot()).toEqual(snapshot2);


            act(() => {
                graphEditHistory.redo();
            });

            expect(graphEditHistory.history).toHaveLength(3);
            expect(graphEditHistory.current).toBe(2);
            expect(graphEditHistory.getCurrentSnapshot()).toEqual(snapshot2);
            expect(graphEditHistory.getLatestSnapshot()).toEqual(snapshot2);


            act(() => {
                graphEditHistory.undo();
                graphEditHistory.undo();
            });

            expect(graphEditHistory.history).toHaveLength(3);
            expect(graphEditHistory.current).toBe(0);
            expect(graphEditHistory.getCurrentSnapshot()).toEqual(snapshot0);
            expect(graphEditHistory.getLatestSnapshot()).toEqual(snapshot2);
        });
});










