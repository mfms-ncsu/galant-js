const ThreadHandler = require("./ThreadHandler");

let predicate = {
    node: {
      1: {x:3, y:2},
      2: {x:1, y:2},
      3: {x:4, y:2}
    }
};

let algorithm = 'for (let i = 0; i < 10000; i++) {i++;} colorNode(1, "green"); for (let i = 0; i < 10000; i++) {i++;} testSomething(\'This has finished the third array\');';

let onMessage = function(message) {
    console.log(message);
    for (let i = 0; i < 10000000000; i++) {
        i++;
    }
    console.log('finished tester array.')
    handler.resumeThread();
}

let handler = new ThreadHandler(predicate, algorithm, onMessage);

handler.startThread();


