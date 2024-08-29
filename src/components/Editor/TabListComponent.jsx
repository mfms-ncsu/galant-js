/**
 * @fileoverview Contains and returns {@link TabListComponent}
 * @author Julian Madrigal
 */


/**
 * @typedef {import("./TabComponent").Tab} Tab
 * @typedef {import("./NewButtonComponent").Example} Example
 */

import { addTab, getSelectedTab } from "./TabUtils";
import TabComponent from "./TabComponent";
import NewButtonComponent from './NewButtonComponent';
import UploadButtonComponent from './UploadButtonComponent';


/**
 * Given a list of tabs, create a tablist component that lists each tab component (@see {@link TabComponent}).
 * Also adds buttons "new" (@see {@link NewButtonComponent}) and "import" (@see {@link UploadButtonComponent}) to the end of component.
 * Contains function handlers for several functionalities such as when a tab is selected, renamed, or deleted. (These could possibly be moved to be closer to their components)
 * @param {Object} props Props 
 * @param {Array<Tab>} props.tabs - List of tab objects
 * @param {Function} props.setTabs Setter for the tabs
 * @param {string} props.acceptFileType The string of comma seperated file extensions to allow
 * @param {Example[]} props.examples The examples of text that the use can add via new dropdown
 * @returns {React.ReactElement} React Component
 */
export default function TabListComponent({tabs, setTabs, acceptFileType, examples}) {

    /**
     * Add list of data imported from file upload by user as tabs.
     * Passed to {@link UploadButtonComponent} as a prop.
     * NOTE: Skips setting tabs until last is added, in order to include all tabs. 
     * @param {Array<{name, tab}>} dataList List of data that should be created and added as tabs.  
     */
    function onFileUpload(dataList) {
        for (let data of dataList) {
            addTab(data, tabs, setTabs, true);
        }

        setTabs([...tabs]);
    }

    function onTabClick(tab) {
        const prev = getSelectedTab(tabs);
        if (prev) prev.selected = false;

        tab.selected = true;
        setTabs([...tabs]);
    }

    function onTabRename(tab, name) {
        if (name.length > 0 && !tabs.find(tab => tab.name === name)) {
            tab.name = name;
        };
        setTabs([...tabs]);
    }

    function onTabRemove(tab) {
        const newTabs = tabs.filter(aTab => aTab !== tab);

        if (tab.selected && newTabs.length > 0) {
            newTabs[0].selected = true;
        }
        
        setTabs(newTabs);
    }

    
    return (
        /**
         * @todo SD 2024-8
         * I'm not sure what a tab component is. You may want to see where this is used and/or play around with changes and see what effect they have.
         */
    <div className="flex items-end space-x-[2px] max-w-[98%]">
        <div className="flex overflow-x-auto space-x-[2px] pt-1">
            {tabs.map((tab) => <TabComponent key={tab.name} tab={tab} onClick={onTabClick} onRename={onTabRename} onRemove={onTabRemove} />)}
        </div>
        <NewButtonComponent 
            addTab={(data) => {return addTab(data, tabs, setTabs)}} // Wrapper of addTab
            examples={examples} />
        <UploadButtonComponent onUpload={onFileUpload} acceptFileType={acceptFileType}/>
    </div>
    )
}

