import './index.scss'

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'frontend/App';
import GraphViewerTest from 'frontend/Graph/GraphViewer/GraphViewerTest';
import GraphInputTest from 'frontend/Graph/GraphInput/GraphInputTest';

import reportWebVitals from 'reportWebVitals';

import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { GraphProvider } from 'frontend/GraphContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <Routes>
            <Route exact path='/' element={
                <App />
            }></Route>
            <Route exact path='/testGraphViewer' element={
                <GraphProvider>
                    <GraphViewerTest />
                </GraphProvider>
            }></Route>
            <Route exact path='/testGraphInput' element={
                <GraphProvider>
                    <GraphInputTest />
                </GraphProvider>
            }></Route>
        </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
