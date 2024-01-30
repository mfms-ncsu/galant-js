import './index.scss'

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'frontend/App';
import Collection from 'frontend/Collection/Collection'
import GraphViewerTest from 'frontend_tests/GraphViewerTest';
import GraphInputTest from 'frontend_tests/GraphInputTest';
import AlgorithmTest from 'frontend_tests/AlgorithmTest';
import PromptTest from 'frontend_tests/PromptTest';
import Navbar from 'frontend/Navbar/Navbar';
import StepTest from 'frontend_tests/StepTest';
//make happy global file
//const worker = new SharedWorket(new Uro("worker.js", ...))
//import 'worker.js';

import { Routes, Route, BrowserRouter, Link, Navigate } from 'react-router-dom';
import { GraphProvider } from 'frontend/GraphContext';
import GraphInput from 'frontend/Graph/GraphInput/GraphInput';
import Algorithm from 'frontend/Algorithm/Algorithm';

const root = ReactDOM.createRoot(document.getElementById('root'));

//react router ?
if ('serviceWorker' in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    navigator.serviceWorker.register(`../serviceworker.js`).then(
        registration => {
            console.log('Service worker registration succeeded:', registration);
        },
      /*catch*/ error => {
            console.error(`Service worker registration failed: ${error}`);
        }
    );
} else {
    console.error('Service workers are not supported.');
}



root.render(
    <BrowserRouter>
        <Routes>
            <Route exact path='/' element={
                <>
                    
                    <App />
                </>
            }></Route>
            <Route exact path='/grapheditor' element={ //TODO
                <>
                    <GraphInput />
                </>
            }></Route>
            <Route exact path='/algorithmeditor' element={
                <>
                    <Algorithm />
                </>
            }></Route>
            <Route exact path='/collection' element={
                <>
                    <Navbar />
                    <Collection />
                </>
            }></Route>
            <Route exact path='/tests' element={
                <div>
                    <Navbar />
                    <h1>Galant Tests</h1>
                    <p>1. <Link to="/tests/graphViewer">Graph Viewer Test</Link></p>
                    <p>2. <Link to="/tests/graphInput">Graph Input Test</Link></p>
                    <p>3. <Link to="/tests/algorithm">Algorithm Test</Link></p>
                    <p>4. <Link to="/tests/prompt">Prompt Test</Link></p>
                    <p>5. <Link to="/tests/step">Step Test</Link></p>
                </div>
            }></Route>
            <Route exact path='/tests/graphViewer' element={
                <>
                    <Navbar />
                    <GraphProvider>
                        <GraphViewerTest />
                    </GraphProvider>
                </>
            }></Route>
            <Route exact path='/tests/graphInput' element={
                <>
                    <Navbar />
                    <GraphProvider>
                        <GraphInputTest />
                    </GraphProvider>
                </>
            }></Route>
            <Route exact path='/tests/algorithm' element={
                <>
                    <Navbar />
                    <GraphProvider>
                        <AlgorithmTest />
                    </GraphProvider>
                </>
            }></Route>
                <Route exact path='/tests/prompt' element={
                    <>
                        <Navbar />
                        <GraphProvider>
                            <PromptTest />
                        </GraphProvider>
                    </>
                }></Route>
                <Route exact path='/tests/step' element={
                    <><Navbar /><GraphProvider>

                        <StepTest />
                    </GraphProvider></>
                }></Route>
                <Route exact path='/documentation' element={
                    // if you ever want to host the documentation locally you can change this!
                    <Navigate to='//drive.google.com/drive/u/1/folders/1o-Yqo1NH4WSr9GLRDciCoCvpugwhh7JB' />
                }></Route>
        </Routes>
    </BrowserRouter>
);
