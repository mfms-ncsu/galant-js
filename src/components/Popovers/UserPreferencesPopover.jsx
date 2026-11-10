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

/**
 * Shows speech, GSK, graph appearance, and editor settings.
 *
 * HOW SETTINGS WORK
 * Controls update the shared atoms defined in atoms.js.
 * Graph and editor components read those atoms and apply changes.
 * Appearance, editor settings, and speech speed use browser storage.
 * Speech starts off when the application opens.
 *
 * PANEL LAYOUT
 * max-h-[85vh] limits the panel to 85% of the browser window height.
 * max-w-lg limits its width.
 * The settings area scrolls while the title and action buttons stay visible.
 * Tailwind p-, m-, gap-, and space- classes control spacing.
 *
 * SPEECH SPEED
 * The supported range is 0.25 to 10, in steps of 0.25.
 * Multiplying by 4, rounding, and dividing by 4 gives quarter steps.
 * Keep these values consistent with speechSpeedAtom and speed shortcuts.
 *
 * GRAPH COLORS
 * graphThemePresets in atoms.js defines Light, Dark, and palette colors.
 * Light/Dark also updates editor colors.
 * Palette circles change graph colors without changing Light/Dark mode.
 * Each circle has four 90-degree slices: background, node, edge, and text.
 * Individual color changes mark the palette as custom.
 *
 * EDITORS
 * Font sizes are listed in pixels in the editor-size dropdown.
 * Font names use fonts available on the user's device.
 * Custom editor text color is under Advanced editor settings.
 * Editor.jsx applies these settings to both Monaco editor windows.
 *
 * ICONS
 * SVG paths draw the sun, moon, and expand/collapse icons.
 * viewBox sets their drawing area; h- and w- classes set display size.
 * Icon coordinates do not control graph colors or settings.
 *
 * RESET
 * Restores default graph and editor settings, turns speech off,
 * and sets speech speed to 1.
 */
