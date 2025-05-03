import React, { useState } from 'react';
import { useAtom } from "jotai";
import PopupWindow from './PopupWindow';
//import onAddTab from 'components/Tabs/TabList'

  const App = ({tabs, examples}) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleLinkClick = (option) => {
    // console.log('Link clicked:', option);
    // onAddTab(option)
  };

  console.log("in App, examples =", examples);
  // const [tabs, setTabs] = useAtom(tabsAtom);
  // setTabs([...tabs]);
  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Examples</button>
      {showPopup && <PopupWindow tabs={tabs} examples={examples} onLinkClick={handleLinkClick} />}
    </div>
  );
};

export default App;