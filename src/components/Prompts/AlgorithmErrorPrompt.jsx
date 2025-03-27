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
        title = "Timeout Error. Likely an infine loop."
        error = errorObject.toString();
        code = "Your code took longer than 5 seconds to execute.\nFor technical reasons, we're not able to discern where in your code this occured.\nSorry!";
    } else {
        

        let errArr = errorObject.stack.split("\n")[0].split(":");
        let errNum = parseInt(errArr[errArr.length - 2]);

        title = "Error on line " + errNum;
        error = errorObject.toString();
        // its a regular error, so generate the data to go in the popup.

        let splitAlg = algorithmCode.toString().split(/\r\n|\r|\n/);
        let numLines = splitAlg.length;
        // make sure we offset by enough characters
        let offsetSize = ("" + numLines).length;
        let adjustedAlgText = "";
        splitAlg.forEach((line, i) =>{
            // generate the line number and offset
            // we star the line if it is the bad one
            let starTags = ["  ", "   "]
            // eslint-disable-next-line
            if (i === errNum-1) {
                starTags = ["**", "** "];
            }
            let offset = starTags[0] + ("" + (i + 1)).padStart(offsetSize) + starTags[1]
            adjustedAlgText = adjustedAlgText.concat("\n", offset, line)
        });

        code = adjustedAlgText;
    }

    return (
        <div className="flex flex-col max-h-full bg-white shadow-lg p-4 rounded-xl" ref={promptRef}>
            <span className="block text-center text-red-500 font-semibold pointer-events-none select-none">{title}</span>
            <span className="block text-center text-red-500 pointer-events-none select-none">{error}</span>
            <pre className="overflow-auto my-4">{code}</pre>
            <PrimaryButton onClick={callback}>Okay</PrimaryButton>
        </div>
    )
}
