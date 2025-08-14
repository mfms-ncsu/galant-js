import PrimaryButton from "components/Buttons/PrimaryButton";

/**
 * Displays an AlgorithmError based on an Error Object
 * 
 * @author Julian Madrigal
 */
export default function AlgorithmErrorPrompt({prompt, callback, promptRef}) {
    // Error object and name
    const errorObject = prompt.errorObject;
    let errorString = `${errorObject.name}: ${errorObject.message}`;
    let title, code;

    // This next code is from a previous team, but no author reference was found. 
    // if its a timeout error, we've set the line number to -1. And we don't need to do put the line here.
    if (errorObject.lineNumber === -1) {
        title = "Timeout Error. Likely an infinite loop."
        code = "Your code took longer than 5 seconds to execute.\nFor technical reasons, we're not able to discern where in your code this occurred.\nSorry!";
    }
    else {
        // Other errors encountered
        title = errorString
        // Do not display stack trace if a syntax error has occurred
        if (title === "SyntaxError") {
            code = "There is an error with the algorithm code in the Algorithm Editor that we cannot identify."
        }
        else {
            let lineNumber = errorObject.lineNumber;
            if (lineNumber) {
                code = `Line number ${errorObject.lineNumber}\n`;
            } else {
                code = "Line number may be after '<anonymous>:' or after 'eval:'.\n You may also check the console for more information.\n\n";
            }
            let errorStack = errorObject.stack;
            if ( errorStack ) {
                // Remove the first line which is the error message
                code += errorStack.split("\n").slice(1).join("\n");
            } else {
                // Fallback if stack trace is not available
                code = "An error occurred, but no stack trace is available.\n";
            }
            // code = "For more information, check the console: Cmd+Alt+I (Mac) or Ctrl+Shift+I (Windows/Linux)"
            // code += "\nand click on the 'Console' tab (may not be necessary)."
            // code += "\nLine number is after '<anonymous>:' or after 'eval:'.";
        }
    }

    return (
        <div className="flex flex-col min-w-[600px] min-h-[400px] max-h-full bg-white shadow-lg p-4 rounded-xl" ref={promptRef}>
            <span className="block text-left text-red-900 font-semibold pointer-events-none select-none text-xl">{title}</span>
            <pre className="overflow-auto text-wrap my-4 text-l flex-1">{code}</pre>
            <PrimaryButton className="mt-auto" onClick={callback}>Okay</PrimaryButton>
        </div>
    )
}
