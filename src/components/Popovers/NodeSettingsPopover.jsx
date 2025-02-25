import { Popover, Switch } from '@headlessui/react'
import PreferenceButton from 'components/Buttons/PreferenceButton';
import { useEffect, useState, useRef } from 'react'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Graph from 'utils/graph/Graph';

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
                enabled ? 'bg-blue-500' : 'bg-gray-200'
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
    const [displayLabels, setDisplayLabels] =  useState(true);
    const [displayWeights, setDisplayWeights] =  useState(true);
    const [nodeRadius, setNodeRadius] = useState(25);
    
    // Ref for popover button
    const button = useRef(null);

    // Effect to update display labels preference
    useEffect(() => {
        Graph.cytoscapeManager.nodeLabels = displayLabels;
        window.updateCytoscape();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayLabels]);

    // Effect to update display weights preference
    useEffect(() => {
        Graph.cytoscapeManager.nodeWeights = displayWeights;
        window.updateCytoscape();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayWeights]);

    // Effect to update node radius preference
    useEffect(() => {
        Graph.cytoscapeManager.nodeSize = nodeRadius;
        window.updateCytoscape();
    }, [nodeRadius]);

    // Function to toggle the popover menu
    function toggle() {
        button.current && button.current.click();
    }
    
    return (
        <Popover className="relative">
            <PreferenceButton shortcut="n" callback={toggle} buttonRef={button}>
                Nodes (n)
            </PreferenceButton>

            <Popover.Panel unmount={false} className="absolute right-0 z-10 w-64 p-4 pt-2 rounded-xl bg-white shadow-lg pointer-events-auto">
                <p className='text-lg font-semibold text-center'>Node Settings</p>

                <div className="flex flex-col space-y-2 mt-2">
                    <div className='flex justify-between align-middle'>
                        <span className='text-gray-700 font-medium'>Display Labels</span>
                        <BinarySwitchComponent enabled={displayLabels} setEnabled={setDisplayLabels}/>
                    </div>

                    <div className='flex justify-between align-middle'>
                        <span className='text-gray-700 font-medium'>Display Weights</span>
                        <BinarySwitchComponent enabled={displayWeights} setEnabled={setDisplayWeights}/>
                    </div>

                    <div>
                        <div className='flex justify-between align-middle'>
                            <span className='text-gray-700 font-medium'>Node Radius</span>
                            <input className='appearance-none text-sm font-semibold text-blue-500' size={Math.max(nodeRadius.toString().length, 2)} type="text" value={nodeRadius} onChange={(event) => setNodeRadius(event.target.value)} />
                        </div>
                        <Slider 
                            value={nodeRadius}
                            onChange={setNodeRadius}
                            styles={{
                                track: {
                                    background: '#007bff'
                                },
                                handle: {
                                    border: 'none',
                                    background: '#007bff'
                                }
                            }}
                        />
                    </div>
                </div>
            </Popover.Panel>
        </Popover>
    )
}
