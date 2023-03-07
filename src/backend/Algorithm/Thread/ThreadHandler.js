const {Worker} = require('worker_threads');

const worker = new Worker('./Thread.js');
//console.log('running Threadhandler');
let predicate = {
    node: {
      1: {x:3, y:2},
      2: {x:1, y:2},
      3: {x:4, y:2}
    }
};

let buf = new SharedArrayBuffer(1024); 
let arr = new Int32Array(buf); 

let algorithm = 'console.log(\'this somehow works \'); api.getNodes();'
//console.log(algorithm);
console.log("initial value in arr[1]", arr[1]);
worker.postMessage(["shared", arr]);

Atomics.wait(arr, 1, 0);
console.log('sending predicate and algorithm now', arr[1]);
worker.postMessage(['pred and alg',predicate, algorithm]);

worker.on("message", message => {
    //console.log(message);
});

