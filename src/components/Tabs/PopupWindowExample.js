import React, { useRef } from "react";

interface Option {
  name: string;
  description: string;
  onClick: () => void;
}

const PopupWindowExample: React.FC = () => {
  const popupRef = useRef<Window | null>(null);

  const options: Option[] = [
    {
      name: "Option 1",
      description: "This is the description for Option 1.",
      onClick: () => handleOptionClick("Option 1"),
    },
    {
      name: "Option 2",
      description: "This is the description for Option 2.",
      onClick: () => handleOptionClick("Option 2"),
    },
    {
      name: "Option 3",
      description: "This is the description for Option 3.",
      onClick: () => handleOptionClick("Option 3"),
    },
  ];

  const handleOptionClick = (optionName: string) => {
    alert(`You selected: ${optionName}`);
    closePopup();
  };

  const openPopup = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
      return;
    }

    const popup = window.open(
      "",
      "_blank",
      "width=400,height=400,scrollbars=no,resizable=no"
    );

    if (popup) {
      popup.document.title = "Select an Option";
      popup.document.body.innerHTML = "<div id='popup-root'></div>";
      popupRef.current = popup;

      // Render the options inside the new window
      const popupRoot = popup.document.getElementById("popup-root");
      if (popupRoot) {
        const popupContent = (
          <PopupContent
            options={options}
            closePopup={() => popup.close()}
          />
        );
        const popupReactRoot = window.ReactDOM.createRoot(popupRoot);
        popupReactRoot.render(popupContent);
      }
    }
  };

  const closePopup = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
  };

  return (
    <div>
      <button onClick={openPopup}>Open Popup</button>
    </div>
  );
};

const PopupContent: React.FC<{ options: Option[]; closePopup: () => void }> = ({
  options,
  closePopup,
}) => {
  return (
    <div>
      <h1>Select an Option</h1>
      <ul>
        {options.map((option, index) => (
          <li key={index}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                option.onClick();
                closePopup();
              }}
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

export default PopupWindowExample;