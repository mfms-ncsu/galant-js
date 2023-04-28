import './Collection.scss';

import { Link } from 'react-router-dom';

export default function Collection() {
    return <div className="collection">
        <div className="algorithms">
            <h1>Algorithms</h1>
            <p><Link to="/collection/algorithms/dijkstra.js" target="_blank" download>dijkstra.js</Link> - Dijkstra's algorithm</p>
        </div>
        <div className="graphs">
            <h1>Graphs</h1>
            <p><Link to="/collection/graphs/weighted_6.txt" target="_blank" download>weighted_6.txt</Link> - A weighted graph</p>
        </div>
    </div>
}