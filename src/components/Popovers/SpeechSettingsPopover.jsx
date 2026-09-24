import { useAtom } from 'jotai';
import { speechEnabledAtom, speechSpeedAtom } from 'states/_atoms/atoms';
import { Popover, Switch } from '@headlessui/react';
import PreferenceButton from 'components/Buttons/PreferenceButton';
import SpeechInterface from 'interfaces/SpeechInterface/SpeechInterface';

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
 * Popover for speech settings.
 */
export default function SpeechSettingsPopover() {
    const [speechEnabled, setSpeechEnabled] = useAtom(speechEnabledAtom);
    const [speechSpeed, setSpeechSpeed] = useAtom(speechSpeedAtom);

    // Function to toggle speech
    function toggle() {
        setSpeechEnabled(enabled => !enabled);
        SpeechInterface.announceSpeechState();
    }
    
    return (
        <Popover className="relative">
            <PreferenceButton shortcut="v" callback={toggle}>
                Speech
            </PreferenceButton>

            <Popover.Panel unmount={false} className="absolute right-0 z-10 w-72 p-4 pt-2 rounded-xl bg-white shadow-lg pointer-events-auto">
                <p className='text-lg font-semibold text-center'>Speech Settings</p>

                <div className="flex flex-col space-y-2 mt-2">
                    <div className='flex justify-between align-middle'>
                        <span className='text-gray-700 font-medium'>Speech On</span>
                        <BinarySwitchComponent enabled={speechEnabled} setEnabled={val => setSpeechEnabled(val)} />
                    </div>

                    <div>
                        <div>
                            <div className="flex justify-between align-middle mb-2">
                                <span className="text-gray-700 font-medium">Speech Speed</span>
                                <span className="text-sm font-semibold text-blue-500">
                                    {speechSpeed}x
                                </span>
                            </div>

                            <div className="flex w-full">
                                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                                    <button
                                        key={speed}
                                        onClick={() =>
                                            setSpeechSpeed(speed)
                                        }
                                        className={`flex-1 px-1 py-1 text-sm border ${
                                            speechSpeed === speed
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        {speed}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Popover.Panel>
        </Popover>
    );
}
