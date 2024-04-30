/**
 * HelpPage Component
 * 
 * This component represents the page that users will be directed to when they press the 'Help' button in the application.
 * It consists of a list of keyboard shortcuts and contents of the Galant-JS User Guide written by the Spring 2024 team.
 */
import React from "react"

export default function InstructionsPage() {
    return (
        <>
        <div>
            <p className="font-mono">
                <h1 className="font-bold text-3xl">Instructions for using Galant-JS:</h1> <br />
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
                        </ol>
                    </li>
                </ol>
            </p>
        </div>
        </>
    )
}