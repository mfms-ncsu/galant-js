import StepHandler from 'src/backend/Algorithm/StepHandler';
import Graph from 'src/backend/Graph/Graph';
import Predicates from 'src/backend/Graph/Predicates';
// import StepHandler from 'src/backend/Algorithm/StepHandler';

test ("test stepping forward and back", () => {
    // Create the predicates
    let algPredicates = new Predicates(
        new Graph({a: {color: "black"}, b: {color: "black"}, c: {color: "black"}}, {}, {}, "")
    );
    let dispPredicates = new Predicates(
        new Graph({a: {color: "black"}, b: {color: "black"}, c: {color: "black"}}, {}, {}, "")
    );

    // Create a StepHandler that just uses the default applyPatches function to update the predicates.
    let handler = new StepHandler((patches) => dispPredicates.applyPatches(patches));

    // Iterate through the nodes and color them red.
    for (let node of algPredicates.get().getNodes()) {
        let rule = algPredicates.update((graph) => {
            graph.setNodeColor(node, "red");
        });
        // Make sure generated rules are added to the StepHandler one at a time.
        handler.ruleStep(rule);
        expect(algPredicates).toEqual(dispPredicates);
    }

    expect(handler.getStatus()).toEqual({displayState: 3, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().node).toEqual({a: {color: "red"}, b: {color: "red"}, c: {color: "red"}});

    handler.stepBack();

    expect(handler.getStatus()).toEqual({displayState: 2, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().node).toEqual({a: {color: "red"}, b: {color: "red"}, c: {color: "black"}});

    handler.stepBack();

    expect(handler.getStatus()).toEqual({displayState: 1, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().node).toEqual({a: {color: "red"}, b: {color: "black"}, c: {color: "black"}});

    handler.stepBack();

    expect(handler.getStatus()).toEqual({displayState: 0, algorithmState: 3, canStepForward: true, canStepBack: false});
    expect(dispPredicates.get().node).toEqual({a: {color: "black"}, b: {color: "black"}, c: {color: "black"}});

    handler.stepForward();
    
    expect(handler.getStatus()).toEqual({displayState: 1, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().node).toEqual({a: {color: "red"}, b: {color: "black"}, c: {color: "black"}});
    
    handler.stepForward();
    
    expect(handler.getStatus()).toEqual({displayState: 2, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().node).toEqual({a: {color: "red"}, b: {color: "red"}, c: {color: "black"}});
    
    handler.stepForward();
    
    expect(handler.getStatus()).toEqual({displayState: 3, algorithmState: 3, canStepForward: true, canStepBack: true});
    expect(dispPredicates.get().node).toEqual({a: {color: "red"}, b: {color: "red"}, c: {color: "red"}});
});