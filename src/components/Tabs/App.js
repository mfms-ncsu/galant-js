import React, { useState } from 'react';
import { useAtom } from "jotai";
import PopupWindow from './PopupWindow';
//import onAddTab from 'components/Tabs/TabList'

  const App = ({examples}) => {
  const [showPopup, setShowPopup] = useState(false);

  console.log("in App, examples =", examples);
  // const [tabs, setTabs] = useAtom(tabsAtom);
  // setTabs([...tabs]);
  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Examples</button>
      {showPopup && <PopupWindow examples={examples} />}
    </div>
  );
};

export default App;