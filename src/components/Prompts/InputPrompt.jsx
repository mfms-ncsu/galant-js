import { useState } from "react"
import PrimaryButton from "components/Buttons/PrimaryButton";


/**
 * Creates a modal requesting the user for input.
 */
export default function InputPrompt({prompt, callback, promptRef}) {
    const [inputValue, setInputValue] = useState('');

    function onEnterPressed(event) {
        if (event.key !== 'Enter') return;
        callback(inputValue);
    }

    return (
        <div className="bg-white shadow-lg p-4 rounded-xl" ref={promptRef}>
            <span className="block text-lg font-semibold pointer-events-none select-none">{prompt.label}</span>
            <input className="block h-8 w-full p-2 my-4 rounded bg-gray-200" value={inputValue} onChange={(event) => setInputValue(event.target.value)} onKeyDown={onEnterPressed} autoFocus />
            <PrimaryButton onClick={() => callback(inputValue)}>Submit</PrimaryButton>
        </div>
    );
}