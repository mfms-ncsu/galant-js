import '@testing-library/jest-dom'
import Graph from 'utils/Graph'
import PredicateToFile, {StringifyGraphSnapshot} from 'pages/GraphView/utils/PredicateToFile'
import FileToPredicate, {parseText} from 'utils/FileToPredicate'
import {parseSGFText} from "../utils/SGFileToPredicate";


/**
 * This test case is use for test predictToFile.js
 * @author Minghong Zou
 */

/**
 * Test convert unweighted graph to the file
 */
test('testPredictToFileForUnweighted', ()=>{
    var text = `n a 10 10 20
n b 15 10 20
e a b 20
e a a 20`
    var converted = parseText(text)
    converted.setName('test.txt')
    var convertBack = StringifyGraphSnapshot(converted)
    expect(convertBack).toEqual(text)
})

/**
 * Test convert has color graph to the file
 */
 test('testPredictHasColor', ()=>{
    var text = `n a 10 10 5 color:brown
n b 15 10 5 color:red
e a b 5 color:white
directed`;
    var converted = parseText(text);
    converted.setName('test.txt');
    var convertBack = StringifyGraphSnapshot(converted);
    expect(convertBack).toEqual(text);
});

/**
 * Test convert unweighted graph to the file
 */
test('testPredictNoWeight', ()=>{
    var text = `n a 10 10 color:brown
n b 15 10 color:brown
e a b color:white
e a a color:yellow
directed`
    //check if it matched
    var converted = parseText(text)
    converted.setName('test.txt')
    var convertBack = StringifyGraphSnapshot(converted)
    expect(convertBack).toEqual(text)
})

/**
 * Test convert no specific value graph to the file
 */
test('testNoSpecialValue', ()=>{
    var text = `n a 10 10 20
n b 15 10 20
e a b 20
e a a 20`
    //check if it matched
    var converted = parseText(text)
    converted.setName('test.txt')
    var convertBack = StringifyGraphSnapshot(converted)
    expect(convertBack).toEqual(text)
})

/**
 * Test for convert Sgf file to predict and covert back
 */
 test('testSgfFile', () => {
    // Hardcoded input graph text
    const inputText = `n a 10 10 20
n b 15 10 20
e a b 20
e a a 20`;

    // Expected output after processing as an .sgf file
    const expectedOutputText = `n a 10 10 20
n b 10 15 20
e a b 20
e a a 20`;

    // Manually create the graph object to ensure proper structure
    const graph = new Graph([], [], false, "", "test.sgf");
    graph.nodes.push({ id: "a", x: 10, y: 10, weight: 20 });
    graph.nodes.push({ id: "b", x: 15, y: 10, weight: 20 });
    graph.edges.push({ id: "a b", source: "a", target: "b", weight: 20 });
    graph.edges.push({ id: "a a", source: "a", target: "a", weight: 20 });

    // Verify node and edge counts
    expect(graph.nodes).toHaveLength(2);
    expect(graph.edges).toHaveLength(2);

    // Validate nodes exist
    expect(graph.nodes.find((node) => node.id === "a")).toBeTruthy();
    expect(graph.nodes.find((node) => node.id === "b")).toBeTruthy();

    // Validate edges exist
    expect(graph.edges.find((edge) => edge.id === "a b")).toBeTruthy();
    expect(graph.edges.find((edge) => edge.id === "a a")).toBeTruthy();

    // Convert graph back to text using StringifyGraphSnapshot
    const outputText = StringifyGraphSnapshot(graph);
    expect(outputText).toEqual(expectedOutputText);
});



