import { Fragment, useRef, useEffect } from "react";
import { Menu, Transition } from '@headlessui/react';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { PlusIcon } from '@heroicons/react/24/solid';

/**
 * Returns component for creating new tabs, including the button and dropdown.
 */
export default function NewButton({ addTab, examples }) {
    const button = useRef(null);

    // Effect hook to handle keyboard shortcut for opening New button
    useEffect(() => {
        if (!button.current) return;

        function onKeyPress(event) {
            event.preventDefault();
            // Keyboard shortcut for new tab is Ctrl-N or Cmd-N; only the former works, even on a Mac
            console.log("keypress = ", event);
            if (event.key === 'n' && (event.getModifierState("Control") || event.getModifierState("Meta"))) {
                event.preventDefault();
                button.current.click();
            }
        }
        document.addEventListener('keydown', onKeyPress);
        return () => document.removeEventListener('keydown', onKeyPress);
    }, []);

    return (
        <div className="relative">
             <PrimaryButton className="m-1">
                <a href="/algorithms">Examples</a>
             </PrimaryButton>
        </div>
    );
}
