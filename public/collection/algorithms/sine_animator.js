/**
 * Another fun way to illustrate node movement. Nodes are moved into a sine wave and then undulated.
 */
Algorithm.configure({
    controlNodePosition: true
})

const xDistanceBetween = 50;
const yDistance = 50;

function getYCoordinate(x) {
    return yDistance * Math.sin(x/100);
}

const nodeIds = getNodes();

let i = 0;
step(() =>
    {
        for ( const nodeId of nodeIds ) {
            const newPosition = {x: i, y: getYCoordinate(i)};
            setPosition(nodeId, newPosition);
            i += xDistanceBetween;
        }
    }
)

for ( let inc = 1; true; inc+= 50) {
    step(() => {
        let i = 0;
        for ( const nodeId of nodeIds ) {
            const newPosition = {x: i, y: getYCoordinate(i+inc)};
            setPosition(nodeId, newPosition);
            i+=xDistanceBetween;
        }
    })
}
