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
            <Menu>
                <PrimaryButton className="m-1">
                    <Menu.Button ref={button} className="flex items-center" data-cy="NewTabButton">
                        <PlusIcon className="h-4 me-2 fill-white stroke stroke-white" />
                        <span>New Tab</span>
                    </Menu.Button>
                </PrimaryButton>
                
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    className="absolute z-20 p-4 w-fit bg-white rounded-xl shadow-lg"
                >
                    <Menu.Items className="">
                        <Menu.Item>
                            <button
                                className="hover:underline"
                                data-cy="BlankTab"
                                onClick={() => {
                                    try {
                                        addTab({ 'name': 'Blank' });
                                    } catch (error) {
                                        console.error('An error occurred while adding the blank tab. Please try again.', error);
                                    }
                                }}
                            >
                                Blank
                            </button>
                        </Menu.Item>

                        <div className="mt-2 flex flex-col items-start">
                            <span className="font-bold" data-cy="ExamplesHeader">Examples</span>
                            {examples.map(data => (
                                <Menu.Item key={data.name}>
                                    <button
                                        className="text-nowrap hover:underline"
                                        onClick={() => {
                                            try {
                                                addTab(data);
                                            } catch (error) {
                                                console.error(`Error adding tab for example ${data.name}:`, error);
                                            }
                                        }}
                                    >
                                        {data.name}
                                    </button>
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
