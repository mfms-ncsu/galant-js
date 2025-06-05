import Button from "./Button";

export default function PrimaryButton({ shortcut, callback, onClick, className, children }) {
    return(
        <
            Button
            shortcut={shortcut}
            callback={callback}
            onClick={onClick}
            className={`px-2 py-1 bg-blue-200 hover:bg-blue-400 text-black ${className}`}
        >
            {children}
        </Button>
    );
}