import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAtomValue } from "jotai";
import shortcuts, { matchesShortcut, shortcutHint, setShortcutMode } from "config/keyboardShortcuts";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";
import HelpButton from "components/Buttons/HelpButton";
import { gskModeAtom } from "states/_atoms/atoms";
import { helpSections, helpTitle, speakHelpSection } from "content/userInstructions";

/**
 * In-app help dialog with section navigation for text-to-speech.
 * While open, only help shortcuts apply. Up and down arrows move between sections.
 */
export default function HelpPopover() {
    const gskMode = useAtomValue(gskModeAtom);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRefs = useRef([]);
    const announcedOpen = useRef(false);
    const narrateHelp = useRef(false);

    const toggleHelp = useCallback(() => {
        setIsOpen((open) => !open);
    }, []);

    const selectSection = useCallback((index) => {
        setActiveIndex((index + helpSections.length) % helpSections.length);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setActiveIndex(0);
            announcedOpen.current = false;
            narrateHelp.current = false;
            return undefined;
        }

        narrateHelp.current = SpeechInterface.spoken();
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

        const prefix = announcedOpen.current
            ? ""
            : "Help. Use up and down arrows to move between sections. ";
        announcedOpen.current = true;

        if (narrateHelp.current) {
            SpeechInterface.interruptAndSpeak(`${prefix}${speakHelpSection(activeIndex)}`);
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
            if (matchesShortcut(event, shortcuts.helpPreviousSection)) {
                event.preventDefault();
                event.stopPropagation();
                selectSection(activeIndex - 1);
            } else if (matchesShortcut(event, shortcuts.helpNextSection)) {
                event.preventDefault();
                event.stopPropagation();
                selectSection(activeIndex + 1);
            } else if (matchesShortcut(event, shortcuts.helpRepeatSection)) {
                event.preventDefault();
                event.stopPropagation();
                if (narrateHelp.current) {
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
    }, [isOpen, activeIndex, selectSection]);

    return (
        <>
            <HelpButton shortcut={shortcuts.openHelp} callback={toggleHelp} onClick={toggleHelp}>
                Help{shortcutHint(shortcuts.openHelp)}
            </HelpButton>

            <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                    <Dialog.Panel className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div>
                                <Dialog.Title className="text-xl font-bold text-gray-900">
                                    {helpTitle}
                                </Dialog.Title>
                                <p className="mt-1 text-sm text-gray-600">
                                    Up and down arrows move between sections. Space repeats the current section.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                                aria-label="Close help"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex min-h-0 flex-1">
                            <nav
                                className="w-56 shrink-0 overflow-y-auto border-r bg-gray-50 p-3"
                                aria-label="Help sections"
                            >
                                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
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
                                                            : "text-gray-800 hover:bg-gray-200"
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
                                className="min-w-0 flex-1 overflow-y-auto px-6 py-4 text-gray-800"
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
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <h2 className="mb-2 text-lg font-semibold text-gray-900">
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

                        <div className="flex justify-end border-t px-6 py-4">
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
