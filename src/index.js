import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.less';
import App from './App';
import GraphViewerTest from './frontend/GraphViewer/GraphViewerTest';
import GraphInput from './frontend/GraphInput';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Return this to point at App for the main app. This currently selects the GraphViewer testing page.*/}
    <GraphViewerTest />
    <GraphInput />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
