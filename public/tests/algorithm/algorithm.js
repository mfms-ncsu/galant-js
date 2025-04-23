let nodeIds = getNodes();
step(() => {
    setPosition(nodeIds[0], 0, 0);
    setPosition(nodeIds[1], 1, 0);
    setPosition(nodeIds[2], 2, 0);
})

step(() => {
    setPosition(nodeIds[0], 2, 0);
    setPosition(nodeIds[2], 0, 0);
})

step(() => {
    setPosition(nodeIds[0], 1, 0);
    setPosition(nodeIds[1], 2, 0);
})