import { useEffect } from "react";
import shortcuts, { matchesShortcut, shortcutHint, setShortcutMode, getShortcutMode } from "config/keyboardShortcuts";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";
import EditorButton from "components/Buttons/EditorButton";
import ControlSettingsPopover from "components/Popovers/ControlSettingsPopover"
import NodeSettingsPopover from "components/Popovers/NodeSettingsPopover"
import EdgeSettingsPopover from "components/Popovers/EdgeSettingsPopover"
import { useAtom } from "jotai";
import { gskModeAtom } from "states/_atoms/atoms";
import UserPreferencesPopover from "components/Popovers/UserPreferencesPopover";
import HelpPopover from "components/Popovers/HelpPopover";

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
 * Header component for Graph containing menu buttons and popovers.
 */
export default function Header() {
    const [gskMode, setGskMode] = useAtom(gskModeAtom);

    // Keep keyboard mode synchronized with the saved setting.
    useEffect(() => {
        if (getShortcutMode() === "help") {
            return;
        }
        setShortcutMode(gskMode ? "gsk" : "default");
    }, [gskMode]);

    // Shift+G updates the same setting as the popover toggle.
    useEffect(() => {
        function onKeyDown(event) {
            if (!matchesShortcut(event, shortcuts.toggleGskMode)) {
                return;
            }

            event.preventDefault();
            const next = !gskMode;
            setGskMode(next);
            SpeechInterface.announceGskState(next);
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [gskMode, setGskMode]);

    useEffect(() => {
        return () => setShortcutMode("default");
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
                <HelpPopover />
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