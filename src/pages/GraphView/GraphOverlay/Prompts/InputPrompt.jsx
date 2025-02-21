import { useState, useRef } from "react"


/**
 * Creates a modal requesting the user for input.
 * @param {Object} props Props passed to component
 * @param {Object} props.prompt Prompt data for the component
 * @param {string} props.label The label displayed for the requested input.
 * @param {Function} props.callback The function that should be called on submit
 * @returns {React.ReactElement} Modal that prompts the user for input
 */
export default function InputPrompt({prompt, callback, promptRef}) {
    const [inputValue, setInputValue] = useState('');

    function onEnterPressed(event) {
        if (event.key !== 'Enter') return;
        callback(inputValue);
    }

    return (
        <div className="bg-gray-100 p-4 rounded-xl" ref={promptRef}>
            <span className="block text-lg font-semibold pointer-events-none select-none">{prompt.label}</span>
            <input className="block h-8 w-full p-2 my-4 rounded" value={inputValue} onChange={(event) => setInputValue(event.target.value)} onKeyDown={onEnterPressed} autoFocus />
            <button className="w-full py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-all font-semibold text-white" onClick={() => callback(inputValue)}>Submit</button>
        </div>
    )
}