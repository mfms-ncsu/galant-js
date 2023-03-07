const api = require('./API.js');
const { parentPort } = require("worker_threads");

let sharedBuffer;

parentPort.on("message", message => {
    //console.log(message[0]);
    if (message[0] == 'shared') {
        sharedBuffer = message[1];
        console.log("buffer recieved");
        for (let i = 0; i < 100; i++) {
            console.log(i);
        }
        Atomics.store(sharedBuffer, 1, 1);
        Atomics.notify(sharedBuffer, 1);
    }
    else {
        eval(message[2]);
    }
    
    
    //parentPort.postMessage("Good luck bud");
})

