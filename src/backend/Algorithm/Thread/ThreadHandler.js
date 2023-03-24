//const {Worker} = require('worker_threads');

export default class ThreadHandler {
    graph;
    algorithm;
    array;
    worker;
    onMessage;

    constructor(graph, algorithm, onMessage) {
        console.log("thread init");
        console.log(graph);
        console.log(algorithm);
        console.log(onMessage);
        this.graph = graph;
        this.algorithm = algorithm;
        this.onMessage = onMessage;
        this.array = new Int32Array(new SharedArrayBuffer(1024));
        console.log(this.onMessage);
    }

    startThread() {
        // var response
        // var client = new XMLHttpRequest();
        // client.open('GET', new URL('./Thread.js', import.meta.url));

        let handleMessage = (message) => {
            console.log('message');
            console.log(message.data);
            this.onMessage(message.data);
        }

        let initWorker = () => {
            // response = client.responseText;
            // var blob = new Blob([response], {type: 'application/javascript'});
            // this.worker = new Worker(URL.createObjectURL(blob), { type: "module" });

            this.worker = new Worker(new URL('./Thread.js', import.meta.url));

            this.worker.onmessage = handleMessage;
            this.worker.postMessage(["shared", this.array]);
            console.log("sending message");
            console.log(this.graph);
            console.log(this.algorithm);
            console.log(this.graph.get);
            this.worker.postMessage(['graph/algorithm', this.graph, this.algorithm]);
        }

        initWorker();

        // client.onreadystatechange = initWorker;
        // client.send();    
    }

    resumeThread() {
        Atomics.store(this.array, 0, 1);
        Atomics.notify(this.array, 0);
    }

    killThread() {
        if (this.worker) {
            this.worker.terminate();
        }
    }    
}

// const worker = new Worker('./Thread.js');
// //console.log('running Threadhandler');
// let graph = {
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

// worker.postMessage(['algorithm/graph', graph, algorithm]);

// worker.on("message", message => {
//     if (message[0]== 'message'){
//         console.log(message[0] + ' ' + message[1]);
//     }
//     else if (message[0] == 'rule') {
//         console.log(message[0] + ' ' + message[1]);
//     }
// });

