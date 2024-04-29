import { useState } from "react"


/**
 * Creates a modal requesting the user for input.
 * @param {Object} props Props passed to component
 * @param {Object} props.prompt Prompt data for the component
 * @param {string} props.label The label displayed for the requested input.
 * @param {Function} props.callback The function that should be called on submit
 * @returns {React.ReactElement} Modal that prompts the user for input
 */
export default function InputPrompt({prompt, callback}) {
    const [inputValue, setInputValue] = useState('');

    function onEnterPressed(event) {
        if (event.key !== 'Enter') return;
        callback(inputValue);
    }

    return (
        <div className="absolute flex items-center justify-center inset-0 z-50">
            <div className="bg-gray-100 p-4 rounded shadow-lg ring-1 ring-gray-200">
                <span className="block text-lg font-semibold">{prompt.label}</span>
                <input className="block h-8 p-2 mt-4 rounded" value={inputValue} onChange={(event) => setInputValue(event.target.value)} onKeyDown={onEnterPressed} autoFocus />
                <button className="w-full py-2 mt-4 rounded bg-gradient-to-r from-blue-500 to-indigo-500 font-semibold text-white" onClick={() => callback(inputValue)}>Submit</button>
            </div>
        </div>
    )
}