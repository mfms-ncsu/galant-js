import TabInterface from "interfaces/TabInterface/TabInterface";
import Tab from "./Tab";
import NewButton from './NewButton';
import UploadButton from './UploadButton';

/**
 * Given a list of tabs, create a tablist component that lists each tab component (@see {@link Tab}).
 * Also adds buttons "new" (@see {@link NewButton}) and "import" (@see {@link UploadButton}) to the end of component.
 * Contains function handlers for several functionalities such as when a tab is selected, renamed, or deleted.
 */
export default function TabList({tabs, setTabs, acceptFileType, examples}) {
    function onAddTab(data) {
        setTabs(TabInterface.addTab(tabs, data));
    }

    function onFileUpload(dataList) {
        let newTabs;
        for (let data of dataList) {
            newTabs = TabInterface.addTab(tabs, data);
        }
        setTabs(newTabs);
    }

    function onTabClick(tab) {
        setTabs(TabInterface.setSelected(tabs, tab));
    }

    function onTabRename(tab, name) {
        setTabs(TabInterface.renameTab(tabs, tab, name));
    }

    function onTabRemove(tab) {
        setTabs(TabInterface.deleteTab(tabs, tab));
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

                <NewButton addTab={onAddTab} examples={examples} />
            </div>
            <UploadButton onUpload={onFileUpload} acceptFileType={acceptFileType}/>
        </div>
    );
}

