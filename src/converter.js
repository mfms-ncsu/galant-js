import React, {Component} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

class Converter extends Component {
    


    render = () => {
        //Get the predicate after it has been parsed
        let predicate = this.props.value;
        
        //A predicate will have up to three objects, nodes, undirected edges, and directed edges
        let nodes = predicate['node'];
        let undirected = predicate['undirected'];
        let directed = predicate['directed'];

        //Holds all the formats for the graph
        let elements = [];

        //:ooops through every key in the nodes dictionary
        for (let ident in nodes) {
            //Grabs the node object
            let node = nodes[ident];

            //Creates an object that is formatted to the graph display format
            let element = {
                data: {
                    //All nodes will have an id and a parent identity filed
                    id: ident,
                    marked: false,
                    label: '',
                    highlighted: false,
                    weight: null,
                    color: 'black'
                },
                //All nodes will have a position
                position: {}
                
            }
            
            //Loop through all the keys in the node
            for (let key in node) {
                //x and y coordinates are held in a seperate dictionary in the element object
                if (key === 'x' || key === 'y') {
                    element.position[key] = node[key];
                }
                else {
                    //All other key value paris will transfer to the element object in the data
                    element.data[key] = node[key];
                }
            }
            // //If color is not specified set it to black
            // if (!element.data['color']) {
            //     element.data['color'] = 'black';
            // }

            // //Creates an object in the graph format for a box
            // let box = {
            //     data: {
            //         //Box will have the id of id + ' label' of the parent node plus a label
            //         id: ident + ' label',
            //         label: ''
            //     },
            //     //Specifies a style class for formatting the label
            //     classes: ['label']
            // }

            // //Logic for displaying a label on the box whether it has a label or weight
            // if (element.data['label']) {
            //     if (element.data['weight']) {
            //         box.data.label = element.data.weight + '\n' + element.data.label;
            //     }
            //     else {
            //         box.data.label = '\n' + element.data.label;
            //     }
            // }
            // else {
            //     if (element.data['weight']) {
            //         box.data.label = element.data.weight + '\n';
            //     }
            // }
            
            //Adds them to the list of elements
            elements.push(element);
            //elements.push(box);


        }
        
       
        //Loops through all keys inside of the undirected edges
        for (let id in undirected) {
            //Gets the undirected edge
            let undirect = undirected[id];

            //Specifies the format for a graph object to display edges
            let element = {
                data: {
                    label: ''
                }
            }

            //Loops through all keys inside of the edge
            for (let key in undirect) {
                //If the predicate for an edge has a weight add it to the label to be displayed
                if (key === 'weight') {
                    element.data.label = undirect[key] + '\n';
                }
                //Transfer all other key value pairs to the edge
                else {
                    element.data[key] = undirect[key];
                }
            }

            //Add the edge to the list of elements
            elements.push(element);
        }

        ////Loops through all keys inside of the directed edges
        for (let id in directed) {
            //Gets the directed edge
            let direct = directed[id];

            //Specifies the format for a graph object to display edges
            let element = {
                data: {
                    label: ''
                },
                //Specifies a style class for formatting directed edges
                classes: ['directed']
            }

            //Loops through all keys inside of the edge
            for (let key in direct) {
                //If the predicate for an edge has a weight add it to the label to be displayed
                if (key === 'weight') {
                    element.data.label = direct[key] + '\n';
                }
                //Transfer all other key value pairs to the edge
                else {
                    element.data[key] = direct[key];
                }
            }
             //Add the edge to the list of elements
            elements.push(element);

        }
        console.log(elements);

        return (
            <div>
            
            </div>
        );
    }
}

export  default Converter;