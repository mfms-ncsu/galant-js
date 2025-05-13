/**
 * A fun way to illustrate node movement. The graph shaped into a disk and spun around.
 */

Algorithm.configure({
    controlNodePosition: true
})

function getCoordinate(angle) {
    const x= 300 * Math.sin(angle);
    const y= 100 * Math.cos(angle);
    return {x, y};
}

const nodeIds = getNodes();
const numNodes = getNumberOfNodes();
const angleIncrement = 2 * Math.PI / numNodes;

let i = 0;
step(() =>
    {
        for (const nodeId of nodeIds) {
            const newPosition = getCoordinate(i * angleIncrement);
            setPosition(nodeId, newPosition);
            i++;
        }
    }
)

for (let i = 0; true; i+=0.05) {
    let currentNodeIndex = 0;
    step(() => {
        for (const nodeId of nodeIds) {
            const newPosition = getCoordinate(i + currentNodeIndex * angleIncrement);
            setPosition(nodeId, newPosition);
            currentNodeIndex++;
        }
    });
}
