import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import shortcuts, { matchesShortcut, shortcutHint, setShortcutMode } from "config/keyboardShortcuts";
import PrimaryButton from "components/Buttons/PrimaryButton";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";
import SharedWorker from "globals/SharedWorker";

function speakExample(examples, index) {
    const example = examples[index];
    if (!example) {
        return "";
    }
    const description = (example.description || "").trim();
    const parts = [`Example ${index + 1} of ${examples.length}. ${example.name}.`];
    if (description) {
        parts.push(description);
    }
    return parts.join(" ");
}

function announce(text) {
    if (!text) {
        return;
    }
    if (window.location.pathname === "/") {
        SpeechInterface.interruptAndSpeak(text);
    } else {
        SharedWorker.postMessage({ message: "ui-feedback", payload: text });
    }
}

/**
 * In-app examples dialog with section navigation, matching help.
 * Arrow keys move between examples. Enter loads the selected example.
 */
export default function ExamplesButton({ examples, addNew }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRefs = useRef([]);
    const announcedOpen = useRef(false);

    const toggleExamples = useCallback(() => {
        setIsOpen((open) => !open);
    }, []);

    const selectSection = useCallback((index) => {
        if (!examples.length) {
            return;
        }
        setActiveIndex((index + examples.length) % examples.length);
    }, [examples.length]);

    const loadExample = useCallback((example) => {
        if (!example) {
            return;
        }
        addNew(example);
        setIsOpen(false);
    }, [addNew]);

    useEffect(() => {
        function onKeyPress(event) {
            if (matchesShortcut(event, shortcuts.openExamples)) {
                event.preventDefault();
                toggleExamples();
            }
        }
        document.addEventListener("keydown", onKeyPress);
        return () => document.removeEventListener("keydown", onKeyPress);
    }, [toggleExamples]);

    useEffect(() => {
        if (!isOpen) {
            setActiveIndex(0);
            announcedOpen.current = false;
            return undefined;
        }

        setShortcutMode("examples");
        return () => {
            SpeechInterface.cancelSpeech();
            setShortcutMode("default");
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const firstOpen = !announcedOpen.current;
        announcedOpen.current = true;

        if (!firstOpen) {
            announce(speakExample(examples, activeIndex));
        }
        sectionRefs.current[activeIndex]?.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
        });
    }, [isOpen, activeIndex, examples]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        function onKeyDown(event) {
            if (matchesShortcut(event, shortcuts.examplesPreviousSection)) {
                event.preventDefault();
                event.stopPropagation();
                selectSection(activeIndex - 1);
            } else if (matchesShortcut(event, shortcuts.examplesNextSection)) {
                event.preventDefault();
                event.stopPropagation();
                selectSection(activeIndex + 1);
            } else if (matchesShortcut(event, shortcuts.examplesSelect)) {
                event.preventDefault();
                event.stopPropagation();
                loadExample(examples[activeIndex]);
            } else if (matchesShortcut(event, shortcuts.examplesClose)) {
                event.preventDefault();
                event.stopPropagation();
                setIsOpen(false);
            }
        }

        window.addEventListener("keydown", onKeyDown, true);
        return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [isOpen, activeIndex, examples, selectSection, loadExample]);

    return (
        <div>
            <PrimaryButton className="m-1">
                <button onClick={toggleExamples}>Examples{shortcutHint(shortcuts.openExamples)}</button>
            </PrimaryButton>

            <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                    <Dialog.Panel
                        data-focus-introduction="Welcome to Examples. Use up and down arrows to move between examples. Press Enter to select."
                        data-focus-summary={`Welcome to Examples. Use up and down arrows to move between examples. Press Enter to select. ${speakExample(examples, 0)}`}
                        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl dark:bg-gray-900 dark:text-gray-100"
                    >
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div>
                                <Dialog.Title data-cy="ExamplesHeader" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Examples
                                </Dialog.Title>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Up and down arrows move between examples. Enter selects the current example.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                aria-label="Close examples"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex min-h-0 flex-1">
                            <nav
                                className="w-56 shrink-0 overflow-y-auto border-r bg-gray-50 p-3 dark:bg-gray-800"
                                aria-label="Example sections"
                            >
                                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Example {examples.length ? activeIndex + 1 : 0} of {examples.length}
                                </p>
                                <ul className="space-y-1">
                                    {examples.map((example, index) => {
                                        const selected = index === activeIndex;
                                        return (
                                            <li key={example.name || index}>
                                                <button
                                                    type="button"
                                                    aria-current={selected ? "true" : undefined}
                                                    onClick={() => loadExample(example)}
                                                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                                                        selected
                                                            ? "bg-blue-600 font-semibold text-white"
                                                            : "text-gray-800 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700"
                                                    }`}
                                                >
                                                    {example.name}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>

                            <div
                                className="min-w-0 flex-1 overflow-y-auto px-6 py-4 text-gray-800 dark:text-gray-100"
                                tabIndex={0}
                                aria-label="Example descriptions"
                            >
                                {examples.map((example, index) => {
                                    const selected = index === activeIndex;
                                    return (
                                        <section
                                            key={example.name || index}
                                            ref={(element) => {
                                                sectionRefs.current[index] = element;
                                            }}
                                            aria-current={selected ? "true" : undefined}
                                            className={`mb-4 rounded-xl border p-4 ${
                                                selected
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {example.name}
                                            </h2>
                                            <pre className="whitespace-pre-wrap font-sans">
                                                {example.description ? example.description : ""}
                                            </pre>
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
        </div>
    );
}
