import { useEffect } from "react";

export default function Button({ shortcut, callback, onClick, className, children }) {
    useEffect(() => {
        function onKeyDown(event) {
            console.log(event.key);

            if (event.target.tagName.toLowerCase() === 'input') return;
            if (event.key === shortcut) callback();
        }
        shortcut && window.addEventListener("keydown", onKeyDown);
        return(() => window.removeEventListener("keydown", onKeyDown));
    }, []);

    return(
        <div
            className={`flex items-center justify-center pointer-events-auto select-none cursor-pointer rounded-lg transition-all ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}