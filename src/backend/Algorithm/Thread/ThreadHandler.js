const {Worker} = require('worker_threads');

module.exports = class ThreadHandler {
    predicate;
    algorithm;
    array;
    worker;
    onMessage;

    constructor(predicate, algorithm, onMessage) {
        this.predicate = predicate;
        this.algorithm = algorithm;
        this.onMessage = onMessage;
        this.array = new Int32Array(new SharedArrayBuffer(1024));
    }

    startThread() {
        this.worker = new Worker('./Thread.js');
        this.worker.postMessage(["shared", this.array]);
        this.worker.postMessage(['algorithm/graph', this.predicate, this.algorithm]);
        this.worker.on("message", message => {
            this.onMessage(message);
        });
    }

    resumeThread() {
        Atomics.store(this.array, 0, 1);
        Atomics.notify(this.array, 0);
    }

    killThread() {
        this.worker.terminate();
    }

    
}

// const worker = new Worker('./Thread.js');
// //console.log('running Threadhandler');
// let predicate = {
//     node: {
//       1: {x:3, y:2},
//       2: {x:1, y:2},
//       3: {x:4, y:2}
//     }
// };

// let buf = new SharedArrayBuffer(1024); 
// let arr = new Int32Array(buf); 

// let algorithm = 'let nodes = getNodes(); nodes.forEach(node => colorNode(red, node, arr);'

// worker.postMessage(["shared", arr]);

// worker.postMessage(['algorithm/graph', predicate, algorithm]);

// worker.on("message", message => {
//     if (message[0]== 'message'){
//         console.log(message[0] + ' ' + message[1]);
//     }
//     else if (message[0] == 'rule') {
//         console.log(message[0] + ' ' + message[1]);
//     }
// });