export default function UserPreferencesPopover() {
    const [isOpen, setIsOpen] = useState(false);
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [speechEnabled, setSpeechEnabled] = useAtom(speechEnabledAtom);
    const [speechSpeed, setSpeechSpeed] = useAtom(speechSpeedAtom);
    const [gskMode, setGskMode] = useAtom(gskModeAtom);
    const [speechSpeedInput, setSpeechSpeedInput] = useState(String(speechSpeed));
    // Read the saved graph colors and selected theme.
    const [appearance, setAppearance] = useAtom(appearanceAtom);
    // Share font, size, and color settings with both editor windows.
    const [editorPreferences, setEditorPreferences] =
        useAtom(editorPreferencesAtom);

    /**
    * Changes one editor setting.
    * Called by the editor font, size, and text-color controls.
    * @param {string} property Setting to change.
    * @param {string|number} value New value.
    */
    function changeEditorPreference(property, value) {
        setEditorPreferences(current => ({
            ...current,//keep other editing settings
            [property]: value//update the selected setting
        }));
    }

    /**
    * Applies Light or Dark to the graph and editor colors.
    * @param {string} theme Selected mode: light or dark.
    */
    function selectTheme(theme) {
        const colors = graphThemePresets[theme];// Get this theme's colors

        setAppearance({
            theme,// Save Light or Dark as the selected mode
            palette: null,// Clear the previous palette selection
            ...colors// Apply the theme's default graph colors
        });

        // Keep the editor font and size; update its colors.
        setEditorPreferences(current => ({
            ...current,// Keep the editor font and size
            foreground: colors.text,// Apply the theme's text color
            background: colors.background// Apply the theme's background
        }));
    }

    /**
    * Changes graph colors without changing the selected Light/Dark mode.
    * @param {string} palette Name of the selected graph palette.
    */
    function selectPalette(palette) {
        setAppearance(current => ({
            ...current,// Keep the selected Light/Dark mode
            palette,// Save the selected palette name
            ...graphThemePresets[palette]// Apply its graph colors
        }));
    }

    /** Changes one graph color without changing Light/Dark mode. */
    function changeColor(property, value) {
        setAppearance(current => ({
            ...current, // Keep the other appearance settings
            palette: "custom", // The colors no longer match a preset
            [property]: value // Update the selected color
        }));
    }
    // Update the input when speech speed changes elsewhere, such as a shortcut.
    useEffect(() => {
        setSpeechSpeedInput(String(speechSpeed));// Show the current speed as text
    }, [speechSpeed]);// Run again when the saved speed changes
    // Keep the V shortcut available even when the preferences panel is closed.
    
    useEffect(() => {
        /**
        * Toggles speech when its shortcut is pressed.
        * The shortcut matcher ignores typing in input fields.
        * @param {KeyboardEvent} event Keyboard event from the window.
        */
        function onKeyDown(event) {
            if (matchesShortcut(event, shortcuts.toggleSpeech)) {
                event.preventDefault();// Stop the key's normal browser action
                setSpeechEnabled(enabled => !enabled);// Switch speech on or off
                SpeechInterface.announceSpeechState();// Say the new speech state
                return;// Finish handling this key
            }
        }

        window.addEventListener("keydown", onKeyDown);// Listen for the shortcut
        return () => window.removeEventListener("keydown", onKeyDown);// Remove the listener during cleanup
    }, [setSpeechEnabled, setGskMode]);// Reattach if a listed setter changes

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

    /** Restores the default speech, graph, and editor settings. */
    function handleReset() {
        setSpeechEnabled(false);
        setSpeechSpeed(1);
        setSpeechSpeedInput('1');
        setAppearance(defaultAppearance);// Restore default graph colors
        setEditorPreferences(defaultEditorPreferences);// Restore default editor settings
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

                                {/* Show five graph palettes as circles with colored slices. */}
                                <fieldset>
                                    <legend className="mb-3 text-sm font-medium text-gray-700">
                                        Color palettes
                                    </legend>
                                    {/* Keep all five palette choices in one row. */}
                                    <div className="grid grid-cols-5 gap-2">
                                        {[
                                            ["blueOrange", "Blue–Orange"],
                                            ["ocean", "Ocean"],
                                            ["forest", "Forest"],
                                            ["plum", "Plum"],
                                            ["sand", "Sand"]
                                        ].map(([key, name]) => {
                                            const palette = graphThemePresets[key]; // Get the colors for this circle.
                                            const selected = appearance.palette === key; // Check whether this palette is selected.

                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => selectPalette(key)} // Apply and save this palette.
                                                    aria-label={`${name} graph palette`}
                                                    aria-pressed={selected}
                                                    className={`flex min-w-0 flex-col items-center gap-2 rounded-lg p-1
                                                        focus-visible:outline focus-visible:outline-2
                                                        focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                                                            selected ? "bg-blue-50" : "hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className={`h-10 w-10 rounded-full border-2 ${
                                                                selected
                                                                    ? "border-blue-600 ring-2 ring-blue-600 ring-offset-2"
                                                                    : "border-gray-400"
                                                            }`}
                                                            style={{
                                                                // Split the circle into four equal color previews.
                                                                background: `conic-gradient(
                                                                ${palette.background} 0deg 90deg,
                                                                ${palette.node} 90deg 180deg,
                                                                ${palette.edge} 180deg 270deg,
                                                                ${palette.text} 270deg 360deg
                                                            )`
                                                        }}
                                                    />
                                                    <span className="text-center text-xs text-gray-700">
                                                        {name}
                                                    </span>
                                                    {selected && (
                                                        <span className="text-xs font-semibold text-blue-700">
                                                            ✓
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </fieldset>
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
                                {/* Use a font available on the user's computer in both editor windows. */}
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
                                {/* Font size applies to both editors; dropdown text is converted to a number. */}
                                <label className="flex items-center justify-between gap-4">
                                    <span>Font size</span>
                                    <select
                                        value={editorPreferences.fontSize}
                                        onChange={event =>
                                            changeEditorPreference("fontSize", Number(event.target.value))
                                        }
                                        className="rounded border p-2"
                                    >
                                        {/* Available editor font sizes, measured in pixels. */}
                                        {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                                            <option key={size} value={size}>{size}px</option>
                                        ))}
                                    </select>
                                </label>

                               {/* Custom text color is optional; the theme sets the background. */}
                                <details className="rounded-lg border border-gray-200 p-3">
                                    <summary className="cursor-pointer text-sm font-medium text-gray-700">
                                        Advanced editor settings
                                </summary>

                                <p className="mt-3 text-xs text-gray-600">
                                    Editor colors follow Light/Dark. Changing themes restores
                                    the default text color.
                                </p>

                                <label className="mt-3 flex items-center justify-between gap-4">
                                    <span>Text color</span>
                                    <input
                                        type="color"
                                        value={editorPreferences.foreground}
                                        onChange={event =>
                                            changeEditorPreference("foreground", event.target.value)
                                        }
                                    />
                                </label>
                            </details>
                            </div>
                        </section>
                    </div>
                        {/* Reset and Done buttons */}
                        <div className="mt-4 flex shrink-0 items-center justify-between border-t pt-4">
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
