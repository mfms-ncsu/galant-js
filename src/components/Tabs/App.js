import React from 'react';
import PopupWindow from './PopupWindow';

function App() {
  const options = [
    { name: 'Option 1', description: 'This is the first option' },
    { name: 'Option 2', description: 'This is the second option' },
    { name: 'Option 3', description: 'This is the third option' },
  ];

  const handleOptionSelect = (selectedOption) => {
    alert(`You selected: ${selectedOption}`);
  };

  return (
    <div>
      <h1>Popup Example</h1>
      <PopupWindow options={options} onOptionSelect={handleOptionSelect} />
    </div>
  );
}

export default App;