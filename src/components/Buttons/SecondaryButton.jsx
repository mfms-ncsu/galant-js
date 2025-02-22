import Button from "./Button";

export default function SecondaryButton({ shortcut, callback, onClick, className, children }) {
    return(
        <
            Button
            shortcut={shortcut}
            callback={callback}
            onClick={onClick}
            className={`px-2 py-1 bg-neutral-500 hover:bg-neutral-600 text-white ${className}`}
        >
            {children}
        </Button>
    );
}