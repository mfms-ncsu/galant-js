import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GraphViewerDemo from './frontend/GraphViewer/GraphViewerDemo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GraphViewerDemo />
  </React.StrictMode>
);
