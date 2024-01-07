import './Collection.scss';

import { Link } from 'react-router-dom';

export default function Collection() {
    return <div className="collection">
        To use these graphs and algorithms download them to your device and then upload them from the main Galant window.
        <div className="algorithms">
            <h1>Algorithms</h1>
            <p><Link to="/collection/algorithms/bfs.js" target="_blank" download>bfs.js</Link>
             - breadth-first search</p>
             <p><Link to="/collection/algorithms/dfs.js" target="_blank" download>dfs.js</Link>
             - depth-first search</p>
            <p><Link to="/collection/algorithms/dijkstra.js" target="_blank" download>dijkstra.js</Link>
             - Dijkstra's shortest paths algorithm</p>
            <p><Link to="/collection/algorithms/kruskal.js" target="_blank" download>kruskal.js</Link>
             - Kruskal's minimum spanning tree algorithm</p>
        </div>
        <div className="graphs">
            <h1>Graphs</h1>
            <h2>Unweighted</h2>
            <p><Link to="/collection/graphs/unweighted_10.txt" target="_blank" download>unweighted_10.txt</Link>
             - an unweighted graph with 10 nodes; good example for bfs and dfs, directed or undirected
             </p>
             <p><Link to="/collection/graphs/valid_graph_ncsu.txt" target="_blank" download>valid_graph_ncsu.txt</Link>
             - a graph designed to look like the NCSU logo
             </p>
             <p><Link to="/collection/graphs/small.txt" target="_blank" download>small.txt</Link>
             - another unweighted graph with 10 nodes, arranged in layers;
             all edges are directed downward [for future use with layered graph algorithms]
             </p>

            <h2>Weighted</h2>
            <p><Link to="/collection/graphs/map.txt" target="_blank" download>map.txt</Link>
             - map showing cities in North Carolina
             </p>
            <p><Link to="/collection/graphs/weighted_6.txt" target="_blank" download>weighted_6.txt</Link>
             - a weighted graph with 6 nodes;
            exhibits different behavior from Dijkstra's algorithm depending on whether directed or undirected.
            </p>
            <p><Link to="/collection/graphs/weighted_7.txt" target="_blank" download>weighted_7.txt</Link>
             - a weighted graph with 7 nodes
             </p>
             <p><Link to="/collection/graphs/rand_7.txt" target="_blank" download>rand_7.txt</Link>
             - another weighted graph with 7 nodes; positions are "random"
              to illustrate Auto-Layout feature
            </p>
        </div>
    </div>
}
