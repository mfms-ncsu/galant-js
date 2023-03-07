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
arr[0] = 0;
console.log("initial value in arr[0]", arr[0]);
worker.postMessage(["shared", arr]);

console.log("about to change and notify")
Atomics.store(arr, 0, 1);
Atomics.notify(arr, 0);

console.log('sending predicate and algorithm now', arr[1]);
worker.postMessage(['run this thang', predicate, algorithm]);

worker.on("message", message => {
    //console.log(message);
});

