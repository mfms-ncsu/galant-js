import Button from "./Button";

export default function ExitButton({ shortcut, callback, onClick, className, children }) {
    return(
        <
            Button
            shortcut={shortcut}
            callback={callback}
            onClick={onClick}
            className={`px-2 py-1 bg-red-500 hover:bg-red-600 text-white ${className}`}
        >
            {children}
        </Button>
    );
}