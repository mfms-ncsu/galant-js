/**
 * A layered graph algorithm with one step. It simply reports all measures:
 *  - total number of edge crossings
 *  - bottleneck crossings = maximum number of crossings for any edge
 *  - nonverticality = total amount by which edges deviate from vertical
 *  - bottleneck verticality = maximum amount of deviation for any edge
 *  - deviation of edge vw = (x-coord(v) - x-coord(w))^2
 */
const total = totalCrossings()
const bottleneck = bottleneckCrossings()
const nonverticality =  totalNonVerticality()
const bottleneck_verticality = bottleneckVerticality()
display(`total crossings = ${total}, bottleneck crossings = ${bottleneck}
    , nonverticality = ${nonverticality}
    , bottleneck verticality = ${bottleneck_verticality}`)
