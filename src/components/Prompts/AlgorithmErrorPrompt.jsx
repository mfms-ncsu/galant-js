import PrimaryButton from "components/Buttons/PrimaryButton";

/**
 * Displays an AlgorithmError based on an Error Object
 * 
 * @author Julian Madrigal
 */
export default function AlgorithmErrorPrompt({prompt, callback, promptRef}) {
    // Error object and name
    const errorObject = prompt.errorObject;
    let errorName = errorObject.stack.split("\n")[0].split(":")[0]
    
    let title, code;

    // This next code is from a previous team, but no author reference was found. 
    // if its a timeout error, we've set the line number to -1. And we don't need to do put the line here.
    if (errorObject.lineNumber === -1) {
        title = "Timeout Error. Likely an infinite loop."
        code = "Your code took longer than 5 seconds to execute.\nFor technical reasons, we're not able to discern where in your code this occurred.\nSorry!";
    }
    else {
        // Other errors encountered
        title = errorName
        // Do not display stack trace if a syntax error has occurred
        if (title === "SyntaxError") {
            code = "There is an error with the algorithm code in the Algorithm Editor that we cannot identify."
        }
        else {
            code = errorObject.stack
        }
    }

    return (
        <div className="flex flex-col min-w-[550px] min-h-[270px] max-h-full bg-white shadow-lg p-4 rounded-xl" ref={promptRef}>
            <span className="block text-center text-red-500 font-semibold pointer-events-none select-none text-xl">{title}</span>
            <pre className="overflow-auto text-wrap my-4 text-xl flex-1">{code}</pre>
            <PrimaryButton className="mt-auto" onClick={callback}>Okay</PrimaryButton>
        </div>
    )
}
