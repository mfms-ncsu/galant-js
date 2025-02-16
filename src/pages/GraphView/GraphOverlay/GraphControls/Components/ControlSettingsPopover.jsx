import { Popover } from '@headlessui/react'
import { useEffect, useRef } from 'react'
import Graph from 'graph/Graph'

/**
 * ControlSettingsPopover component renders a popover for control settings.
 * @returns {JSX.Element} - Returns the JSX for ControlSettingsPopover component.
 */
export default function ControlSettingsPopover() {
    // Ref for popover button
    const button = useRef(null);

    // Effect hook to handle keyboard shortcut for opening popover
    useEffect(() => {
        if (!button.current) return;
        function onKeyPress(event) {
            // If user is typing into an input field, ignore.
            if (event.target.tagName.toLowerCase() === 'input') return;
            if (event.key === 'i') {
                autoLayout();  // Call the auto-layout function directly when 'i' is pressed
            }
            // Only if the user enters the designated keyboard shortcut - c - the button is clicked
            if (event.key !== 'v') return;
            button.current.click();
        }
        document.addEventListener('keypress', onKeyPress);
        return () => document.removeEventListener('keypress', onKeyPress);
    }, []);

    // Function to handle auto camera action
    function autoCamera() {
        window.cytoscape.fit();
    }

    // Function to handle auto layout action
    function autoLayout() {
        Graph.cytoscapeManager.layout = { name: "cose-bilkent" };
        window.updateCytoscape();
    }

   
    return (
        <Popover className="relative">
            <Popover.Button ref={button} className="pointer-events-auto preference-button">
                <label>Layout (v)</label>
            </Popover.Button>

            <Popover.Panel className="absolute z-10 right-1/2 translate-x-1/8 w-max p-4 pt-2 mt-4 rounded min-h-24 bg-white border border-gray-200 shadow pointer-events-auto min-w-52">
                <p className='text-lg font-semibold text-center'>Controls</p>

                <button className='block p-2 mt-4 w-full rounded font-semibold bg-gray-300 text-black hover:bg-blue-700' onClick={autoCamera}>Auto Camera</button>

                <button className='block p-2 mt-2 w-full rounded font-semibold bg-gray-300 text-black hover:bg-blue-700' onClick={autoLayout}>Auto Layout</button>

            </Popover.Panel>
        </Popover>
    )
}
