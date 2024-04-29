import { useEffect, useState, useContext } from "react"
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

    // If there's no current prompt, return null
    if (!currentPrompt) return null;
    
   
    const TypeComponent = typeMapping[currentPrompt.data.type];
    
    // Throw an error if the TypeComponent is not found
    if (!TypeComponent) {
        throw new Error(`Received a Prompt with an invalid type attribute ${currentPrompt.data.type}`);
    }

    
    return <TypeComponent prompt={currentPrompt.data} callback={onCallback} />;
}
