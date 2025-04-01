import Button from "./Button";

export default function HelpButton({ shortcut, callback, onClick, className, children }) {
    return(
        <
            Button
            shortcut={shortcut}
            callback={callback}
            onClick={onClick}
            className={`px-2 py-1 bg-lime-300 hover:bg-lime-400 ${className}`}
        >
            {children}
        </Button>
    );
}