import React, { useState } from 'react';
import PopupWindow from './PopupWindow';
import addTab from 'interfaces/TabInterface/TabInterface'

  const App = ({addTab, examples}) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleLinkClick = (option) => {
    console.log('Link clicked:', option);
    addTab(option)
  };

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Examples</button>
      {showPopup && <PopupWindow examples={examples} onLinkClick={handleLinkClick} />}
    </div>
  );
};

export default App;