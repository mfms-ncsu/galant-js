import React, { useEffect } from "react";

const PopupOptions = ({ options, onOptionSelect, onClose }) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (onClose) {
        onClose();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [onClose]);

  const handleOptionClick = (option) => {
    if (onOptionSelect) {
      onOptionSelect(option);
    }
    if (window.opener) {
      window.close();
    }
  };

  return (
    <div>
      <h1>Choose an Option</h1>
      <ul>
        {options.map((option, index) => (
          <li key={index}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleOptionClick(option);
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

export default PopupOptions;