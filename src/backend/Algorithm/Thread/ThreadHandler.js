//const {Worker} = require('worker_threads');

export default class ThreadHandler {
    graph;
    algorithm;
    array;
    worker;
    onMessage;

    constructor(graph, algorithm, onMessage) {
        this.graph = graph;
        this.algorithm = algorithm;
        this.onMessage = onMessage;
        this.array = new Int32Array(new SharedArrayBuffer(1024));
    }

    startThread() {
        // var response
        // var client = new XMLHttpRequest();
        // client.open('GET', new URL('./Thread.js', import.meta.url));

        let handleMessage = (message) => {
            this.onMessage(message.data);
        }

        let initWorker = () => {
            // response = client.responseText;
            // var blob = new Blob([response], {type: 'application/javascript'});
            // this.worker = new Worker(URL.createObjectURL(blob), { type: "module" });

            this.worker = new Worker(new URL('./Thread.js', import.meta.url));

            this.worker.onmessage = handleMessage;
            this.worker.postMessage(["shared", this.array]);
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
    
    enterPromptResult(promptResult) {
        let len = Math.min(promptResult.length, 254)
        Atomics.store(this.array, 1, len);
        for (let i = 0; i < len; i++) {
            Atomics.store(this.array, i + 2, promptResult.charCodeAt(i));
        }
        this.resumeThread();
    }
}