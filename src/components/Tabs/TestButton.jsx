/**
 * TestButton component
 * This is a button that calls a function when clicked.
 * It has a keyboard shortcut (Ctrl+T) to trigger the function.
 * The function logs a message to the console.
 */
import React from 'react';

export default function TestButton() {
    const handleClick = () => {
        console.log("Test button clicked!");
    };

    React.useEffect(() => {
        const onKeyPress = (event) => {
            if (event.code === "KeyT" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                handleClick();
            }
        };
        document.addEventListener("keydown", onKeyPress);
        return () => document.removeEventListener("keydown", onKeyPress);
    }, []);

    return (
        <button onClick={handleClick} className="px-2 py-1 bg-blue-200 hover:bg-blue-400 text-black">
            Test Button (Ctrl+T)
        </button>
    );
}

// Usage example:
// <TestButton />
// This will render a button that logs "Test button clicked!" to the console when clicked or when Ctrl+T is pressed.
// Make sure to include this component in your main application file or wherever you want to use it.
// You can also import it in other components as needed.

// Note: This component is a simple example and can be expanded with more functionality as needed.
// It can be used in any React application where you want to test keyboard shortcuts or button clicks.
// Make sure to test it in a React environment where you can see the console output, such as in a browser's developer tools.
// You can also modify the handleClick function to perform any action you want when the button is clicked or the shortcut is pressed.