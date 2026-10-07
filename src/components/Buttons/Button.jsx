import { useEffect } from "react";
import { matchesShortcut } from "config/keyboardShortcuts";

export default function Button({ shortcut, callback, onClick, className, children }) {
    useEffect(() => {
        function onKeyDown(event) {
            if (!matchesShortcut(event, shortcut)) {
                return;
            }
            event.preventDefault();
            callback();
        }
        shortcut && window.addEventListener("keydown", onKeyDown);
        return(() => window.removeEventListener("keydown", onKeyDown));
    }, [shortcut, callback]);

    return(
        <div
            className={`flex items-center justify-center pointer-events-auto select-none cursor-pointer rounded-lg text-lg font-semibold transition-all ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
