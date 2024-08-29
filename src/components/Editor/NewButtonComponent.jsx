/**
 * @fileoverview Contains and returns {@link NewButtonComponent}
 * @author Julian Madrigal
 * @author Vitesh Kambara
 */

/**
 * @typedef {Object} Example
 * @property {string} name the name of the example
 * @property {String} content the content of the example
 */


import { Fragment } from "react";
import { PlusIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';
import { useRef, useEffect } from "react";
import { useGraphContext } from 'pages/GraphView/utils/GraphContext';


/**
 * Returns component for creating new tabs, including the button and dropdown.
 * @param {function({name, content})} addTab create tab given data object
 * @param {Example[]} examples Examples that will be shown in the dropdown
 * @returns {React.ReactElement}
 */
export default function NewButtonComponent({addTab, examples}) {
    const graphContext = useGraphContext();
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
        /**
         * @todo SD 2024-8
         * I think this is where the style for a drop down menu is defined.
         * There's a lot of clutter here.
         * It may be useful to define a uniform style in index.css.
         * I'm not happy with the positioning of some drop downs or popups; it would be good to understand how to control these.
         */
        <div className="relative">
            <Menu>
                <Menu.Button ref={button} id="new-button" className="flex items-center space-x-2 px-2 py-1 rounded-t font-semibold bg-blue-400 text-white hover:bg-blue-500">
                    <PlusIcon className="h-4 w-4"/>
                    <span>New</span>
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                >
                    <Menu.Items id="examples-dropdown" className="absolute z-20 -left-4 mt-2 min-w-56 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <Menu.Item>
                            <button className="block w-full p-2 text-left ui-active:bg-blue-500 ui-active:text-white ui-active:font-semibold" onClick={() => {addTab({'name':'Blank'})}}>Blank</button>
                        </Menu.Item>

                        <div className="space-y">
                            <span className="block w-auto mx-2 mt-1 pb-1 text-sm font-semibold border-b text-gray-700 border-gray-100">Examples</span>
                            {examples.map(data => (
                                <Menu.Item key={data.name}>
                                    <button className="block w-full p-2 text-left from-indigo-500 to-blue-500 ui-active:bg-gradient-to-r ui-active:text-white ui-active:font-semibold" onClick={() => addTab(data)}>{data.name}</button>
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}
