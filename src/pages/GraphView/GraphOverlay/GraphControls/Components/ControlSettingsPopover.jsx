import { Popover } from '@headlessui/react'
import { EyeIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react'
import { useGraphContext } from 'pages/GraphView/utils/GraphContext';

/**
 * ControlSettingsPopover component renders a popover for control settings.
 * @returns {JSX.Element} - Returns the JSX for ControlSettingsPopover component.
 */
export default function ControlSettingsPopover() {
    // get graph context
    const graphContext = useGraphContext();
    
    // Ref for popover button
    const button = useRef(null);

    // Effect hook to handle keyboard shortcut for opening popover
    useEffect(() => {
        if (!button.current) return;

        function onKeyPress(event) {
            // If user is typing into an input field, ignore.
            if (event.target.tagName.toLowerCase() === 'input') return;

            // Only if the user enters the designated keyboard shortcut - c - the button is clicked
            if (event.key !== 'c') return;
            button.current.click();
        }

        document.addEventListener('keypress', onKeyPress);
        return () => document.removeEventListener('keypress', onKeyPress);
    }, []);

    // Function to handle auto camera action
    function autoCamera() {
        graphContext.cytoscape.instance.fit();
    }

    // Function to handle auto layout action
    function autoLayout() {
        graphContext.preferences.setLayoutPreferences({ name: 'cose-bilkent'});
    }

   
    return (
        <Popover className="relative">
            <Popover.Button ref={button} className="group h-12 w-12 p-2 rounded shadow bg-gray-100 border border-gray-200 pointer-events-auto">
                <EyeIcon className='stroke-blue-400 stroke-2 group-focus:scale-105'/>
            </Popover.Button>

            <Popover.Panel className="absolute z-10 right-1/2 translate-x-1/2 w-max p-4 pt-2 mt-4 rounded min-h-24 bg-white border border-gray-200 shadow pointer-events-auto min-w-52">
                <p className='text-lg font-semibold text-center'>Controls</p>

                <button className='block p-2 mt-4 w-full rounded font-semibold bg-blue-500 text-white hover:bg-blue-700' onClick={autoCamera}>Auto Camera</button>

                <button className='block p-2 mt-2 w-full rounded font-semibold bg-blue-500 text-white hover:bg-blue-700' onClick={autoLayout}>Auto Layout</button>

            </Popover.Panel>
        </Popover>
    )
}
