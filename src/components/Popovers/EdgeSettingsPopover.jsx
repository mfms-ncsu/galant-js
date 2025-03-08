import { useRef } from 'react';
import { useAtom } from 'jotai';
import { graphAtom } from 'states/_atoms/atoms';
import { Popover, Switch } from '@headlessui/react';
import PreferenceButton from 'components/Buttons/PreferenceButton';
import GraphInterface from 'interfaces/GraphInterface/GraphInterface';

/**
 * Binary switch component.
 */
function BinarySwitchComponent({ enabled, setEnabled }) {
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
 * Popover for edge settings.
 */
export default function EdgeSettingsPopover() {
    const [graph, setGraph] = useAtom(graphAtom);

    // Ref for popover button
    const button = useRef(null);

    // Function to toggle the popover menu
    function toggle() {
        button.current && button.current.click();
    }
   
    return (
        <Popover className="relative">
            <PreferenceButton shortcut="e" callback={toggle} buttonRef={button}>
                Edges (e)
            </PreferenceButton>

            <Popover.Panel className="absolute right-0 z-10 w-64 p-4 pt-2 rounded-xl bg-white shadow-lg pointer-events-auto">
                <p className='text-lg font-semibold text-center'>Edge Settings</p>

                <div className="flex flex-col space-y-2 mt-2">
                    <div className='flex justify-between align-middle'>
                        <span className='text-gray-700 font-medium'>Display Labels</span>
                        <BinarySwitchComponent enabled={graph.showEdgeLabels} setEnabled={val => setGraph(GraphInterface.setShowEdgeLabels(graph, val))} />
                    </div>

                    <div className='flex justify-between align-middle'>
                        <span className='text-gray-700 font-medium'>Display Weights</span>
                        <BinarySwitchComponent enabled={graph.showEdgeWeights} setEnabled={val => setGraph(GraphInterface.setShowEdgeWeights(graph, val))} />
                    </div>

                    <div className='flex justify-between align-middle'>
                        <span className='text-gray-700 font-medium'>Directed</span>
                        <BinarySwitchComponent enabled={graph.isDirected} setEnabled={val => setGraph(GraphInterface.setDirected(graph, val))} />
                    </div>
                </div>
            </Popover.Panel>
        </Popover>
    );
}
