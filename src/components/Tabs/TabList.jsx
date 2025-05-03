import TabInterface from "interfaces/TabInterface/TabInterface";
import Tab from "./Tab";
import NewButton from './NewButton';
import PopupWindow from './PopupWindow'
import UploadButton from './UploadButton';

/**
 * Header section containing the GalantJS logo
 */
function Header({ children }) {
    return (
        <div className="w-full h-16 p-1 flex items-start justify-between bg-neutral-400">
            <img src="img/galant_full_logo_without_words.svg" alt="GalantJS" className="m-1 h-full w-auto"/>

            <div className="flex">
                {children}
            </div>
        </div>
    );
}

/**
 * Given a list of tabs, create a tablist component that lists each tab component (@see {@link Tab}).
 * Also adds buttons "new" (@see {@link NewButton}) and "import" (@see {@link UploadButton}) to the end of component.
 * Contains function handlers for several functionalities such as when a tab is selected, renamed, or deleted.
 */
export default function TabList({tabs, setTabs, acceptFileType, examples}) {
    function onAddTab(data) {
        console.log("-> onAddTab, data =", data);
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

    console.log("In TabList: examples =", examples, "tabs =", tabs);    
    return (
        <>
            <Header>
                <PopupWindow onLinkClick={onAddTab} examples={examples} />
                <UploadButton onUpload={onFileUpload} acceptFileType={acceptFileType}/>
            </Header>

            <div className="flex bg-neutral-400">
                <div className="min-w-full flex space-x-1 overflow-x-scroll">
                    {tabs.map(tab => 
                        <Tab key={tab.name} tab={tab} onClick={onTabClick} onRename={onTabRename} onRemove={onTabRemove} />
                    )}
                </div>
            </div>
        </>
    );
}

