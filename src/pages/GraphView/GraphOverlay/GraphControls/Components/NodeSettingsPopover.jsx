import { Popover, Switch } from '@headlessui/react'
import { useEffect, useState, useRef } from 'react'
import { useGraphContext } from 'pages/GraphView/utils/GraphContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

/**
 * BinarySwitchComponent renders a binary switch component.
 * @param {Object} props - The props for the BinarySwitchComponent.
 * @param {boolean} props.enabled - Indicates whether the switch is enabled.
 * @param {Function} props.setEnabled - Function to toggle the switch.
 * @returns {JSX.Element} - Returns the JSX for BinarySwitchComponent.
 */
function BinarySwitchComponent({enabled, setEnabled}) {
    return (
        <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${
                enabled ? 'bg-gradient-to-r from-indigo-500 to-blue-500' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
        <span className="sr-only">Toggle</span>
        <span
            className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
        </Switch>
    )
}

/**
 * NodeSettingsPopover component renders a popover for node settings.
 * @returns {JSX.Element} - Returns the JSX for NodeSettingsPopover component.
 */
export default function NodeSettingsPopover() {
    const hasMounted = useRef(false);
    const [displayLabels, setDisplayLabels] =  useState(true);
    const [displayWeights, setDisplayWeights] =  useState(true);
    const [nodeRadius, setNodeRadius] = useState(25);

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

            // Only if user enters designated keyboard shortcut - n - the button is clicked
            if (event.key !== 'n') return;
            button.current.click();
        }

        document.addEventListener('keypress', onKeyPress);
        return () => document.removeEventListener('keypress', onKeyPress);
    }, []);

    // Effect to update display labels preference
    useEffect(() => {
        if (!hasMounted.current) return; // Don't update preferences on mount cycle
        //preferences.node.textOpacity = displayLabels ? 1 : 0;
        preferences.node.hideLabel = !displayLabels;
        graphContext.preferences.setStylePreferences({...preferences})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayLabels]);

    // Effect to update display weights preference
    useEffect(() => {
        if (!hasMounted.current) return; // Don't update preferences on mount cycle
        preferences.node.hideWeight = !displayWeights;
        graphContext.preferences.setStylePreferences({...preferences})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayWeights]);

    // Effect to update node radius preference
    useEffect(() => {
        const timeOut = setTimeout(() => {
            preferences.node.size.x = nodeRadius;
            preferences.node.size.y = nodeRadius;
            graphContext.preferences.setStylePreferences({...preferences});
        }, 5);

        return () => clearTimeout(timeOut);
    }, [nodeRadius]);

    // Effect to set hasMounted to true after mount
    useEffect(() => {
        hasMounted.current = true;
    }, []);

    
    return (
        <Popover className="relative">
            <Popover.Button ref={button} className="group h-8 w-15 p-1 pointer-events-auto preference-button">
                <label>Nodes (n)</label>
                {/* <img src='img/NodeIcon.svg' alt='node settings icon' className='group-focus:scale-105' /> */}
            </Popover.Button>

            <Popover.Panel unmount={false} className="absolute z-10 right-1/2 translate-x-1/8 w-max p-4 pt-2 mt-4 rounded min-h-24 bg-white border border-gray-200 shadow pointer-events-auto">
                <p className='text-lg font-semibold text-center'>Node Settings</p>

                <div className="flex flex-col space-y-4 mt-4">
                    <div className='flex justify-between align-middle space-x-6'>
                        <span className='text-gray-700 font-medium'>Display Labels</span>
                        <BinarySwitchComponent enabled={displayLabels} setEnabled={setDisplayLabels}/>
                    </div>

                    <div className='flex justify-between align-middle space-x-6'>
                        <span className='text-gray-700 font-medium'>Display Weights</span>
                        <BinarySwitchComponent enabled={displayWeights} setEnabled={setDisplayWeights}/>
                    </div>

                    <div>
                        <div className='flex justify-between align-middle space-x-6'>
                            <span className='text-gray-700 font-medium'>Node Radius</span>
                            <input className='appearance-none text-sm font-semibold text-blue-500' size={Math.max(nodeRadius.toString().length, 2)} type="text" value={nodeRadius} onChange={(event) => setNodeRadius(event.target.value)} />
                        </div>
                        <Slider 
                            value={nodeRadius}
                            onChange={setNodeRadius}
                            styles={{track: {
                                background: 'linear-gradient(to right, #6610f2, #007bff)'
                            }}}
                        />
                    </div>
                </div>
            </Popover.Panel>
        </Popover>
    )
}
