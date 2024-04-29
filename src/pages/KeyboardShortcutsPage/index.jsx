/**
 * HelpPage Component
 * 
 * This component represents the page that users will be directed to when they press the 'Help' button in the application.
 * It consists of a list of keyboard shortcuts and contents of the Galant-JS User Guide written by the Spring 2024 team.
 */
import React from "react"

export default function KeyboardShortcutsPage() {
    return (
        <>
        <div>
            <p className="font-mono">
                <h1 className="font-bold text-3xl">LIST OF KEYBOARD SHORTCUTS IN GALANT JS:</h1> <br />

                <h2 className="font-semibold text-lg">OPENING EDITORS </h2>
                - A - Open Algorithm Editor from Main Page<br />
                - G - Open Graph Editor from Main Page<br />
                - H - Open Help Page for List of Keyboard Shorcuts<br />
                <br />
                
                <h2 className="font-semibold text-lg">IN-EDITOR CONTROLS</h2>
                - S - Download Current Graph/Algorithm File in the Editor<br />
                - L - Load Current Graph/Algorithm File in the Editor<br />
                - N - Choose New Graph/Algorithm File in the Editor<br />
                <br />
                
                <h2 className="font-semibold text-lg">EDIT MODE:</h2>
                - Z - Undo Changes <br />
                - X - Redo Changes <br />
                - R - Revert Graph back to original state <br />
                - S - Save Changes <br />
                <br />
                
                <h2 className="font-semibold text-lg">ALGORITHM CONTROLS:</h2>
                - Left Arrow - Step Back <br />
                - Right Arrow - Step Forward <br />
                - Escape Key - Terminate Algorithm <br />
                - 'S' Key - Export Graph <br />
                - Windows/Cmd + Right Arrow - Skip To End<br />
                <br />
                
                <h2 className="font-semibold text-lg">CONTROL SETTINGS POPOVER:</h2>
                - C - Open popover for Layout Controls <br />
                <br />
                
                <h2 className="font-semibold text-lg">NODE SETTINGS POPOVER:</h2>
                - N - Open popover button for Node Settings <br />
                <br />
                
                <h2 className="font-semibold text-lg">EDGE SETTINGS POPOVER:</h2>
                - E - Open popover button for Edge Settings <br />
                <br />
                
                <h2 className="font-semibold text-lg">PREFERENCE POPOVER:</h2>
                - P - Open popover button for Preference Panel <br />
                <br />
            </p>
        </div>
        </>
    )
}