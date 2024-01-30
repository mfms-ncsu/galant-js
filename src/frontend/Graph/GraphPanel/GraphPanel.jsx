import React from 'react';
import Graph from "backend/Graph/Graph.js";
import GraphContext from 'frontend/GraphContext';
import { useContext, useRef } from 'react';

/**
 * This component creates a Graph Panel that allows the user to change certain graph properties
 * dynamically. Things such as Node radius size can be changed by the user in the graph.
 *
 * @param {Object} props - The React properties of the component include:
 *
 * @returns {HTML} - The HTML representation of the component.
 *
 * @author Sudhanshu Moghe
 */
const GraphPanel = (props) => {
  const { graph, startGraph, loadGraph, registerOnLoad } = useContext(GraphContext);


  return (
    <div className="GraphPanel">
      <div className="container">
        <label> Node Radius Size: </label>
        <input
          type="number"
          value={props.nodeSize}
          onChange={e => { const newSize = parseInt(e.target.value, 10); props.handleRadiusChange(newSize) }}
          className="form-control"
        />
        <br />
        <label> Graph Controls: </label>
        <br />
        <button onClick={() => {
          props.setNodeWeights(!props.nodeWeights)
        }}>{props.nodeWeights === null ? "Node Weight Toggle" : props.nodeWeights ? "Hide Node Weights" : "Show Node Weights"} </button>
        <br />
        <button onClick={() => {
          props.setNodeLabels(!props.nodeLabels)
        }}>{props.nodeLabels === null ? "Node Label Toggle" : props.nodeLabels ? "Hide Node Labels" : "Show Node Labels"} </button>
        <br />
        <button onClick={() => {
          props.setEdgeWeights(!props.edgeWeights)
        }}>{props.edgeWeights === null ? "Edge Weight Toggle" : props.edgeWeights ? "Hide Edge Weights" : "Show Edge Weights"} </button>
        <br />
        <button onClick={() => {
          props.setEdgeLabels(!props.edgeLabels)
        }}>{props.edgeLabels === null ? "Edge Label Toggle" : props.edgeLabels ? "Hide Edge Labels" : "Show Edge Labels"} </button>
        <br />
        <div className='EdgeToggler'>
          <button onClick={() => {
            let newGraph = new Graph(startGraph.nodes, startGraph.edges, !startGraph.directed, startGraph.message);
            loadGraph(newGraph);
          }}>{graph.directed ? "Make Undirected" : "Make Directed"} </button>
        </div>
        <br />
        <label>View Controls: </label>
        {/* Button controls that allow the graph layout and camera to be updated. */}
        <div className="GraphViewerControls">
          <button onClick={() => { // Automatically lay out the graph with the cose-bilkent layout.
            // Note that layouts are only executed when they change, so we must first change
            // the layout to "preset" and then schedule it to be changed back.
            props.setLayout("preset");
            window.setTimeout(() => props.setLayout("cose-bilkent"), 0);
          }}>{"Auto-Layout"}</button>
          <br />
          <button onClick={() => { // Automatically recenter the camera.
            if (props.cytoscape) {
              props.cytoscape.fit();
              props.cytoscape.zoom(props.cytoscape.zoom() * 0.85);
              props.cytoscape.center();
              props.cytoscape.panBy({ x: 0, y: 13 });
            }
          }}>{"Auto-Camera"}</button>
        </div>

      </div>
    </div>
  );
};

export default GraphPanel;
