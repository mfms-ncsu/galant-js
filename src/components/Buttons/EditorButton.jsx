import Button from "./Button";

export default function EditorButton({ shortcut, callback, onClick, className, children }) {
    return(
        <
            Button
            shortcut={shortcut}
            callback={callback}
            onClick={onClick}
            className={`px-2 py-1 bg-yellow-300 hover:bg-yellow-400 ${className}`}
        >
            {children}
        </Button>
    );
}