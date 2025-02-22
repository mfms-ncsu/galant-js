import { Popover } from '@headlessui/react'
import Button from "./Button";

export default function PreferenceButton({ shortcut, callback, buttonRef, children }) {
    return(
        <Button
            shortcut={shortcut}
            callback={callback}
            className="bg-cyan-300 hover:bg-cyan-400"
        >
            <Popover.Button
                ref={buttonRef}
                className="px-2 py-1 pointer-events-auto"
            >
                {children}
            </Popover.Button>
        </Button>
    );
}