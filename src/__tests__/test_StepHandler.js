import StepHandler from 'backend/Algorithm/StepHandler';
import Graph from 'backend/Graph/Graph';
import Predicates from 'backend/Graph/Predicates';
// import StepHandler from 'src/backend/Algorithm/StepHandler';

test ("test stepping forward and back", () => {
    // Create the predicates
    let algPredicates = new Predicates(
        new Graph({a: {}, b: {}, c: {}}, {}, {}, "")
    );
    let dispPredicates = new Predicates(
        new Graph({a: {}, b: {}, c: {}}, {}, {}, "")
    );

    // Create a StepHandler that just uses the default applyPatches function to update the predicates.
    let handler = new StepHandler((patches) => dispPredicates.applyPatches(patches));

    // Iterate through the nodes and color them red.
    for (let node of algPredicates.get().getNodes()) {
        let rule = algPredicates.update((graph) => {
            graph.mark(node);
        });
        // Make sure generated rules are added to the StepHandler one at a time.
        handler.ruleStep(rule);
        expect(algPredicates).toEqual(dispPredicates);
    }

    expect(handler.getStatus()).toEqual({displayState: 3, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().nodes).toEqual({a: {marked: true}, b: {marked: true}, c: {marked: true}});

    handler.stepBack();

    expect(handler.getStatus()).toEqual({displayState: 2, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().nodes).toEqual({a: {marked: true}, b: {marked: true}, c: {}});

    handler.stepBack();

    expect(handler.getStatus()).toEqual({displayState: 1, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().nodes).toEqual({a: {marked: true}, b: {}, c: {}});

    handler.stepBack();

    expect(handler.getStatus()).toEqual({displayState: 0, algorithmState: 3, canStepForward: true, canStepBack: false});
    expect(dispPredicates.get().nodes).toEqual({a: {}, b: {}, c: {}});

    handler.stepForward();
    
    expect(handler.getStatus()).toEqual({displayState: 1, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().nodes).toEqual({a: {marked: true}, b: {}, c: {}});
    
    handler.stepForward();
    
    expect(handler.getStatus()).toEqual({displayState: 2, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().nodes).toEqual({a: {marked: true}, b: {marked: true}, c: {}});
    
    handler.stepForward();
    
    expect(handler.getStatus()).toEqual({displayState: 3, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().nodes).toEqual({a: {marked: true}, b: {marked: true}, c: {marked: true}});
});