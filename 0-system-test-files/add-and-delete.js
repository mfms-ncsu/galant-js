/**
 * Does a mix of addition and deletion of nodes to check correct behavior
 * of incident edges and the nodeList
 */
display("starting") 
const x = addNode(1,1)
display(`added node ${x}`)
const y = addNode(1,2)
display(`added node ${y}`)
const z = addNode(2,2)
display(`added node ${z}`)
const e = addEdge(x, y)
display(`added edge ${e}`)
const f = addEdge(x, z)
const g = addEdge(y, z)
deleteNode(x)
const w = addNode(3,3)
const h = addEdge(w, z)
deleteNode(y)
deleteNode(z)
