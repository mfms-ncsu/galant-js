import '@testing-library/jest-dom'
import {cleanup, fireEvent, render, waitFor, screen, getByTestId} from '@testing-library/react';
import AlgorithmHandler from 'utils/Algorithm/AlgorithmHandler';
import Graph from 'utils/Graph';
import Predicates from 'utils/Predicates';
import { readFileSync, readdirSync, readdir } from 'fs';


var _patches
var _message
var _status
var _error
var _alg

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

beforeEach(() => {
    _patches = null
    _message = null
    _status = null
    _error = null
    _alg = null
})

function updateGraph(patches) {
    _patches = patches
}

function addNewMessage(message) {
    _message = message
}

function setStatus(status) {
    _status = status
}

function setAlgError(error, alg) {
    _error = error
    _alg = alg
}

function setAlgPrompt(prompt, error) {
    // unused right now
}

test("AlgorithmHandler init", async () => {
    var graph = new Predicates(new Graph({}, {}, false, ""))
    var handler = new AlgorithmHandler(graph, "", updateGraph, addNewMessage, setStatus, setAlgError, setAlgPrompt, true)
    await (waitFor(() => {
        expect(handler.stepHandler).not.toBeUndefined()
    }))
    expect(_message).toEqual('Started thread')
})

test("AlgorithmHandler stepForward", async () => {
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': 20,'highlighted': false, 'marked': false}
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': 20, 'highlighted': false, 'marked': false}
    var edges = {}
    edges[1] = { 'highlighted': false, 'source': 'a', 'target': 'b', 'weight': 20 }
    edges[2] = { 'highlighted': false, 'source': 'a', 'target': 'a', 'weight': 20 }
    var graph = new Predicates(new Graph(nodes, edges, false, ""))
    
    var handler = new AlgorithmHandler(graph, "", updateGraph, addNewMessage, setStatus, setAlgError, setAlgPrompt, true)
    await (waitFor(() => {
        expect(handler.stepHandler).not.toBeUndefined()
    }))
    expect(_message).toEqual('Started thread')
    handler.stepForward()
    expect(_message).toEqual('Marked node a')
    handler.stepForward()
    expect(_message).toEqual('Marked node b')
    handler.stepBack()
})

test("AlgorithmHandler stepError", async() =>{
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': 20,'highlighted': false, 'marked': false}
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': 20, 'highlighted': false, 'marked': false}
    var edges = {}
    edges[1] = { 'highlighted': false, 'source': 'a', 'target': 'b', 'weight': 20 }
    edges[2] = { 'highlighted': false, 'source': 'a', 'target': 'a', 'weight': 20 }
    var graph = new Predicates(new Graph(nodes, edges, false, ""))
    
    var handler = new AlgorithmHandler(graph, "", updateGraph, addNewMessage, setStatus, setAlgError, setAlgPrompt, true)
    await (waitFor(() => {
        expect(handler.stepHandler).not.toBeUndefined()
    }))
    handler.stepForward()
    handler.stepForward()
    handler.stepForward()
    expect(_error).toEqual('Example error')
    expect(_alg).toEqual('')
    expect(_message).toEqual('Killed thread')

    handler.setGraph(graph)
    expect(_message).toEqual('Started thread')
})

test("AlgorithmHandler setGraph and setAlg", async() =>{
    var nodes = {}
    nodes['a'] = { 'x': 10, 'y': 10, 'weight': 20,'highlighted': false, 'marked': false}
    nodes['b'] = { 'x': 15, 'y': 10, 'weight': 20, 'highlighted': false, 'marked': false}
    var edges = {}
    edges[1] = { 'highlighted': false, 'source': 'a', 'target': 'b', 'weight': 20 }
    edges[2] = { 'highlighted': false, 'source': 'a', 'target': 'a', 'weight': 20 }
    var graph = new Predicates(new Graph(nodes, edges, false, ""))
    
    var handler = new AlgorithmHandler(graph, "", updateGraph, addNewMessage, setStatus, setAlgError, setAlgPrompt, true)
    await (waitFor(() => {
        expect(handler.stepHandler).not.toBeUndefined()
    }))

    handler.setGraph(graph)
    expect(_message).toEqual('Started thread')

    handler.setAlgorithm('')
    expect(_message).toEqual('Started thread')
})
