import React from 'react'

/**
 * @param closeWindow - window is opened by client, needs to be closed after addNew
 */
const PopupWindow = ({examples, handleSelection}) => {

  // useEffect(() => {
  //   const popup = window.open(
  //     '',
  //     '_blank',
  //     'width=400,height=400,scrollbars=yes,resizable=yes'
  //   );

    const handleClick = (option) => {
      // Call the function passed as a prop
      console.log('PopupWindow, handleClick, option =', option);
      handleSelection(option);
    };

    return(
      <div>
      <h2>Options</h2>
      <ul>
        {examples.map((option, index) => (
          <li key={index}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleClick(option);
              }}
            >
              {option.name}
            </a>{' '}
            - add description
          </li>
        ))}
      </ul>
    </div>
    );
};

export default PopupWindow;