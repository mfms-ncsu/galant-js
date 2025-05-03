import { useEffect } from 'react';
import onAddTab from 'components/Tabs/TabList'
import TabInterface from "interfaces/TabInterface/TabInterface";
import Tab from "components/Tabs/Tab";

const PopupWindow = ({ examples }) => {

  useEffect(() => {
    const popup = window.open(
      '',
      '_blank',
      'width=400,height=400,scrollbars=yes,resizable=yes'
    );

    const handleClick = (option) => {
      // Call the function passed as a prop
      console.log('PopupWindow, handleClick, option =', option);
      onAddTab(option);
      // onAddTab(option)
    //        onLinkClick(option);
      popup.close(); // Optionally close the popup after clicking
    };
    
      if (popup) {
      const popupDocument = popup.document;
      popupDocument.write('<!DOCTYPE html><html><head><title>Popup</title></head><body></body></html>');
      popupDocument.close();

      const root = popupDocument.createElement('div');
      popupDocument.body.appendChild(root);

      examples.map(option => {
        console.log("in PopupWindow, option =", option);
        const optionElement = popupDocument.createElement('div');
        optionElement.style.marginBottom = '10px';

        const linkElement = popupDocument.createElement('a');
        linkElement.href = '#';
        linkElement.textContent = option.name;
        linkElement.style.fontWeight = 'bold';
        linkElement.style.display = 'block';
        linkElement.onclick = (e) => {
          e.preventDefault();
          handleClick({ option });
        }

        const descriptionElement = popupDocument.createElement('span');
//        descriptionElement.textContent = ` - ${description}`;

        optionElement.appendChild(linkElement);
        optionElement.appendChild(descriptionElement);
        root.appendChild(optionElement);
      })
    }

    return () => popup && popup.close(); // Clean up the popup when the component unmounts
  }, [examples, handleClick]);

  return null; // This component doesn't render anything itself
};

export default PopupWindow;