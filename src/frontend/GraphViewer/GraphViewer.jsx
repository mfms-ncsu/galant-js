import './GraphViewer.css';

import React, {Component} from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

/**
 * 
 */
class GraphViewer extends Component {
	/**
	 * 
	 * @returns 
	 */
	constructor() {
		super()
		console.log("constructed");
		this.state = {name: "preset"}; // testing a button to change layouts, this does not work yet
	}

	render = function() {
		// let elements = convertPredicates(this.props.predicates);
		const elements = [
			{ data: { id: 'one', label: 'one', parent: 'one_label'}, position: { x: 0, y: 0 }},
			{ data: { id: 'one_label', label: 'Node 1'}, classes: ['label']},

			{ data: { id: 'two', label: 'two', parent: 'two_label'}, position: { x: 200, y: 0 }, style: {'background-color': 'red'}  },
			{ data: { id: 'two_label', label: 'Node 2'}, classes: ['label']},
			// why does this not make the edge directed?
			{ data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2'}, style: {'target-arrow-shape': 'triangle'}},
		];

		return (
			<div className="GraphViewer">
				<button onClick={() => this.state.name = ""}>{this.state.name}</button>
				<CytoscapeComponent elements={elements}
					layout={{
						name: this.state.name,
					}}
					stylesheet={[
						{
							selector: 'node',
							style: {
								'width': '50px',
								'height': '50px',
								'background-color': 'white',
								'border-width': '5px',
								'border-style': 'solid',
								'border-color': 'black',
								'label': 'data(label)',
								'text-valign': 'center',
							}
						},	
						{
							selector: 'node.label',
							style: {
								'border-width': '0px',
								'text-valign': 'top',
							}
						},		
						{
							selector: 'edge',
							style: {
								'width': '5px',
								'line-color': 'black',
								'target-arrow-color': 'black',
								'target-arrow-shape': 'triangle',
							}
						},
					]}
					minZoom={1.0}
					autounselectify={true}
				/>
			</div>
		);
	}
}

export default GraphViewer;