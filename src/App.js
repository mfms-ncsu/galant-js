import './App.scss';
import GraphViewer from './frontend/GraphViewer/GraphViewer';
import { useState } from "react";
import GraphInput from './frontend/GraphInput/GraphInput';
//import graph from './backend/FileToPredicate';


function App() {
  const [renderGraph, setRenderGraph] = useState(false);
  const [graph, setGraph] = useState({});

  return (
    <div className="App">
      <div className="GraphSide">
        <GraphInput handleChange={setGraph}/>
        <GraphViewer predicates={graph}/>
      </div>
    </div>
  );
}

export default App;