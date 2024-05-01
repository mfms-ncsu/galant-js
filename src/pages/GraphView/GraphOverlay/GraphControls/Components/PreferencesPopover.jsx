import { Popover } from '@headlessui/react'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid'
import { useGraphContext } from 'pages/GraphView/utils/GraphContext';
import { useRef, useEffect } from 'react'

/**
 * PreferencesPopover component renders a popover for graph preferences.
 * @returns {JSX.Element} - Returns the JSX for PreferencesPopover component.
 */
export default function PreferencesPopover() {
    const graphContext = useGraphContext();
    const preferences = graphContext.preferences.style;

    // Ref for popover button
    const button = useRef(null);

    // Effect hook to handle keyboard shortcut for opening popover
    useEffect(() => {
        if (!button.current) return;

        function onKeyPress(event) {
            // If user is typing into an input field, ignore.
            if (event.target.tagName.toLowerCase() === 'input') return;

            // Only if user enters designated keyboard shortcut - p - the button is clicked
            if (event.key !== 'p') return;
            button.current.click();
        }

        document.addEventListener('keypress', onKeyPress);
        return () => document.removeEventListener('keypress', onKeyPress);
    }, []);

    /**
     * Function to set the default node color preference.
     * @param {Event} event - The event object.
     */
    function setNodeColor(event) {
        preferences.node.backgroundColor = event.target.value;
        graphContext.preferences.setStylePreferences({...preferences});
    }

    /**
     * Function to set the default edge color preference.
     * @param {Event} event - The event object.
     */
    function setEdgeColor(event) {
        preferences.edge.lineColor = event.target.value;
        graphContext.preferences.setStylePreferences({...preferences});
    }

    /**
     * Function to set the default node label color preference.
     * @param {Event} event - The event object.
     */
    function setNodeLabelColor(event) {
        preferences.node.color = event.target.value;
        graphContext.preferences.setStylePreferences({...preferences});
    }

    /**
     * Function to set the default edge label color preference.
     * @param {Event} event - The event object.
     */
    function setEdgeLabelColor(event) {
        preferences.edge.color = event.target.value;
        graphContext.preferences.setStylePreferences({...preferences});
    }

    /**
     * Function to set the default node border color preference.
     * @param {Event} event - The event object.
     */
    function setNodeBorderColor(event) {
        preferences.node.borderColor = event.target.value;
        graphContext.preferences.setStylePreferences({...preferences});
    }

    return (
    <Popover className="">
        <Popover.Button ref={button} className="group w-15 h-8 p-1 rounded bg-gray-100 shadow pointer-events-auto">
            <label>Prefs (p)</label>
            {/* <AdjustmentsHorizontalIcon className='fill-blue-400 group-focus:scale-105' /> */}
        </Popover.Button>

        <Popover.Overlay className="absolute inset-0 m-4 mt-1 rounded-lg bg-black/30" />
        <div className='absolute inset-0 flex justify-center items-center'>
            <Popover.Panel className="absolute z-10 p-4 pr-1 min-w-72 shadow rounded-lg bg-white pointer-events-auto">
                <h1 className='text-lg font-semibold text-center pr-3'>Graph Preferences</h1>

                <div className='flex flex-col space-y-4 mt-8 max-h-72 overflow-y-auto py-2 pr-3'>


                    <div className='flex justify-between items-center'>
                        <span className="">Default Node Color</span>
                        <div className='relative rounded-full h-8 w-8 outline outline-2 outline-offset-1 outline-gray-200 overflow-hidden focus-within:outline-blue-500 focus-within:outline-4'>
                            <input type='color' value={preferences.node.backgroundColor} className='h-10 w-10 -translate-x-1 -translate-y-1' onChange={setNodeColor}></input>
                        </div>   
                    </div>


                    <div className='flex justify-between items-center'>
                        <span className="">Default Edge Color</span>
                        <div className='relative rounded-full h-8 w-8 outline outline-2 outline-offset-1 outline-gray-200 overflow-hidden focus-within:outline-blue-500 focus-within:outline-4'>
                            <input type='color' value={preferences.edge.lineColor} className='h-10 w-10 -translate-x-1 -translate-y-1' onChange={setEdgeColor}></input>
                        </div>   
                    </div>


                    <div className='flex justify-between items-center'>
                        <span className="">Default Node Label Color</span>
                        <div className='relative rounded-full h-8 w-8 outline outline-2 outline-offset-1 outline-gray-200 overflow-hidden focus-within:outline-blue-500 focus-within:outline-4'>
                            <input type='color' value={preferences.node.color} className='h-10 w-10 -translate-x-1 -translate-y-1' onChange={setNodeLabelColor}></input>
                        </div>   
                    </div>

                    <div className='flex justify-between items-center'>
                        <span className="">Default Edge Label Color</span>
                        <div className='relative rounded-full h-8 w-8 outline outline-2 outline-offset-1 outline-gray-200 overflow-hidden focus-within:outline-blue-500 focus-within:outline-4'>
                            <input type='color' value={preferences.edge.color} className='h-10 w-10 -translate-x-1 -translate-y-1' onChange={setEdgeLabelColor}></input>
                        </div>   
                    </div>


                    <div className='flex justify-between items-center space-x-8'>
                        <span className="">Default Node Border Color</span>
                        <div className='relative rounded-full h-8 w-8 outline outline-2 outline-offset-1 outline-gray-200 overflow-hidden focus-within:outline-blue-500 focus-within:outline-4'>
                            <input type='color' value={preferences.node.borderColor} className='h-10 w-10 -translate-x-1 -translate-y-1' onChange={setNodeBorderColor}></input>
                        </div>   
                    </div>


                </div>


            </Popover.Panel>
        </div>

    </Popover>)
}
