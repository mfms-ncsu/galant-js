import { useEffect, useState } from 'react';
import shortcuts, {matchesShortcut} from 'config/keyboardShortcuts';
import { useAtom } from 'jotai';
import { Dialog, Switch } from '@headlessui/react';
import {
    speechEnabledAtom,
    speechSpeedAtom,
    gskModeAtom,
    appearanceAtom,
    graphThemePresets,
    defaultAppearance,
    editorPreferencesAtom,
    defaultEditorPreferences
} from 'states/_atoms/atoms';
import SpeechInterface from 'interfaces/SpeechInterface/SpeechInterface';

export default function UserPreferencesPopover() {
    const [isOpen, setIsOpen] = useState(false);
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [speechEnabled, setSpeechEnabled] = useAtom(speechEnabledAtom);
    const [speechSpeed, setSpeechSpeed] = useAtom(speechSpeedAtom);
    const [gskMode, setGskMode] = useAtom(gskModeAtom);
    const [speechSpeedInput, setSpeechSpeedInput] = useState(String(speechSpeed));
    const [appearance, setAppearance] = useAtom(appearanceAtom);
    const [editorPreferences, setEditorPreferences] =
        useAtom(editorPreferencesAtom);

    function changeEditorPreference(property, value) {
        setEditorPreferences(current => ({
            ...current,
            [property]: value
        }));
    }

    function selectTheme(theme) {
        setAppearance({
            theme,
            ...graphThemePresets[theme]
        });
    }

    function changeColor(property, value) {
        setAppearance(current => ({
            ...current,
            theme: "custom",
            [property]: value
        }));
    }

    useEffect(() => {
        setSpeechSpeedInput(String(speechSpeed));
    }, [speechSpeed]);

    useEffect(() => {
        function onKeyDown(event) {
            if (matchesShortcut(event, shortcuts.toggleSpeech)) {
                event.preventDefault();
                setSpeechEnabled(enabled => !enabled);
                SpeechInterface.announceSpeechState();
                return;
            }
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [setSpeechEnabled, setGskMode]);

    function changeGskMode(enabled) {
        setGskMode(enabled);
        SpeechInterface.announceGskState(enabled);
    }

    function handleSpeechToggle(enabled) {
        setSpeechEnabled(enabled);
        SpeechInterface.announceSpeechState();
    }

    function handleSpeechSpeedChange() {
        const input = speechSpeedInput.trim();
        const parsedSpeed = Number(input);

        // Reject empty or invalid input.
        if (input === '' || !Number.isFinite(parsedSpeed)) {
            setSpeechSpeedInput(String(speechSpeed));
            return;
        }

        // Limit speed between 0.25x and 10x.
        const clampedSpeed = Math.min(10, Math.max(0.25, parsedSpeed));

        // Round to increments of 0.25x.
        const roundedSpeed = Math.round(clampedSpeed * 4) / 4;

        // Save the new speed and update the input.
        setSpeechSpeed(roundedSpeed);
        setSpeechSpeedInput(String(roundedSpeed));
    }

    /** Rests the prefrences to their default values. */
    function handleReset() {
        setSpeechEnabled(false);
        setSpeechSpeed(1);
        setSpeechSpeedInput('1');
        setAppearance(defaultAppearance);
        setEditorPreferences(defaultEditorPreferences);
        SpeechInterface.announceSpeechState();
    }


    return (
        <>
           <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="pointer-events-auto block rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow hover:bg-gray-100"
            >
                User Preferences
            </button>

            <Dialog
                open={isOpen}
                onClose={setIsOpen}
                className="relative z-50"
            >
                <div
                    className="fixed inset-0 bg-black/40"
                    aria-hidden="true"
                />

                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                    <Dialog.Panel className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex shrink-0 items-center justify-between">
                            <Dialog.Title className="text-xl font-bold text-gray-900">
                                User Preferences
                            </Dialog.Title>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                                aria-label="Close user preferences"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                            {/* Speech settings */}
                            <section className="mb-6">
                                <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
                                    Speech
                                </h2>
                                <div className="ml-4 space-y-5">
                                    {/* Speech Enabled */}
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="font-medium text-gray-700">
                                            Enabled
                                        </span>

                                        <Switch
                                            checked={speechEnabled}
                                            onChange={handleSpeechToggle}
                                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full ${
                                                speechEnabled ? 'bg-blue-500' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span className="sr-only">Enable speech</span>
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    speechEnabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </Switch>
                                    </div>    
                                    {/* Speech Speed */}
                                    <div className="flex items-start justify-between gap-4">
                                        <label
                                            htmlFor="speech-speed"
                                            className="pt-1 font-medium text-gray-700"
                                        >
                                            Speed
                                        </label>

                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1">
                                                <input
                                                    id="speech-speed"
                                                    type="number"
                                                    min="0.25"
                                                    max="10"
                                                    step="0.25"
                                                    value={speechSpeedInput}
                                                    onChange={(event) =>
                                                        setSpeechSpeedInput(event.target.value)
                                                    }
                                                    onBlur={handleSpeechSpeedChange}
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Enter') {
                                                            handleSpeechSpeedChange();
                                                            event.currentTarget.blur();
                                                        }
                                                    }}
                                                    className="speech-speed-input w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-600">x</span>
                                            </div>

                                            <p className="mt-1 text-right text-xs text-gray-500">
                                                Enter a speed from 0.25x to 10x in increments of 0.25.
                                            </p>
                                        </div>
                                    </div>
                                    {/* GSK Mode */}
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="font-medium text-gray-700">
                                            GSK Mode
                                        </span>

                                        <Switch
                                            checked={gskMode}
                                            onChange={changeGskMode}
                                            className={`${
                                                gskMode ? 'bg-blue-500' : 'bg-gray-200'
                                            } relative inline-flex h-6 w-11 shrink-0 items-center rounded-full`}
                                        >
                                            <span className="sr-only">Toggle GSK Mode</span>
                                            <span
                                                className={`${
                                                    gskMode ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                            />
                                        </Switch>
                                    </div>    
                                </div>
                            </section>
                            
                        {/* Appearance settings */}
                        <section className="mb-6">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
                                Appearance
                            </h2>
                            <div className="ml-4 space-y-4">
                                <p className="text-sm font-medium text-gray-700">
                                    Theme
                                </p>
                                {/* Theme options */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Light Mode */}
                                    <button
                                        type="button"
                                        onClick={() => selectTheme("light")}
                                        aria-pressed={appearance.theme === "light"}
                                        className={`flex flex-col items-center gap-2 rounded-lg border-2 bg-white p-3 text-gray-700 ${
                                            appearance.theme === "light" ? "border-blue-500" : "border-gray-300"
                                        }`}
>
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-7 w-7"
                                        >
                                            <circle cx="12" cy="12" r="4" />
                                            <path d="M12 2v2 M12 20v2 M4.93 4.93l1.42 1.42 M17.65 17.65l1.42 1.42 M2 12h2 M20 12h2 M4.93 19.07l1.42-1.42 M17.65 6.35l1.42-1.42" />
                                        </svg>
                                        <span className="text-sm font-medium">Light</span>
                                    </button>
                                    {/* Dark Mode */}
                                    <button
                                        type="button"
                                        onClick={() => selectTheme("dark")}
                                        aria-pressed={appearance.theme === "dark"}
                                        className={`flex flex-col items-center gap-2 rounded-lg border-2 bg-white p-3 text-gray-700 ${
                                            appearance.theme === "dark" ? "border-blue-500" : "border-gray-300"
                                        }`}
>
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-7 w-7"
                                        >
                                            <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
                                        </svg>
                                        <span className="text-sm font-medium">Dark</span>
                                    </button>
                                </div>
                                {/* Collapsible Advanced Settings */}
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setAdvancedOpen(open => !open)}
                                        aria-expanded={advancedOpen}
                                        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-50"
                                    >
                                        <span>Advanced Settings</span>

                                        <svg
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={`h-5 w-5 transition-transform ${
                                                advancedOpen ? 'rotate-180' : ''
                                            }`}
                                        >
                                            <path d="m5 7.5 5 5 5-5" />
                                        </svg>
                                    </button>

                                    {advancedOpen && (
                                        <div className="space-y-4 border-t border-gray-200 px-4 py-4">
                                            <p className="text-xs text-gray-500">
                                                Customize the colors used in the graph.
                                            </p>

                                            {/* Background */}
                                            <div className="flex items-center justify-between gap-3">
                                                <label htmlFor="background-color" className="text-sm text-gray-700">
                                                    Background
                                                </label>
                                                <input
                                                    id="background-color"
                                                    type="color"
                                                    value={appearance.background}
                                                    onChange={event => changeColor("background", event.target.value)}
                                                    className="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
                                                />
                                            </div>

                                            {/* Labels */}
                                            <div className="flex items-center justify-between gap-3">
                                                <label htmlFor="label-color" className="text-sm text-gray-700">
                                                    Labels (text)
                                                </label>
                                                <input
                                                    id="label-color"
                                                    type="color"
                                                    value={appearance.text}
                                                    onChange={event => changeColor("text", event.target.value)}
                                                    className="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
                                                />
                                            </div>

                                            {/* Nodes */}
                                            <div className="flex items-center justify-between gap-3">
                                                <label htmlFor="node-color" className="text-sm text-gray-700">
                                                    Nodes
                                                </label>
                                                <input
                                                    id="node-color"
                                                    type="color"
                                                    value={appearance.node}
                                                    onChange={event => changeColor("node", event.target.value)}
                                                    className="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
                                                />
                                            </div>

                                            {/* Edges */}
                                            <div className="flex items-center justify-between gap-3">
                                                <label htmlFor="edge-color" className="text-sm text-gray-700">
                                                    Edges (Lines)
                                                </label>
                                                <input
                                                    id="edge-color"
                                                    type="color"
                                                    value={appearance.edge}
                                                    onChange={event => changeColor("edge", event.target.value)}
                                                    className="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                        <section className="mb-6">
                            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
                                Editor Windows
                            </h2>

                            <div className="ml-4 space-y-4">
                                <label className="flex items-center justify-between gap-4">
                                    <span>Font</span>
                                    <select
                                        value={editorPreferences.fontFamily}
                                        onChange={event =>
                                            changeEditorPreference("fontFamily", event.target.value)
                                        }
                                        className="rounded border p-2"
                                    >
                                        <option value="monospace">Monospace</option>
                                        <option value="Menlo">Menlo</option>
                                        <option value="Consolas">Consolas</option>
                                        <option value="Courier New">Courier New</option>
                                    </select>
                                </label>

                                <label className="flex items-center justify-between gap-4">
                                    <span>Font size</span>
                                    <select
                                        value={editorPreferences.fontSize}
                                        onChange={event =>
                                            changeEditorPreference("fontSize", Number(event.target.value))
                                        }
                                        className="rounded border p-2"
                                    >
                                        {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                                            <option key={size} value={size}>{size}px</option>
                                        ))}
                                    </select>
                                </label>

                                <label className="flex items-center justify-between gap-4">
                                    <span>Text color</span>
                                    <input
                                        type="color"
                                        value={editorPreferences.foreground}
                                        onChange={event =>
                                            changeEditorPreference("foreground", event.target.value)
                                        }
                                    />
                                </label>

                                <label className="flex items-center justify-between gap-4">
                                    <span>Background color</span>
                                    <input
                                        type="color"
                                        value={editorPreferences.background}
                                        onChange={event =>
                                            changeEditorPreference("background", event.target.value)
                                        }
                                    />
                                </label>
                            </div>
                        </section>
                    </div>
                        {/* Reset and Done buttons */}
                        <div className="mt-4 flex shrink-0items-center justify-between border-t pt-4">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Reset
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg bg-blue-500 px-5 py-2 font-medium text-white hover:bg-blue-600"
                            >
                                Done
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
}
