

/**
 * Displays an AlgorithmError based on an Error Object, along with the algorithm code which failed
 * @param {Object} props The props passed to the component
 * @param {Object} props.prompt The prompt object and its data
 * @param {ReferenceError} props.prompt.errorObject The error that was returned
 * @param {string} props.prompt.algorithmCode The code which failed to execute
 * @param {Function} props.callback Callback when the modal is closed.
 * @returns {React.ReactElement} Returns modal displaying error information
 * @author Julian Madrigal
 */
export default function AlgorithmErrorPrompt({prompt, callback}) {
    const errorObject = prompt.errorObject;
    const algorithmCode = prompt.algorithmCode;

    let title, error, code;
    // This next code is from a previous team, but no author reference was found. 
    // if its a timeout error, we've set the line number to -1. And we don't need to do put the line here.
    if (errorObject.lineNumber === -1) {
        title = "Timeout Error. Likely an infine loop."
        error = errorObject.toString();
        code = "Your code took longer than 5 seconds to execute.\nFor technical reasons, we're not able to discern where in your code this occured.\nSorry!";
    } else {
        title = "Error on line " + errorObject.lineNumber;
        error = errorObject.toString();
        // its a regular error, so generate the data to go in the popup.

        let splitAlg = algorithmCode.toString().split(/\r\n|\r|\n/);
        let numLines = splitAlg.length;
        // make sure we offset by enough characters
        let offsetSize = ("" + numLines).length;
        let adjustedAlgText = "";
        splitAlg.forEach(function (line, i) {
            // generate the line number and offset
            // we star the line if it is the bad one
            let starTags = ["  ", "   "]
            // eslint-disable-next-line
            if (i + 1 == errorObject.lineNumber) {
                starTags = ["**", "** "];
            }
            let offset = starTags[0] + ("" + (i + 1)).padStart(offsetSize) + starTags[1]
            adjustedAlgText = adjustedAlgText.concat("\n", offset, line)
        })

        code = adjustedAlgText;
    }

    return (
        <div className="absolute flex items-center justify-center inset-0 z-10 py-8">
            <div className="flex flex-col max-h-full bg-gray-50 p-4 rounded shadow-lg ring-1 ring-gray-200">
                <span className="block text-center text-red-500 font-semibold">{title}</span>
                <span className="block text-center text-red-500">{error}</span>
                <pre className="overflow-auto">{code}</pre>
                <button className="w-full py-2 mt-8 rounded font-semibold bg-blue-500 text-white" onClick={callback}>Okay</button>
            </div>
        </div>
    )
}