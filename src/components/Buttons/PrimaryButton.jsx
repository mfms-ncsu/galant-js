import Button from "./Button";

export default function PrimaryButton({ shortcut, callback, onClick, className, children }) {
    return(
        <
            Button
            shortcut={shortcut}
            callback={callback}
            onClick={onClick}
            className={`px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white ${className}`}
        >
            {children}
        </Button>
    );
}