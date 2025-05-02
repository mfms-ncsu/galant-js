import React, { useState } from 'react';
import PopupWindow from './PopupWindow';

const App = () => {
  const [showPopup, setShowPopup] = useState(false);

  const options = [
    { name: 'Option 1', description: 'This is the first option', link: '/option1' },
    { name: 'Option 2', description: 'This is the second option', link: '/option2' },
    { name: 'Option 3', description: 'This is the third option', link: '/option3' },
  ];

  const handleLinkClick = (option) => {
    console.log('Link clicked:', option);
    // Perform your desired action here
  };

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Examples</button>
      {showPopup && <PopupWindow options={options} onLinkClick={handleLinkClick} />}
    </div>
  );
};

export default App;