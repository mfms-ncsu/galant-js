import { useRef, useEffect } from "react"

/**
 * Creates a modal requesting the user for confirmation.
 * @param {Object} props Props passed to component
 * @param {Object} props.prompt Prompt data for the component
 * @param {string} props.prompt.message The informational message to display
 * @param {string | undefined} props.prompt.confirmationText Text the confirm button should display
 * @param {string | undefined} props.prompt.cancelText Text the cancel button should display 
 * @param {Function} props.callback The function that should be called on submit
 * @returns {React.ReactElement} Modal that prompts the user for confirmation
 */
export default function ConfirmationPrompt({prompt, callback, promptRef}) {
    const button = useRef(null);

    const message = prompt.message;
    const confirmationText = prompt.confirmationText || "Confirm";
    const cancelText = prompt.cancelText || "Cancel";

    useEffect(() => {
        if (!button.current) return;
        function onKeyPress(event) {
            if (event.key !== 'Enter') return;
            button.current.click();
        }
        document.addEventListener('keypress', onKeyPress);
        return () => document.removeEventListener('keypress', onKeyPress);
    }, []);

    return (
        <div id="confirmation-prompt" className="bg-gray-100 p-4 rounded shadow-lg ring-1 ring-gray-200" ref={promptRef}>
            <span className="block text-lg font-semibold">{message}</span>
            <button id="confirmation-prompt-confirm" ref={button} className="w-full py-2 mt-4 rounded-full bg-blue-500 hover:bg-blue-600 transition-all font-semibold text-white" onClick={() => callback(true)}>{confirmationText}</button>
            <button id="confirmation-prompt-cancel" className="w-full mt-1 text-black" onClick={() => callback(false)}>{cancelText}</button>
        </div>
    )
}