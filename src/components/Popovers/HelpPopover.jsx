import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAtom, useAtomValue } from "jotai";
import shortcuts, { matchesShortcut, shortcutHint, setShortcutMode } from "config/keyboardShortcuts";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";
import HelpButton from "components/Buttons/HelpButton";
import { gskModeAtom, speechEnabledAtom, speechSpeedAtom } from "states/_atoms/atoms";
import { helpSections, helpTitle, speakHelpSection } from "content/userInstructions";

/**
 * In-app help dialog with section navigation for text-to-speech.
 * Arrow keys move between sections.
 */
export default function HelpPopover() {
    const gskMode = useAtomValue(gskModeAtom);
    const [, setSpeechEnabled] = useAtom(speechEnabledAtom);
    const [, setSpeechSpeed] = useAtom(speechSpeedAtom);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRefs = useRef([]);
    const announcedOpen = useRef(false);

    const toggleSpeech = useCallback(() => {
        setSpeechEnabled(enabled => !enabled);
        SpeechInterface.announceSpeechState();
    }, [setSpeechEnabled]);

    const toggleHelp = useCallback(() => {
        setIsOpen((open) => !open);
    }, []);

    useEffect(() => {
        function openHelp() {
            setIsOpen(true);
        }
        window.addEventListener("open-help", openHelp);
        return () => window.removeEventListener("open-help", openHelp);
    }, []);

    const selectSection = useCallback((index) => {
        setActiveIndex((index + helpSections.length) % helpSections.length);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setActiveIndex(0);
            announcedOpen.current = false;
            return undefined;
        }

        setShortcutMode("help");
        return () => {
            SpeechInterface.cancelSpeech();
            setShortcutMode(gskMode ? "gsk" : "default");
        };
    }, [isOpen, gskMode]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const firstOpen = !announcedOpen.current;
        announcedOpen.current = true;

        if (!firstOpen && SpeechInterface.spoken()) {
            SpeechInterface.interruptAndSpeak(speakHelpSection(activeIndex));
        }
        sectionRefs.current[activeIndex]?.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
        });
    }, [isOpen, activeIndex]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        function onKeyDown(event) {
            if (matchesShortcut(event, shortcuts.toggleSpeech)) {
                event.preventDefault();
                event.stopPropagation();
                toggleSpeech();
            } else if (matchesShortcut(event, shortcuts.helpIncreaseSpeechSpeed)) {
                event.preventDefault();
                event.stopPropagation();
                setSpeechSpeed(speed => Math.min(10, speed + 0.25));
            } else if (matchesShortcut(event, shortcuts.helpDecreaseSpeechSpeed)) {
                event.preventDefault();
                event.stopPropagation();
                setSpeechSpeed(speed => Math.max(0.25, speed - 0.25));
            } else if (matchesShortcut(event, shortcuts.helpPreviousSection)) {
                event.preventDefault();
                event.stopPropagation();
                selectSection(activeIndex - 1);
            } else if (matchesShortcut(event, shortcuts.helpNextSection)) {
                event.preventDefault();
                event.stopPropagation();
                selectSection(activeIndex + 1);
            } else if (matchesShortcut(event, shortcuts.helpRepeatSection)) {
                // Let Space activate the focused control.
                if (event.target.closest('button, a, [role="button"], [role="switch"]')) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                if (SpeechInterface.spoken()) {
                    SpeechInterface.interruptAndSpeak(speakHelpSection(activeIndex));
                }
            } else if (matchesShortcut(event, shortcuts.helpClose)) {
                event.preventDefault();
                event.stopPropagation();
                setIsOpen(false);
            }
        }

        window.addEventListener("keydown", onKeyDown, true);
        return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [isOpen, activeIndex, selectSection, toggleSpeech, setSpeechSpeed]);

    return (
        <>
            <HelpButton shortcut={shortcuts.openHelp} callback={toggleHelp} onClick={toggleHelp}>
                Help{shortcutHint(shortcuts.openHelp)}
            </HelpButton>

            <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                    <Dialog.Panel 
                        data-focus-introduction="Welcome to Help. Use up and down arrows to move between sections." 
                        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl dark:bg-gray-900 dark:text-gray-100">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div>
                                <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {helpTitle}
                                </Dialog.Title>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Up and down arrows move between sections. Space repeats the current section.
                                    Space activates a focused button.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                aria-label="Close help"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex min-h-0 flex-1">
                            <nav
                                className="w-56 shrink-0 overflow-y-auto border-r bg-gray-50 p-3 dark:bg-gray-800"
                                aria-label="Help sections"
                            >
                                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Section {activeIndex + 1} of {helpSections.length}
                                </p>
                                <ul className="space-y-1">
                                    {helpSections.map((section, index) => {
                                        const selected = index === activeIndex;
                                        return (
                                            <li key={section.id}>
                                                <button
                                                    type="button"
                                                    aria-current={selected ? "true" : undefined}
                                                    onClick={() => selectSection(index)}
                                                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                                                        selected
                                                            ? "bg-blue-600 font-semibold text-white"
                                                            : "text-gray-800 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700"
                                                    }`}
                                                >
                                                    {section.title}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>

                            <div
                                className="min-w-0 flex-1 overflow-y-auto px-6 py-4 text-gray-800 dark:text-gray-100"
                                tabIndex={0}
                                aria-label="Galant user instructions"
                            >
                                {helpSections.map((section, index) => {
                                    const selected = index === activeIndex;
                                    return (
                                        <section
                                            key={section.id}
                                            ref={(element) => {
                                                sectionRefs.current[index] = element;
                                            }}
                                            data-help-section={section.id}
                                            aria-current={selected ? "true" : undefined}
                                            className={`mb-4 rounded-xl border p-4 ${
                                                selected
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {section.title}
                                            </h2>
                                            {section.paragraphs?.map((paragraph) => (
                                                <p key={paragraph} className="mb-2">
                                                    {paragraph}
                                                </p>
                                            ))}
                                            {section.items && (
                                                <ol className="list-decimal space-y-1 pl-6">
                                                    {section.items.map((item) => (
                                                        <li key={item}>{item}</li>
                                                    ))}
                                                </ol>
                                            )}
                                        </section>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end border-t px-6 py-4 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg bg-blue-500 px-5 py-2 font-medium text-white hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
}
