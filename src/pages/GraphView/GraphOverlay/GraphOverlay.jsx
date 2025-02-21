import GraphControlsComponent from "./GraphControls/GraphControlsComponent";
import AlgorithmControls from "./AlgorithmControls/AlgorithmControlsComponent";



export default function GraphOverlay() {

    return (
        <div className="absolute flex flex-col inset-0 bg-transparent pointer-events-none p-4 pt-1">
            <GraphControlsComponent />
            <AlgorithmControls />
        </div>
    )
}