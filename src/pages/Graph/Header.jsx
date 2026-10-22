import HelpButton from "components/Buttons/HelpButton";
import { useEffect } from "react";
import shortcuts, { matchesShortcut, shortcutHint, toggleShortcutMode } from "config/keyboardShortcuts";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";
import EditorButton from "components/Buttons/EditorButton";
import ControlSettingsPopover from "components/Popovers/ControlSettingsPopover"
import NodeSettingsPopover from "components/Popovers/NodeSettingsPopover"
import EdgeSettingsPopover from "components/Popovers/EdgeSettingsPopover"
import UserPreferencesPopover from "components/Popovers/UserPreferencesPopover";

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
 * Opens the instructions page in an external window.
 */
function openInstructionsPage() {
    window.open('https://docs.google.com/document/d/1_CX-rv_dFlnWL3BacHnernQ4tapzhmhPUzUx2cWaBc0/view', '_blank');
}

/**
 * Header component for Graph containing menu buttons and popovers.
 */
export default function Header() {
    useEffect(() => {
        function onKeyDown(event) {
            if (!matchesShortcut(event, shortcuts.toggleGskMode)) {
                return;
            }
            event.preventDefault();
            const mode = toggleShortcutMode();
            SpeechInterface.announceGskState(mode === "gsk");
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <header className="absolute top-1 left-1 right-1 z-10 flex justify-between pointer-events-none">
            <div className="flex-col space-y-1 whitespace-nowrap">
                <p className="font-bold">Editors</p>
                <EditorButton shortcut={shortcuts.openAlgorithmEditor} callback={openAlgorithmEditor} onClick={openAlgorithmEditor}>
                    Algorithm{shortcutHint(shortcuts.openAlgorithmEditor)}
                </EditorButton>
                <EditorButton shortcut={shortcuts.openGraphEditor} callback={openGraphEditor} onClick={openGraphEditor}>
                    Graph{shortcutHint(shortcuts.openGraphEditor)}
                </EditorButton>
                <HelpButton shortcut={shortcuts.openHelp} callback={openInstructionsPage} onClick={openInstructionsPage}>
                    Help{shortcutHint(shortcuts.openHelp)}
                </HelpButton>
            </div>

            <div className="flex-col space-y-1 whitespace-nowrap">
                <p className="font-bold">Preferences</p>
                <ControlSettingsPopover />
                <NodeSettingsPopover />
                <EdgeSettingsPopover />
                <UserPreferencesPopover />
            </div>
        </header>
    );
}