/**
 * Test for setting edge weights to their Euclidian distances.
 */

step(() => {
    for ( let edge of getEdges() ) {
        const sourceX = getX(source(edge));
        const sourceY = getY(source(edge));
        const targetX = getX(target(edge));
        const targetY = getY(target(edge));
        const weight = Math.sqrt(Math.pow(sourceX - targetX, 2) + Math.pow(sourceY - targetY, 2));
        setWeight(edge, weight);
    }
    showAllEdgeWeights();
})