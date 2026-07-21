import React from 'react';
import ReactDOM from 'react-dom/client';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PopupWindow from 'components/Tabs/PopupWindow';

/**
 * Returns component for creating new tabs, including the button and popup.
 */
export default function ExamplesButton({examples, addNew}) {
  React.useEffect(() => {
        function onKeyPress(event) {
            if (event.code === "KeyE" && event.ctrlKey && event.shiftKey) {
              event.preventDefault();
              openPopup();
            }
        }
        document.addEventListener("keydown", onKeyPress);
        return () => document.removeEventListener("keydown", onKeyPress);
    }, []);

  const openPopup = () => {
    const popupWindow = window.open(
      '',
      '_blank',
      'width=1000,height=600,scrollbars=yes,resizable=yes'
    );

    const handleSelection = (selection) => {
      addNew(selection);
      popupWindow.close();
    }

    if (popupWindow) {
      popupWindow.document.title = 'Popup Window';

      // Render the React component in the new window
      const container = popupWindow.document.createElement('div');
      popupWindow.document.body.appendChild(container);

      ReactDOM.createRoot(container).render(<PopupWindow examples={examples} handleSelection={handleSelection} />);
    } else {
      alert('Popup blocked! Please allow popups for this website.');
    }
  }

  return (
    <div>
      <PrimaryButton className="m-1">
        <button onClick={() => openPopup(true)}>Examples (Ctrl-Shift-E)</button>
      </PrimaryButton>
    </div>
  );
}
