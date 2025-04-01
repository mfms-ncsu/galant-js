import { useRef } from 'react';
import { useAtom } from 'jotai';
import { graphAtom } from 'states/_atoms/atoms';
import { Popover, Switch } from '@headlessui/react';
import PreferenceButton from 'components/Buttons/PreferenceButton';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import GraphInterface from 'interfaces/GraphInterface/GraphInterface';

/**
 * Binary switch component.
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
    );
}

/**
 * Popover for node settings.
 */
export default function NodeSettingsPopover() {
    const [graph, setGraph] = useAtom(graphAtom);
    
    // Ref for popover button
    const button = useRef(null);

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
                        <BinarySwitchComponent enabled={graph.showNodeLabels} setEnabled={val => setGraph(GraphInterface.setShowNodeLabels(graph, val))} />
                    </div>

                    <div className='flex justify-between align-middle'>
                        <span className='text-gray-700 font-medium'>Display Weights</span>
                        <BinarySwitchComponent enabled={graph.showNodeWeights} setEnabled={val => setGraph(GraphInterface.setShowNodeWeights(graph, val))} />
                    </div>

                    <div>
                        <div className='flex justify-between align-middle'>
                            <span className='text-gray-700 font-medium'>Node Radius</span>
                            <span className='text-sm font-semibold text-blue-500'>{graph.nodeSize}</span>
                        </div>
                        <Slider 
                            value={graph.nodeSize}
                            onChange={val => setGraph(GraphInterface.setNodeSize(graph, val))}
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
    );
}
