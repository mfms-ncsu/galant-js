/**
 * Simulation of a deterministic finite automaton
 *  states = nodes
 *  transitions = labeled edges
 *     each label is a list of comma-separated symbols
 *  User specifies a start state and an input string; final states atr left to the imagination of the user
 */

let transition_table = {}

function init_transitions() {
    for ( let state of getNodes() ) {
        transition_table[state] = {}
        for ( let transition of outgoing(state) ) {
            let label = getLabel(transition);
            let symbols = label.split(",");
            for ( let symbol of symbols ) {
                // Remove whitespace from the symbol
                symbol = symbol.trim();
                transition_table[state][symbol] = transition;
            }
        }
    }
}

setDirected(true)
init_transitions();
let start_state = promptNode("Enter the start state:");
let input_string = prompt("Enter the input string:");

let remaining_string = input_string;
let read_so_far = "";
let current_state = start_state;
let transition = null
highlight(start_state)
while (remaining_string.length > 0) {
    step(() => {
        unhighlight(current_state)
        if (transition) {
            unhighlight(transition)
            uncolor(transition)
        }
    })
    let current_symbol = remaining_string[0];
    remaining_string = remaining_string.slice(1);
    read_so_far += current_symbol;

    if ( transition_table[current_state] && transition_table[current_state][current_symbol] ) {
        transition = transition_table[current_state][current_symbol];
        current_state = target(transition);
        console.log(`Transitioning from ${current_state} to ${target(transition)} on symbol '${current_symbol}'`);
    } else {
        console.log(`No transition found for state ${current_state} on symbol '${current_symbol}'`);
        break;
    }
    step(() => {
        highlight(current_state);
        highlight(transition);
        color(transition, "green");
        display(`Read so far: ${read_so_far}, Remaining string: ${remaining_string}`);
    });
}