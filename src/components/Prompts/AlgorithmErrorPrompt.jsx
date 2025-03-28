import PrimaryButton from "components/Buttons/PrimaryButton";

/**
 * Displays an AlgorithmError based on an Error Object, along with the algorithm code which failed
 * 
 * @author Julian Madrigal
 */
export default function AlgorithmErrorPrompt({prompt, callback, promptRef}) {
    const errorObject = prompt.errorObject;
    const algorithmCode = prompt.algorithmCode;

    let title, error, code;
    // This next code is from a previous team, but no author reference was found. 
    // if its a timeout error, we've set the line number to -1. And we don't need to do put the line here.
    if (errorObject.lineNumber === -1) {
        title = "Timeout Error. Likely an infinite loop."
        error = errorObject.toString();
        code = "Your code took longer than 5 seconds to execute.\nFor technical reasons, we're not able to discern where in your code this occured.\nSorry!";
    }

    return (
        <div className="flex flex-col max-h-full bg-white shadow-lg p-4 rounded-xl" ref={promptRef}>
            <span className="block text-center text-red-500 font-semibold pointer-events-none select-none">{"Error"}</span>
            <pre className="overflow-auto text-wrap my-4">{errorObject.stack}</pre>
            <PrimaryButton onClick={callback}>Okay</PrimaryButton>
        </div>
    )
}
