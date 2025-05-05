import React, { useState } from 'react';

function PopupWindow({ options, onOptionSelect }) {
  const openPopup = () => {
    const popup = window.open(
      '',
      'popup',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );

    if (popup) {
      popup.document.body.innerHTML = `
        <div id="popup-root"></div>
      `;

      const rootElement = popup.document.getElementById('popup-root');

      const PopupContent = () => {
        const handleClick = (option) => {
          onOptionSelect(option);
          popup.close();
        };

        return (
          <div style={{ padding: '10px' }}>
            <h1>Select an Option</h1>
            <ul>
              {options.map((option, index) => (
                <li key={index}>
                  <a
                    href="#"
                    onClick={() => handleClick(option.name)}
                    style={{ color: 'blue', textDecoration: 'underline' }}
                  >
                    {option.name}
                  </a>
                  <p>{option.description}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      };

      // Render the React component in the popup window
      ReactDOM.createRoot(rootElement).render(<PopupContent />);
    }
  };

  return (
    <button onClick={openPopup}>Open Popup</button>
  );
}

export default PopupWindow;