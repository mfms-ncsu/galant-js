import HelpButton from "components/Buttons/HelpButton";
import EditorButton from "components/Buttons/EditorButton";

/**
 * @fileoverview Contains the header component logic for the graphview page.
 * @author Julian Madrigal
 * @author Vitesh Kambara
 */

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

function openInstructionsPage() {
    window.open('/instructions', 'Getting started with Galant-JS', 'width=600,height=1000');
}

/**
 * Header component for GraphView.
 * @returns {React.ReactElement}
 */
export default function HeaderComponent() {
    return (
        <header className="absolute z-10 top-1 left-1 flex items-start gap-x-1">
            <div className="flex-col space-y-1 whitespace-nowrap">
                <p className="font-bold">Editors</p>
                <EditorButton shortcut="a" callback={openAlgorithmEditor} onClick={openAlgorithmEditor}>
                    Algorithm (a)
                </EditorButton>
                <EditorButton shortcut="g" callback={openGraphEditor} onClick={openGraphEditor}>
                    Graph (g)
                </EditorButton>
                <HelpButton shortcut="h" callback={openInstructionsPage} onClick={openInstructionsPage}>
                    Help (h) 
                </HelpButton>
            </div>
        </header>
    )
}