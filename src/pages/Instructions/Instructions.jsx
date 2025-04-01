import React from "react";

/**
 * This component represents the page that users will be directed to when they press the 'Help' button in the application.
 * It consists of a list of keyboard shortcuts and contents of the Galant-JS User Guide written by the Spring 2024 team.
 */
export default function Instructions() {
    return (
        <div>
            <h1 className="font-bold text-3xl">Quick Start Guide to using Galant-JS</h1>
            <div>
                <ol>
                    <li>
                        <strong>Load a Graph.</strong>
                        <ol>
                            <li>
                                Click <code>Graph Editor</code> or use the <code>g</code> key
                            </li>
                            <li>
                                Click the <code>New</code> tab in the graph editor window
                            </li>
                            <li>
                                Select a graph in the drop down menu;
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
                                Click the <code>New</code> tab in the algorithm editor window
                            </li>
                            <li>
                                Select an algorithm from the drop down menu                                
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
                                Use the <code>Esc</code> key or click on the <code>x</code> to exit the algorithm
                            </li>
                            <li>
                                If you want to start over, go back to the algorithm editor and load the algorithm again
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
            </div>
        </div>
    );
}