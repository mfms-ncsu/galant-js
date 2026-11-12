import { useEffect, useRef } from "react";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";
import { matchesShortcut } from "config/keyboardShortcuts";

export default function Button({ shortcut, callback, onClick, className, children }) {
    const buttonRef = useRef();
    useEffect(() => {
        function onKeyDown(event) {
            if (!matchesShortcut(event, shortcut)) {
                return;
            }
            event.preventDefault();
            const label = buttonRef.current?.textContent.trim();
            if (label) {
                SpeechInterface.interruptAndSpeak("Selected " + label);
            }
            callback();
        }
        shortcut && window.addEventListener("keydown", onKeyDown);
        return(() => window.removeEventListener("keydown", onKeyDown));
    }, [shortcut, callback]);

    return(
        <div
            ref={buttonRef}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={event => {
                if (onClick && event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    event.currentTarget.click();
                }
            }}
            className={`flex items-center justify-center pointer-events-auto select-none cursor-pointer rounded-lg text-lg font-semibold transition-all ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
