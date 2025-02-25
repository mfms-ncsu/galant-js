import { useRef, useEffect } from "react"
import PrimaryButton from "components/Buttons/PrimaryButton";
import SecondaryButton from "components/Buttons/SecondaryButton";

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
    const message = prompt.message;
    const confirmationText = prompt.confirmationText || "Confirm";
    const cancelText = prompt.cancelText || "Cancel";

    return (
        <div className="bg-gray-100 p-4 rounded-xl shadow-lg" ref={promptRef}>
            <span className="block text-lg font-semibold">{message}</span>
            <PrimaryButton onClick={() => callback(true)}>{confirmationText}</PrimaryButton>
            <SecondaryButton onClick={() => callback(false)}>{cancelText}</SecondaryButton>
        </div>
    )
}