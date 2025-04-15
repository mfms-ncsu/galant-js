let minCrossings = 100000000;
let edgeCrossings = 0;
let minEdgeCrossings = 100000000;
let iteration = 0;
let pass = 0;
let minIteration = 0;
let minPass = 0;
const numLayers = numberOfLayers();
let savedPositions = copyNodePositions();
// saveGraphState();

/**
 * writes a message about current number of crossings, along with context information
 */
function displayMessage( layer, sweepDirection ) {
    let crossings = totalCrossings();
    display( `pass = ${pass}, iteration = ${iteration}, layer = ${layer}, direction = ${sweepDirection}, crossings = ${crossings}, min = ${minCrossings}, bottleneck = ${edgeCrossings}, min = ${minEdgeCrossings}`);
};

/**
 * displays weights, highlighting, and message; the beginStep that
 * corresponds to the endStep here occurred when weights and highlighting
 * were undone (reset) for the previous layer
 *
 * @param weightDirection direction of layer on which the current weight
 * assignment is based 
 */
function displayAfterWeightAssignment( layer, sweepDirection ) {
    setLayerProperty(layer, "color", "cyan");
    setLayerProperty(layer, "weightHidden", false);
    if (sweepDirection == "up") {
        setChannelProperty(layer - 1, "color", "blue");
    }
    else if (sweepDirection == "down") {
        setChannelProperty(layer, "color", "blue");
    }
    displayMessage( layer, sweepDirection );
}

/**
 * displays state of affairs after layer is sorted and begins a step that
 * resets weights and highlighting; nodes whose position is changed by the
 * sorting are marked
 */
function displayAfterSort( layer, sweepDirection ) {
    setLayerProperty(layer, "color", "cyan");
    setLayerProperty(layer, "weightHidden", false);
    if (sweepDirection == "up") {
        setChannelProperty(layer - 1, "color", "blue");
    }
    else if (sweepDirection == "down") {
        setChannelProperty(layer, "color", "blue");
    }
    displayMessage( layer, sweepDirection );
}

/**
 * changes the weights back to the positions of nodes on a layer and unmarks
 * the nodes that have been marked for position changes; the beginStep
 * matched an endStep after weights are assigned to a new layer
 */
function reset( layer, sweepDirection ) {
    setLayerProperty(layer, "color", "white");
    setLayerProperty(layer, "weightHidden", false);
    setLayerProperty(layer, "marked", false);
    if (sweepDirection == "up") {
        setChannelProperty(layer - 1, "color", "black");
    }
    else if (sweepDirection == "down") {
        setChannelProperty(layer, "color", "black");
    }
}

/**
 * saves the current positions if the number of crossings has decreased
 */
function checkCrossings() {
    const crossings = totalCrossings();
    if (crossings < minCrossings) {
        minCrossings = crossings;
        minIteration = iteration;
        minPass = pass;
        // save graph state
        savedPositions = copyNodePositions();
    }
    edgeCrossings = bottleneckCrossings();
    if (edgeCrossings < minEdgeCrossings) {
        minEdgeCrossings = edgeCrossings;
    }
    
}

function upSweep( numLayers ) {
    const sweepDirection = "down";
    for (let layer = 0; layer < numLayers - 1; layer++) {
        step(() => {
            setWeightsDown(layer, "position");
            displayAfterWeightAssignment(layer, sweepDirection);
        })
        step(() => {
            sortByWeight(layer);
            iteration++;
            checkCrossings();
            displayAfterSort(layer, sweepDirection);
        })
        step(() => {
            reset(layer, sweepDirection);
        })
    }
}

function downSweep( numLayers ) {
    const sweepDirection = "up";
    for (let layer = numLayers - 1; layer >= 1; layer--) {
        step(() => {
            setWeightsUp(layer, "position");
            displayAfterWeightAssignment(layer, sweepDirection);
        })
        step(() => {
            sortByWeight(layer);
            iteration++;
            checkCrossings();
            displayAfterSort(layer, sweepDirection);
        })
        step(() => {
            reset(layer, sweepDirection);
        })
    }
}

//Start Barycenter aglorithm
step(() => {
    for (let i = 0; i < numLayers; i++) {
        showPositions(i);
    }
    display("Total crossings: " + totalCrossings());
});

checkCrossings();
while(true) {
    pass++;
    upSweep(numLayers);
    downSweep(numLayers);
    display("Total crossings: " + totalCrossings());
    let quit = promptBoolean("quit?");
    if (quit) {
        break;
    };
}

//load graph state
applyNodePositions(savedPositions);
display( `min pass = ${minPass}, min iteration = ${minIteration}, min crossings = ${minCrossings} `);
