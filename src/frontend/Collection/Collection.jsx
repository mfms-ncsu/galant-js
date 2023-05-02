import './Collection.scss';

import { Link } from 'react-router-dom';

export default function Collection() {
    return <div className="collection">
        To use these, download them to your device and then upload them from the main Galant window.
        <div className="algorithms">
            <h1>Algorithms</h1>
            <p><Link to="/collection/algorithms/dijkstra.js" target="_blank" download>dijkstra.js</Link> - Dijkstra's algorithm</p>
        </div>
        <div className="graphs">
            <h1>Graphs</h1>
            <p><Link to="/collection/graphs/weighted_6.txt" target="_blank" download>weighted_6.txt</Link> - A weighted graph with 6 nodes;
            exhibits different behavior from Dijkstra's algorithm depending on whether directed or undirected.
            </p>
        </div>
    </div>
}