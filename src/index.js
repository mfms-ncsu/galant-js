import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getDefaultStore, Provider } from "jotai";
import { algorithmTabsAtom, graphTabsAtom } from "states/_atoms/atoms";
import Graph from "pages/Graph/Graph";
import Editor from "pages/Editor/Editor";
import Instructions from "pages/Instructions/Instructions";
import "./index.css";

/**
 * This code sets up a React application with routing using react-router-dom. 
 * It registers a service worker if supported by the browser, then creates a 
 * router with routes mapping paths to specific React components. Finally, it 
 * renders the router wrapped in RouterProvider to provide routing context 
 * to the application.
 * @author Christina Albores
 */

// Check if service workers are supported by the browser
if ('serviceWorker' in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    navigator.serviceWorker.register(`../serviceworker.js`).then(
        registration => {
            console.log('Service worker registration succeeded:', registration);
        },
        error => {
            console.error(`Service worker registration failed: ${error}`);
        }
    );
} else {
    // Log an error if service workers are not supported
    console.error('Service workers are not supported.');
}

// Create a router with routes mapping paths to React components
const router = createBrowserRouter([
    {
        path: "/",
        element: <Graph />,
    },
    {
        path: '/algorithmeditor',
        element: <Editor editorType="Algorithm" tabsAtom={algorithmTabsAtom} />
    },
    {
        path: '/grapheditor',
        element: <Editor editorType="Graph" tabsAtom={graphTabsAtom} />
    },
    {
        path: '/instructions',
        element: <Instructions />
    }
]);

// Render the router wrapped in RouterProvider to provide routing context
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={getDefaultStore()}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);