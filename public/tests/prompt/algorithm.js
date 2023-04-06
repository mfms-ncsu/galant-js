let message = prompt("Enter a message:");
display(message);

let bool = promptBoolean("Enter true/false:");
if (bool) {
    display("You entered true");
} else {
    display("You entered false");
}

let integer = promptInteger("Enter an integer:");
for (let i = 0; i <= integer; i++) {
    print(i);
}
display(`Counted to ${integer}`);

let number = promptNumber("Enter a number:");
let sum = integer + number;
display(`The sum of ${integer} and ${number} is ${sum}`);

let node = promptNode("Enter a node:");
mark(node);

let edge = promptEdge("Enter an edge:");
let c = promptFrom("Enter a color:", ["red", "green", "blue"]);
color(edge, c);