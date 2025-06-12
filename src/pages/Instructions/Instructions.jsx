import React from "react";

/**
 * This component represents the page that users will be directed to when they press the 'Help' button in the application.
 * It consists of a list of keyboard shortcuts and contents of the Galant-JS User Guide written by the Spring 2024 team.
 * @todo The style can be significantly improved; might be good to use a table;
 *       also, html works differently in the jsx context
 */
export default function Instructions() {
    return (
        <div>
            <h1 className="font-bold text-3xl">Quick Start Guide to using Galant-JS, Version 2.2</h1>
            <div>
                <ol>
                    <li>
                        <strong>Load a Graph.</strong>
                        <ol>
                            <li>
                                Click <code>Graph Editor</code> or use the <code>g</code> key
                            </li>
                            <li>
                                Click the <code>Examples</code> tab in the graph editor window
                            </li>
                            <li>
                                Select a graph from the list in the popup window;
                                the sorting graphs are for sorting algorithms only.
                            </li>
                            <li>
                                Click <code>Load Graph</code> or use the <code>Ctrl-L</code> (<code>Cmd-L</code> on a Mac) key.
                            </li>
                        </ol>
                    </li>
                    <li>
                        <strong>Load an Algorithm.</strong>
                        <ol>
                            <li>
                                Go back to the main window and click <code>Algorithm Editor</code> or use the <code>a</code> key
                            </li>
                            <li>
                                Click the <code>Examples</code> tab in the algorithm editor window
                            </li>
                            <li>
                                Select an algorithm from popup window                                
                            </li>
                            <li>
                                Click <code>Load Algorithm</code> or use the <code>Ctrl-L</code> (<code>Cmd-L</code> on a Mac) key.
                            </li>
                        </ol>
                    </li>
                    <li>
                        <strong>Run the Algorithm.</strong>
                        <ol>
                            <li>
                                Go back to the main window
                            </li>
                            <li>
                                Use the left and right arrow keys or click on the arrows at the bottom of the display to step forward and backward
                            </li>
                            <li>
                                Use the <code>Esc</code> key or click on the <code>Exit</code> button to exit the algorithm
                            </li>
                            <li>
                                If you want to start over, go back to the algorithm editor and load the algorithm again.
                                The easiest way to do that is to use keyboard shortcuts: <code>a</code>, <code>Ctrl-L</code>
                            </li>
                        </ol>
                    </li>
                    <li>
                        <strong>Run additional algorithms or use different graphs.</strong>
                        <ol>
                            <li>
                                To run a different algorithm on the same graph simply go to the algorithm editor, choose another algorithm, and load it.
                            </li>
                            <li>
                                To run the same algorithm on a different graph, go to the graph editor, choose and load another graph, and then reload the algorithm.
                            </li>

                        </ol>
                    </li>
                </ol>
                
                <p>
                    <strong>You can use the mouse to pan and zoom in and out of the graph,</strong>
                    as you would in a map application. The Auto-Camera feature, under Layout,
                    will center the graph on the canvas.
                </p>
            </div>
            For more information see the full
            <p align="center">
                <strong>
                <a href="https://docs.google.com/document/d/1FEi-RJ97UxsDuxHQrGmyOUanNWrWdq84NKicSdswGDY/view">User Manual</a>
                </strong>
            </p>
            For a list of known bugs and annoyances, see
            <p align="center">
                <strong>
                    <a href="https://docs.google.com/document/d/1oHE9ALc9YsKE-ndOJyjRe1H0eyE3vfTtGefPONHDRqE/view">List of Known Bugs</a>
                </strong>
            </p>
        </div>
    );
}