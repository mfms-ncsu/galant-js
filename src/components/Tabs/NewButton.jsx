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
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <PrimaryButton className="m-1">
            <button
                className="hover:underline"
                data-cy="BlankTab"
                onClick={() => {
                    try {
                        addTab({ 'name': 'Blank' });
                    } catch (error) {
                        console.error('An error occurred while adding the blank tab Please try again.', error);
                    }
                }}
            >
            Examples
            </button>
        </PrimaryButton>
    );
}
