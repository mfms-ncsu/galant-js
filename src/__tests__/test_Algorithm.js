import Algorithm from 'states/Algorithm/Algorithm';
import { AlgorithmConfiguration } from 'utils/Algorithm/AlgorithmConfiguration';
import Graph from 'utils/Graph';
import ChangeRecord from 'pages/GraphView/utils/ChangeRecord';


beforeAll(() => {
    // Ensure the ChangeRecord instance for "algorithm" is created before the tests.
    ChangeRecord.instances = {};
    ChangeRecord.instances['algorithm'] = new ChangeRecord('algorithm');
});

var threadHandlerImport = "../../src/utils/algorithm/Thread/ThreadHandler";
jest.mock(threadHandlerImport, () => {
    return jest.fn().mockImplementation(() => ({
        startThread: jest.fn(),
        resumeThread: jest.fn(),
        killThread: jest.fn(),
        enterPromptResult: jest.fn()
    }));
});

const graphData = {
    nodes: [
        { id: 1, label: 'Node 1' },
        { id: 2, label: 'Node 2' },
        { id: 3, label: 'Node 3' }
    ],
    edges: [
        { source: 1, target: 2, label: 'Edge 1' },
        { source: 2, target: 3, label: 'Edge 2' }
    ],
};
const mockGraph = new Graph(graphData.nodes, graphData.edges, true, 'This is a test graph');

const mockServices = { PromptService: { addPrompt: jest.fn() } };
const mockStateVar = [{}, jest.fn()];
const mockAlgorithmCode = `
for (let node of getNodes()) {
    print("Marked node " + node);
    mark(node);
}
display("Marked every node");
`;

describe('Algorithm', () => {
    let algorithm;

    beforeEach(() => {
        algorithm = new Algorithm('MockAlgorithm', mockAlgorithmCode, mockGraph, mockServices, mockStateVar, true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('initializing it properly', () => {
        expect(algorithm.steps).toHaveLength(1);
        expect(algorithm.steps[0].graph).toEqual(expect.any(Object));
        expect(algorithm.currentIndex).toBe(0);
        expect(algorithm.fetchingSteps).toBe(false);
        expect(algorithm.completed).toBeUndefined();
    });

    it('testing that it adds a rule properly', () => {
        const mockRule = { apply: [] };
        algorithm.stepBuilder.addRule(mockRule);
        expect(algorithm.stepBuilder.changes).toContain(mockRule);
    });

    it('testing that it builds a step properly', () => {
        const mockRule = { apply: [] };
        algorithm.stepBuilder.addRule(mockRule);
        const newStep = algorithm.stepBuilder.build();
        expect(newStep.graph).toEqual(expect.any(Object)); // Assuming applyPatches doesn't change the graph
    });

    it('testing that it handles the time out properly', () => {
        jest.useFakeTimers();
        algorithm.stepForward();
        expect(algorithm.fetchingSteps).toBe(true);

        algorithm.onStepAdded();

        expect(algorithm.currentIndex).toBe(1);
        expect(algorithm.fetchingSteps).toBe(false);

        jest.advanceTimersByTime(5001);
        expect(mockServices.PromptService.addPrompt).toHaveBeenCalledTimes(1);
        expect(mockServices.PromptService.addPrompt).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'algorithmError' }),
            expect.any(Function)
        );
    });

    it('testing that it steps back properly', () => {
        algorithm.currentIndex = 1;
        algorithm.stepBack();
        expect(algorithm.currentIndex).toBe(0);
    });

    it('steps forward within existing steps', () => {
        algorithm.steps.push(...[{}, {}]);
        algorithm.stepForward();
        expect(algorithm.currentIndex).toBe(1);
        algorithm.stepForward();
        expect(algorithm.currentIndex).toBe(2);
    });

    it('testing stepForward function when fetching new steps', () => {
        algorithm.completed = false;
        algorithm.fetchingSteps = false;

        algorithm.threadHandler.resumeThread = jest.fn();

        const stepAddedCallback = jest.fn();
        algorithm.stepForward(stepAddedCallback);

        expect(stepAddedCallback).not.toHaveBeenCalled();
        expect(algorithm.fetchingSteps).toBe(true);

        algorithm.onStepAdded();
        expect(stepAddedCallback).toHaveBeenCalled();
        expect(algorithm.currentIndex).toBe(1);
        expect(algorithm.fetchingSteps).toBe(false);
    });
});

describe('AlgorithmConfiguration', () => {
    it('should apply options from the configuration object', () => {
        const config = { controlNodePosition: true };
        const algorithmConfig = new AlgorithmConfiguration();
        algorithmConfig.applyOptions(config);
        expect(algorithmConfig.controlNodePosition).toBe(true);
    });

    it('skips undefined or function properties', () => {
        const algorithmConfig = new AlgorithmConfiguration();
        algorithmConfig.functionProperty = () => { };

        const config = {
            undefinedProperty: "someValue",
            functionProperty: "newValue"
        };

        algorithmConfig.applyOptions(config);

        expect(algorithmConfig.undefinedProperty).toBeUndefined();
        expect(typeof algorithmConfig.functionProperty).toBe('function');
    });
});
