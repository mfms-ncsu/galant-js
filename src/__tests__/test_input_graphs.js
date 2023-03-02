/**
 * This file tests the input of all existing test_files and checks that an appropriate error or no error appears on the page.
 * These tests DO NOT look at the actual visual output of the graph.
 * @author ysherma
 */
import {cleanup, fireEvent, render, waitFor, screen} from '@testing-library/react';
import GraphInput from 'src/frontend/Graph/GraphInput/GraphInput.jsx';
import { readFileSync, readdirSync } from 'fs';

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

// Sourced from https://stackoverflow.com/questions/68400489/how-to-wait-to-assert-an-element-never-appears-in-the-document
// Waits until the waitFor timeout to see if the element appears. Passes if the element does NOT appear in that time.
async function expectNever(callable) {
    await expect(() => waitFor(callable)).rejects.toEqual(expect.anything());
}

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

test('<GraphInput /> ', async () => {
    const {getByLabelText, findByTestId} = render(<GraphInput />);
    const input = getByLabelText("Upload Graph");
    expect(input).toBeInTheDocument();
    const {file, text} = getFile("invalid_graph.pdf")
    Object.defineProperty(input, "files", { value: [file] });
    fireEvent.change(input);
    await findByTestId("errorMessage");
    expect((await findByTestId("errorMessage")).textContent).toEqual("Unaccepted File Type: '.pdf'")
});

test('<GraphInput /> errorMessage DOES NOT APPEAR on invalid graph', async () => {
    const {getByLabelText, findByTestId, getByRole} = render(<GraphInput />);
    const input = getByLabelText("Upload Graph");
    expect(input).toBeInTheDocument();
    const {file, text} = getFile("valid_graph_no_edges.txt")
    Object.defineProperty(input, "files", { value: [file] });
    fireEvent.change(input);
    await expectNever(() => {
        expect(findByTestId('errorMessage')).toBeInTheDocument()
    });
    expect(getByRole('textbox').textContent).toEqual(text)
});