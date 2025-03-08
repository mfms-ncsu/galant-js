import { useState, useRef } from "react"
import { useAtom } from "jotai";
import { promptAtom, promptQueueAtom } from "states/_atoms/atoms";
import PromptInterface from "interfaces/PromptInterface/PromptInterface";
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
 * PromptComponent renders the appropriate prompt based on the type current prompt
 * at the front of the prompt queue.
 */
export default function PromptComponent() {
    const [promptQueue, setPromptQueue] = useAtom(promptQueueAtom);
    const [prompt] = useAtom(promptAtom);
    const [dragPosition, setDragPosition] = useState({ x: 50, y: 50 });
    const promptRef = useRef();

    /**
     * Function to handle the callback from the prompt component.
     * @param {any} value The value passed from the prompt component.
     */
    function onCallback(value) {
        // Run the callback
        prompt.callback(value);

        // Dequeue the prompt
        setPromptQueue(PromptInterface.dequeuePrompt(promptQueue));
    }

    let promptX, promptY; // Store the location within the prompt being clicked here
    function onMouseDown(event) {
        if (event.target !== promptRef.current) return;
        let pos = event.target.getBoundingClientRect();
        promptX = event.pageX - pos.x;
        promptY = event.pageY - pos.y;
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
            x: event.pageX - promptX,
            y: event.pageY - promptY
        });
        event.stopPropagation();
        event.preventDefault();
    }

    if (!prompt) return null;
    const TypeComponent = typeMapping[prompt.data.type];
    if (!TypeComponent) {
        throw new Error(`Received a Prompt with an invalid type attribute ${prompt.data.type}`);
    }

    return (
        <div className="relative z-50">
            <div className="max-w-lg h-fit absolute active:cursor-move" style={{"top": dragPosition.y, "left": dragPosition.x}} onMouseDown={onMouseDown}>
                <TypeComponent prompt={prompt.data} callback={onCallback} promptRef={promptRef} />
            </div>
        </div>
    );
}
