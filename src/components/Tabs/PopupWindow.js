import React, { useEffect } from 'react';

const PopupWindow = ({ options, onLinkClick }) => {
  useEffect(() => {
    const popup = window.open(
      '',
      '_blank',
      'width=400,height=400,scrollbars=yes,resizable=yes'
    );

    if (popup) {
      const popupDocument = popup.document;
      popupDocument.write('<!DOCTYPE html><html><head><title>Popup</title></head><body></body></html>');
      popupDocument.close();

      const root = popupDocument.createElement('div');
      popupDocument.body.appendChild(root);

      const handleClick = (option) => {
        // Call the function passed as a prop
        onLinkClick(option);
        popup.close(); // Optionally close the popup after clicking
      };

      options.forEach(({ name, description, link }, index) => {
        const optionElement = popupDocument.createElement('div');
        optionElement.style.marginBottom = '10px';

        const linkElement = popupDocument.createElement('a');
        linkElement.href = '#';
        linkElement.textContent = name;
        linkElement.style.fontWeight = 'bold';
        linkElement.style.display = 'block';
        linkElement.onclick = (e) => {
          e.preventDefault();
          handleClick({ name, description, link });
        };

        const descriptionElement = popupDocument.createElement('span');
        descriptionElement.textContent = ` - ${description}`;

        optionElement.appendChild(linkElement);
        optionElement.appendChild(descriptionElement);
        root.appendChild(optionElement);
      });
    }

    return () => popup && popup.close(); // Clean up the popup when the component unmounts
  }, [options, onLinkClick]);

  return null; // This component doesn't render anything itself
};

export default PopupWindow;