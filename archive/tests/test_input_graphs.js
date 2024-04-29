/**
 * @jest-environment-options { "resources": "usable" }
 */

/**
 * This file tests the input of all existing test_files and checks that an appropriate error or no error appears on the page.
 * These tests DO NOT look at the actual visual output of the graph.
 * @author ysherma
 */
import {cleanup, fireEvent, render, waitFor, screen, getByTestId} from '@testing-library/react';
import userEvnet from '@testing-library/user-event'
import GraphInput from 'pages/GraphEditor/Oldindex.jsx';
import { readFileSync, readdirSync, readdir } from 'fs';

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

/**
 * Takes a filename and returns a JavaScript File object containing the contents of that file pulled from the src/__tests__/test_files folder
 * If the given file doesn't exist, this function returns null.
 * @param {string} filename - name of file in the test_files folder
 */
function getFile(filename) {
    const path = "src/__tests__/test_files/" + filename;
    try {
        const fileContents = readFileSync(path, "utf8", function() {
            return data;
        });
        let file = new File([fileContents], path.split('/').slice(-1)[0])
        let text = fileContents
        return {file, text}
    } catch (error) {
        return null;
    }
}

test('<GraphInput /> renders with a filePicker input', () => {
    const {getByLabelText, getByRole} = render(<GraphInput />);
    const input = getByLabelText("Upload Graph");
    expect(input).toBeInTheDocument();
    expect(getByRole('textbox')).toBeEmptyDOMElement
});

var testFiles = readdirSync("src/__tests__/test_files/");
var invalidTestFiles = [testFiles.filter(element => element.split('_')[0] === 'invalid')[0]]
var validTestFiles = testFiles.filter(element => element.split('_')[0] === 'valid')
var errorMessages = {
    "invalid_graph_node_no_id.txt": "Incorrect node format, ID: ''",
    "invalid_graph_duplicate_key.txt": "Duplicate key-value pair: 'color:blue'",
    "invalid_graph_duplicate_node_ids.txt": "Duplicate node ID: '1'",
    "invalid_graph_edge_no_target.txt": "Incorrect edge format, ID: '1 ?'",
    "invalid_graph_invalid_key_pair_weight.txt": "Duplicate key-value pair: 'weight:30'",
    "invalid_graph_marked_number.txt": "Invalid key-value pair: 'marked:100'",
    "invalid_graph_no_value.txt": "Incorrect node format, ID: 'a'",
    "invalid_graph_node_no_y_cord.txt": "Incorrect node format, ID: 'a'",
    "invalid_graph_random_character.txt": "Input file had an invalid line on line 2",
    "invalid_graph_weight_string.txt": "Incorrect node format, ID: 'a'",
    "invalid_graph.pdf": "Unaccepted File Type: '.pdf'",
    "invalid_graph_no_extension": "Unaccepted File Type: No Extension",
    "invalid_graph_source_no_match.txt": "Source does not match a node ID: 2",
    "invalid_graph_target_no_match.txt": "Target does not match a node ID: 2",
    "invalid_graph_source_no_match_directed.txt": "Source does not match a node ID: 2",
    "invalid_graph_target_no_match_directed.txt": "Target does not match a node ID: 2",
    "invalid_graph_string_positions.txt": "Incorrect node format, ID: '1'"
    }

function setGraph(predicates) {
    return predicates // TODO maybe test these predicates? Possibly unnecessary repeat of test_FileToPredicate?
                      // Would involve a lot of manual making the predicates.. perhaps in expected output files or something.
                      // Something we can get to later if we run out of things to do
}

function onUpload(graph) {
    return graph // give it 
}

test.each(invalidTestFiles)( 
    "<GraphInput /> with invalid input file '%s'", 
    async (filename) => {
        const {getByLabelText, findByTestId, getByTestId, getByText } = render(<GraphInput />);
        
        const editor = await screen.findByRole('textbox')
        expect(editor).toBeInTheDocument()


        screen.debug(document.body)

        //const user = userEvnet.setup()
        //await user.type(editor, 'console.log("Hello");');




        /*
        await waitFor(() => expect(screen.getByText("Load Graph")).not.toBeDisabled(), {
            timeout: 5000,
        }); */
        //await new Promise((r) => setTimeout(r, 2000));
        
        const input = getByLabelText("Upload Graph");
        expect(input).toBeInTheDocument();
        const {file, text} = getFile(filename)
        Object.defineProperty(input, "files", { value: [file] });
        

        fireEvent.change(input);
        //expect(() => waitFor(getByRole('textbox').textContent).toEqual(text));

        //await new Promise((r) => setTimeout(r, 1000));

        fireEvent.click(screen.getByText("Load Graph"));
        await findByTestId("errorMessage");
        expect(getByTestId("errorMessage").textContent).toEqual(errorMessages[filename])
});

/* test.each(validTestFiles)(
    "<GraphInput /> with valid input file '%s'", 
    async (filename) => {
        const {getByLabelText, findByTestId, getByRole, getByText } = render(<GraphInput setGraph={setGraph} onUpload={onUpload}/>);
               
        const input = getByLabelText("Upload Graph");
        expect(input).toBeInTheDocument();
        const {file, text} = getFile(filename)
        Object.defineProperty(input, "files", { value: [file] });

        
        fireEvent.change(input);
       
        fireEvent.click(screen.getByText("Load Graph"));
        await expect(findByTestId("errorMessage", {}, {timeout: 300})).rejects.toThrow();
        expect(getByRole('textbox').textContent).toEqual(text)
}); */
