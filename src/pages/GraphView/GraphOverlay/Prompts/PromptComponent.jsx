import { useEffect, useState, useContext, useRef } from "react"
import { PromptContext } from "pages/GraphView/utils/PromptService";
import AlgorithmErrorPrompt from "./AlgorithmErrorPrompt";
import InputPrompt from "./InputPrompt";
import ConfirmationPrompt from "./ConfirmationPrompt";

// Mapping of prompt types to their corresponding components
const typeMapping = {
    'input': InputPrompt,
    'algorithmError': AlgorithmErrorPrompt,
    'confirmation': ConfirmationPrompt
}

/**
 * PromptComponent renders the appropriate prompt based on the type received from the PromptService.
 * @returns {JSX.Element|null} - Returns the JSX for PromptComponent or null if no prompt is available.
 */
export default function PromptComponent() {
    const PromptService = useContext(PromptContext);
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [promptPosition, setPromptPosition] = useState({x: 0, y: 0});
    const [dragPosition, setDragPosition] = useState({ x: 50, y: 50 });
    const promptRef = useRef();

    useEffect(() => {
        if (currentPrompt) return; // Do nothing if there's already a current prompt
        const prompt = PromptService.getNextPrompt(); // Get the next prompt from the PromptService
        if (prompt) setCurrentPrompt(prompt); // Set the current prompt if there's any
    }, [PromptService, PromptService.queue, currentPrompt]);

    /**
     * Function to handle the callback from the prompt component.
     * @param {*} value - The value passed from the prompt component.
     */
    function onCallback(value) {
        currentPrompt.callback(value); 
        setCurrentPrompt(null); 
    }

    function onMouseDown(event) {
        if (event.target !== promptRef.current) return;
        let pos = event.target.getBoundingClientRect();
        setPromptPosition({
            x: event.pageX - pos.x,
            y: event.pageY - pos.y
        });
        event.stopPropagation();
        event.preventDefault();
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseUp(event) {
        event.stopPropagation();
        event.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(event) {
        if (event.target !== promptRef.current) return;
        setDragPosition({
            x: event.pageX - promptPosition.x,
            y: event.pageY - promptPosition.y
        });
        event.stopPropagation();
        event.preventDefault();
    }

    if (!currentPrompt) return null;
    const TypeComponent = typeMapping[currentPrompt.data.type];
    if (!TypeComponent) {
        throw new Error(`Received a Prompt with an invalid type attribute ${currentPrompt.data.type}`);
    }

    return (
        <div className="relative z-50">
            <div className="max-w-lg h-fit absolute active:cursor-move" style={{"top": dragPosition.y, "left": dragPosition.x}} onMouseDown={onMouseDown}>
                <TypeComponent prompt={currentPrompt.data} callback={onCallback} promptRef={promptRef} />
            </div>
        </div>
    );
}
