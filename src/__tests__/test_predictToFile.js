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
e a b 5 color:yellow
directed`
    var converted = parseText(text)
    converted.setName('test.txt')
    var convertBack = StringifyGraphSnapshot(converted)
    expect(convertBack).toEqual(text)
})

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
test('testSgfFile', ()=>{
    var text = `n a 10 10 20
n b 15 10 20
e a b 20
e a a 20`
    //check if it matched
    var converted = parseSGFText(text)
    converted.setName('test.sgf')
    var convertBack = StringifyGraphSnapshot(converted)
    expect(convertBack).toEqual(text)
})

