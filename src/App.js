import './App.scss';
import GraphViewer from './frontend/GraphViewer/GraphViewer';
import { useState } from "react";
import GraphInput from './frontend/GraphInput/GraphInput';

var graph = null;

function App() {
  const [renderGraph, setRenderGraph] = useState(false);

  document.addEventListener("graphUpdated", function( e ) {
    graph = e.detail
    setRenderGraph(true);
  });

  return (
    <div className="App">
      <div className="GraphSide">
        <GraphInput />
        {renderGraph && <GraphViewer predicates={graph}/>}
      </div>
    </div>
  );
}

export default App;