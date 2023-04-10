import './index.scss'

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'frontend/App';
import GraphViewerTest from 'frontend/Graph/GraphViewer/GraphViewerTest';
import GraphInputTest from 'frontend/Graph/GraphInput/GraphInputTest';
import AlgorithmTest from 'frontend/Algorithm/AlgorithmTest';
import PromptTest from 'frontend_tests/PromptTest';
import Navbar from 'frontend/Navbar/Navbar';

import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { GraphProvider } from 'frontend/GraphContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <Routes>
            <Route exact path='/' element={
                <App />
            }></Route>
            <Route exact path='/tests' element={
                <div>
                    <h1>Galant Tests</h1>
                    <p>1. <Link to="/tests/graphViewer">Graph Viewer Test</Link></p>
                    <p>2. <Link to="/tests/graphInput">Graph Input Test</Link></p>
                    <p>3. <Link to="/tests/algorithm">Algorithm Test</Link></p>
                    <p>3. <Link to="/tests/prompt">Prompt Test</Link></p>
                </div>
            }></Route>
            <Route exact path='/tests/graphViewer' element={
                <GraphProvider>
                    <GraphViewerTest />
                </GraphProvider>
            }></Route>
            <Route exact path='/tests/graphInput' element={
                <GraphProvider>
                    <GraphInputTest />
                </GraphProvider>
            }></Route>
            <Route exact path='/tests/algorithm' element={
                <GraphProvider>
                    <AlgorithmTest />
                </GraphProvider>
            }></Route>
            <Route exact path='/tests/prompt' element={
                <GraphProvider>
                    <PromptTest />
                </GraphProvider>
            }></Route>
        </Routes>
    </BrowserRouter>
);