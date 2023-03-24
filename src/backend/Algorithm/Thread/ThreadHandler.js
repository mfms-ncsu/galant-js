//const {Worker} = require('worker_threads');

export default class ThreadHandler {
    predicates;
    algorithm;
    array;
    worker;
    onMessage;

    constructor(predicates, algorithm, onMessage) {
        console.log("thread init");
        console.log(predicates);
        console.log(algorithm);
        console.log(onMessage);
        this.predicates = predicates;
        this.algorithm = algorithm;
        this.onMessage = onMessage;
        this.array = new Int32Array(new SharedArrayBuffer(1024));
        console.log(this.onMessage);
    }

    startThread() {
        var response
        var client = new XMLHttpRequest();
        client.open('GET', new URL('./Thread.js', import.meta.url));

        let handleMessage = (message) => {
            console.log('message');
            console.log(message.data);
            this.onMessage(message.data);
        }

        let initWorker = () => {
            response = client.responseText;
            var blob = new Blob([response], {type: 'application/javascript'});
            this.worker = new Worker(URL.createObjectURL(blob), { type: "module" });
            this.worker.onmessage = handleMessage;
            this.worker.postMessage(["shared", this.array]);
            console.log("sending message");
            console.log(this.predicates);
            console.log(this.algorithm);
            console.log(this.predicates.get);
            this.worker.postMessage(['graph/algorithm', this.predicates, this.algorithm]);
        }

        client.onreadystatechange = initWorker;
        client.send();    
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
// let predicates = {
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

// worker.postMessage(['algorithm/graph', predicates, algorithm]);

// worker.on("message", message => {
//     if (message[0]== 'message'){
//         console.log(message[0] + ' ' + message[1]);
//     }
//     else if (message[0] == 'rule') {
//         console.log(message[0] + ' ' + message[1]);
//     }
// });

