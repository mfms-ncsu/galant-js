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

        function onKeyDown(event) {
            if (event.code === "KeyE" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                button.current.click();
            }
        }
        // function onKeyPress(event) {
        //     event.preventDefault();
        //     // Keyboard shortcut for new tab is Ctrl-N or Cmd-N; only the former works, even on a Mac
        //     console.log("keypress = ", event);
        //     if (event.key === 'n' && (event.getModifierState("Control") || event.getModifierState("Meta"))) {
        //         event.preventDefault();
        //         button.current.click();
        //     }
        // }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <div className="relative">
             <PrimaryButton className="m-1">
                <a href="/algorithms">Examples</a>
             </PrimaryButton>
        </div>
    );
}
