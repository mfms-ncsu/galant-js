import { useState } from "react";
import IntroductionDialog from "./IntroductionDialog";
import shortcuts, { shortcutLabel } from "config/keyboardShortcuts";

export default function WelcomeDialog() {
    const [open, setOpen] = useState(true);
    if (!open) {
        return null;
    }

    function openHelp() {
        setOpen(false);
        window.setTimeout(() => window.dispatchEvent(new Event("open-help")), 0);
    }

    const text = `Welcome to GALANT. Explore graphs and follow algorithms one step at a time.

Press ${shortcutLabel(shortcuts.toggleSpeech)} to turn speech on or off. Speech starts off. Use Tab to move through controls and Enter or Space to activate them.

Open the Graph editor to load a graph, then the Algorithm editor to load an algorithm. You can replace either without reloading the other.

Choose Help for instructions, or Continue to explore.`;

    return <IntroductionDialog title="Welcome to GALANT" text={text} onClose={() => setOpen(false)} onHelp={openHelp} />;
}
