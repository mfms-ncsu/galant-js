import { Fragment } from "react";
import { PlusIcon } from '@heroicons/react/24/solid';
import { Menu, Transition } from '@headlessui/react';
import { useRef, useEffect } from "react";

/**
 * Returns component for creating new tabs, including the button and dropdown.
 * @param {function({name, content})} addTab create tab given data object
 * @param {Example[]} examples Examples that will be shown in the dropdown
 * @returns {React.ReactElement}
 */
export default function NewButton({addTab, examples}) {
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
             <Menu.Button ref={button} className="flex items-center h-8">
                 <PlusIcon className="h-6 p-1 fill-black stroke stroke-black hover:bg-black/10 transition-all rounded-full" />
             </Menu.Button>
             <Transition
                 as={Fragment}
                 enter="transition ease-out duration-100"
                 enterFrom="transform opacity-0 scale-95"
                 enterTo="transform opacity-100 scale-100"
             >
                 <Menu.Items id="examples-dropdown" className="dropdown-menu">
                     <Menu.Item>
                         <button 
                             className="dropdown-item" 
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
     
                     <div className="dropdown-section">
                         <span className="dropdown-section-header">Examples</span>
                         {examples.map(data => (
                             <Menu.Item key={data.name}>
                                 <button 
                                     className="dropdown-item" 
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

    )
}
