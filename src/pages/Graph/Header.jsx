import HelpButton from "components/Buttons/HelpButton";
import EditorButton from "components/Buttons/EditorButton";
import ControlSettingsPopover from "components/Popovers/ControlSettingsPopover"
import NodeSettingsPopover from "components/Popovers/NodeSettingsPopover"
import EdgeSettingsPopover from "components/Popovers/EdgeSettingsPopover"

/**
 * Opens the graph editor in a new window.
 * Preferred over a Link to ensure only one instance open at a time. 
 */
function openGraphEditor() {
    window.open('/grapheditor', 'Graph Editor', `width=${window.screen.width / 2}, height=${window.screen.height}`);
}

/**
 * Opens the algorithm editor in a new window.
 * Preferred over a Link to ensure only one instance open at a time. 
 */
function openAlgorithmEditor() {
    window.open('/algorithmeditor', 'Algorithm Editor', `width=${window.screen.width / 2}, height=${window.screen.height}`);
}

/**
 * Opens the instructions page in a new window.
 * Preferred over a Link to ensure only one instance open at a time. 
 */
function openInstructionsPage() {
    window.open('/instructions', 'Getting started with GalantJS', `width=${window.screen.width / 2}, height=${window.screen.height}`);
}

/**
 * Header component for Graph containing menu buttons and popovers.
 */
export default function Header() {
    return (
        <header className="absolute top-1 left-1 right-1 z-10 flex justify-between pointer-events-none">
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

            <div className="flex-col space-y-1 whitespace-nowrap">
                <p className="font-bold">Preferences</p>
                <ControlSettingsPopover />
                <NodeSettingsPopover />
                <EdgeSettingsPopover />
            </div>
        </header>
    );
}