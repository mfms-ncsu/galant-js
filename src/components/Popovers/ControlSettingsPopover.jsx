import Cytoscape from 'globals/Cytoscape';
import { Popover } from '@headlessui/react'
import PreferenceButton from 'components/Buttons/PreferenceButton';
import SecondaryButton from 'components/Buttons/SecondaryButton';
import { useRef } from 'react'

/**
 * Popover for control settings.
 */
export default function ControlSettingsPopover() {
    // Ref for popover button
    const button = useRef(null);

    // Function to handle auto camera action
    function autoCamera() {
        Cytoscape.fit();
    }

    // Function to handle auto layout action
    function autoLayout() {
        Cytoscape.layout({ name: "cose-bilkent" });
    }

    // Function to toggle the popover menu
    function toggle() {
        button.current && button.current.click();
    }
   
    return (
        <Popover className="relative">
            <PreferenceButton shortcut="v" callback={toggle} buttonRef={button}>
                Layout (v)
            </PreferenceButton>

            <Popover.Panel className="absolute right-0 z-10 w-64 p-4 pt-2 rounded-xl bg-white shadow-lg pointer-events-auto">
                <p className='text-lg font-semibold text-center'>Controls</p>
                <SecondaryButton onClick={autoCamera} className="my-2">Auto Camera</SecondaryButton>
                <SecondaryButton onClick={autoLayout}>Auto Layout</SecondaryButton>
            </Popover.Panel>
        </Popover>
    );
}
