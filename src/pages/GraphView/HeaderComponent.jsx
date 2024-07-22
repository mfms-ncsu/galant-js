/**
 * @fileoverview Contains the header component logic for the graphview page.
 * @author Julian Madrigal
 * @author Vitesh Kambara
 */

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import { useEffect } from "react";

/**
 * Opens the graph editor in a new window.
 * Preferred over a Link to ensure only one instance open at a time. 
 */
function openGraphEditor() {
    window.open('/grapheditor','Graph Editor','width=600,height=900');
}

/**
 * Opens the algorithm editor in a new window.
 * Preferred over a Link to ensure only one instance open at a time. 
 */
function openAlgorithmEditor() {
    window.open('/algorithmeditor','Algorithm Editor','width=600,height=900');
}

function openKeyboardShortcutsPage() {
    window.open('/keyboard_shortcuts', 'Keyboard Shortcuts: Galant-JS', 'width=600,height=1000');
}

function openInstructionsPage() {
    window.open('/instructions', 'Getting started with Galant-JS', 'width=600,height=1000');
}

/**
 * Header component for GraphView.
 * @returns {React.ReactElement}
 */
export default function HeaderComponent() {
    // Effect hook to handle keyboard shortcuts for opening up Editors from homepage
    useEffect(() => {
        function handleKeyPress(event) {
            // If user is typing into an input field, ignore.
            if (event.target.tagName.toLowerCase() === 'input') return;
            // If user enters 'g' open the graph editor pop up
            if (event.key === 'g') openGraphEditor();
            // If user enters 'a' open the algorithm editor pop up
            if (event.key === 'a') openAlgorithmEditor();
            // If user enters 'k' open up the help/keyboard shortcuts pop up
            if (event.key === 'k') openKeyboardShortcutsPage();
            // Keyboard shortcut for a simple help page is 'h'
            if (event.key === 'h') openInstructionsPage();
        }

        document.addEventListener('keydown', handleKeyPress, true)

            
        return () => document.removeEventListener('keydown', handleKeyPress, true);
    }, []);
    return (
        <header className="absolute flex justify-between align-middle px-4 h-12 z-10">
            {/* <img src="img/galant_full_logo_without_words.svg" alt="galant logo" className="pt-1"/> */}
            <div className="flex space-x-2 py-2 w-full sm:w-fit font-semibold whitespace-nowrap">
                <button className="flex items-center space-x-2 px-2 py-1 bg-gray-300 text-black rounded shadow-lg hover:bg-blue-100 cursor-alias help-button" onClick={openInstructionsPage}>
                    <label><span>Help (h)</span></label> 
                </button>

                <button className="flex items-center space-x-2 px-2 py-1 bg-gray-300 text-black rounded shadow-lg hover:bg-blue-100 cursor-alias" onClick={openKeyboardShortcutsPage}>
                    <label><span>Keys (k)</span></label> 
                </button>

                <button className="flex items-center space-x-4 px-2 py-1 bg-gray-300 text-black rounded shadow-lg hover:bg-gray-300 cursor-alias" onClick={openGraphEditor}>
                    <label>Graph Editor (g)</label>
                    <ArrowTopRightOnSquareIcon className="h-4 fill-black" />
                </button>

                <button className="flex items-center space-x-2 px-2 py-1 bg-gray-300 text-black rounded shadow-lg hover:bg-gray-300 cursor-alias" onClick={openAlgorithmEditor}>
                    <label>Algorithm Editor (a)</label>
                    <ArrowTopRightOnSquareIcon className="h-4 fill-black" />
                </button>

            </div>
        </header>
    )
}