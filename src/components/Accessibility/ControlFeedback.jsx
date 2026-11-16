/**
 * Announces controls and dialog introductions.
 * @author Henry Tavares
 */
import { useEffect, useRef } from "react";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";
import SharedWorker from "globals/SharedWorker";

function controlName(control) {
    const labelledBy = control.getAttribute("aria-labelledby");
    if (labelledBy) {
        return labelledBy.split(" ").map(id => document.getElementById(id)?.textContent || "").join(" ").trim();
    }
    return control.getAttribute("aria-label")
        || Array.from(control.labels || []).map(label => label.textContent).join(" ")
        || control.textContent.trim()
        || control.getAttribute("title");
}

export default function ControlFeedback() {
    const lastFocusedControl = useRef(null);
    const introducedDialogs = useRef(new WeakSet());

    useEffect(() => {
        function announce(text) {
            if (window.location.pathname === "/") {
                SpeechInterface.interruptAndSpeak(text);
            } else {
                SharedWorker.postMessage({ message: "ui-feedback", payload: text });
            }
        }

        function onFocus(event) {
            const control = event.target.closest('button, a, input, select, textarea, [role="button"], [role="switch"], [role="tab"]');
            // Read each control once until focus moves elsewhere.
            if (control === lastFocusedControl.current) {
                return;
            }
            lastFocusedControl.current = control;
            if (!control || control.closest('.monaco-editor')) {
                return;
            }
            const name = controlName(control);
            if (name) {
                let state = "";
                if (control.hasAttribute("aria-checked")) {
                    state = control.getAttribute("aria-checked") === "true" ? ", on" : ", off";
                } else if (control.type === "checkbox") {
                    state = control.checked ? ", checked" : ", unchecked";
                }
                const dialog = control.closest('[role="dialog"]');
                if (dialog && !introducedDialogs.current.has(dialog)) {
                    introducedDialogs.current.add(dialog);
                    if (control.closest('[data-workflow-dialog]')) {
                        return;
                    }
                    const summary = dialog.querySelector('[data-focus-summary]')?.getAttribute('data-focus-summary');
                    if (summary) {
                        announce(summary);
                        return;
                    }
                    const introduction = dialog.querySelector('[data-focus-introduction]')?.getAttribute('data-focus-introduction')
                        || `Welcome to ${controlName(dialog) || "this dialog"}.`;
                    let instruction = "Use Tab to move between controls.";
                    if (/^close\b/i.test(name)) {
                        instruction = "Press Enter to close, or Tab to explore.";
                    }
                    announce(`${introduction} ${name}${state} is selected. ${instruction}`);
                    return;
                }
                announce(name + state);
            }
        }

        function onClick(event) {
            const control = event.target.closest('button, a, [role="button"]');
            if (!control || control.closest('[data-workflow-dialog]')) {
                return;
            }
            const name = controlName(control);
            if (name) {
                announce("Selected " + name);
            }
        }

        function onChange(event) {
            const control = event.target;
            if (!control.matches('select, input[type="checkbox"], input[type="range"]')) {
                return;
            }
            const name = controlName(control);
            if (name) {
                let value = control.value;
                if (control.type === "checkbox") {
                    value = control.checked ? "on" : "off";
                } else if (control.tagName === "SELECT") {
                    value = control.selectedOptions[0]?.textContent || value;
                }
                announce(name + ", " + value);
            }
        }

        document.addEventListener("focusin", onFocus);
        document.addEventListener("click", onClick, true);
        document.addEventListener("change", onChange);
        return () => {
            document.removeEventListener("focusin", onFocus);
            document.removeEventListener("click", onClick, true);
            document.removeEventListener("change", onChange);
        };
    }, []);
    return null;
}
