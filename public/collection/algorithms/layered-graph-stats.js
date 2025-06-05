/**
 * A layered graph algorithm with one step. It simply reports all measures.
 */
let total = totalCrossings()
let bottleneck = bottleneckCrossings()
let nonverticality =  totalNonVerticality()
let bottleneck_verticality = bottleneckVerticality()
display(`total crossings = ${total}, bottleneck crossings = ${bottleneck}
    , nonverticality = ${nonverticality}
    , bottleneck verticality = ${bottleneck_verticality}`)