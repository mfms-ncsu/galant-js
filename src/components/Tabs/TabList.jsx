import { addTab, getSelectedTab } from "./TabUtils";
import Tab from "./Tab";
import NewButton from './NewButton';
import UploadButton from './UploadButton';

/**
 * Given a list of tabs, create a tablist component that lists each tab component (@see {@link Tab}).
 * Also adds buttons "new" (@see {@link NewButton}) and "import" (@see {@link UploadButton}) to the end of component.
 * Contains function handlers for several functionalities such as when a tab is selected, renamed, or deleted. (These could possibly be moved to be closer to their components)
 * @param {Object} props Props 
 * @param {Array<Tab>} props.tabs - List of tab objects
 * @param {Function} props.setTabs Setter for the tabs
 * @param {string} props.acceptFileType The string of comma seperated file extensions to allow
 * @param {Example[]} props.examples The examples of text that the use can add via new dropdown
 * @returns {React.ReactElement} React Component
 */
export default function TabList({tabs, setTabs, acceptFileType, examples}) {
    /**
     * Add list of data imported from file upload by user as tabs.
     * Passed to {@link UploadButton} as a prop.
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
        <div className="flex justify-between bg-neutral-300">
            <div className={`flex items-end w-full ${(tabs.length > 0 && !tabs[tabs.length-1].selected) && "space-x-1"}`}>
                <div className="flex">
                    {tabs.map((tab, i) => 
                        <div key={i} className="relative">
                            <Tab key={tab.name} tab={tab} onClick={onTabClick} onRename={onTabRename} onRemove={onTabRemove} />
                            {!(tab.selected || (tabs[i+1] && tabs[i+1].selected)) && <span className="absolute bg-black w-px right-0 top-1 bottom-1"></span>}
                        </div>
                    )}
                </div>

                <NewButton 
                    addTab={(data) => {return addTab(data, tabs, setTabs)}}
                    examples={examples}
                />
            </div>
            <UploadButton onUpload={onFileUpload} acceptFileType={acceptFileType}/>
        </div>
    )
}

