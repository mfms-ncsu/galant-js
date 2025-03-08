import { Fragment } from "react";
import { PlusIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';
import { useRef, useEffect } from "react";

/**
 * Returns component for creating new tabs, including the button and dropdown.
 */
export default function NewButton({ addTab, examples }) {
    const button = useRef(null);

    // Effect hook to handle keyboard shortcut for opening New button
    useEffect(() => {
        if (!button.current) return;

        function onKeyPress(event) {
            // If user is typing into editor text area field, ignore.
            if (event.target.tagName.toLowerCase() === 'textarea') return;

            // Only if the user enters the designated keyboard shortcut - n - the button is clicked
            if (event.key == 'n') button.current.click();

        }

        document.addEventListener('keypress', onKeyPress);
        return () => document.removeEventListener('keypress', onKeyPress);
    }, []);

    return (
        <div className="relative">
            <Menu>
                <Menu.Button ref={button} className="flex items-center h-8">
                    <PlusIcon className="h-6 p-1 fill-black stroke stroke-black hover:bg-black/10 transition-all rounded-full" />
                </Menu.Button>
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
                                onClick={() => {
                                    try {
                                        console.log('Adding a blank tab...');
                                        addTab({ 'name': 'Blank' });
                                        console.log('Blank tab added successfully.');
                                    } catch (error) {
                                        console.error('Error adding a blank tab:', error);
                                        alert('An error occurred while adding the blank tab. Please try again.');
                                    }
                                }}
                            >
                                Blank
                            </button>
                        </Menu.Item>

                        <div className="mt-2 flex flex-col items-start">
                            <span className="font-bold">Examples</span>
                            {examples.map(data => (
                                <Menu.Item key={data.name}>
                                    <button
                                        className="text-nowrap hover:underline"
                                        onClick={() => {
                                            try {
                                                console.log(`Adding tab for example: ${data.name}`);
                                                addTab(data);
                                                console.log(`Tab for example ${data.name} added successfully.`);
                                            } catch (error) {
                                                console.error(`Error adding tab for example ${data.name}:`, error);
                                                alert(`An error occurred while adding the tab for ${data.name}. Please try again.`);
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
