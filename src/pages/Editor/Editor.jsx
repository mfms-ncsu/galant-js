import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import TabInterface from "interfaces/TabInterface/TabInterface";
import MonacoEditor from '@monaco-editor/react';
import Overlay from "./Overlay"
import TabList from "../../components/Tabs/TabList";
import algorithms from 'data/algorithms.json';
import graphs from 'data/graphs.json';

/**
 * Header section containing the GalantJS logo
 */
function Header() {
    return (
        <div className="flex items-start justify-between px-2 pt-1 w-auto h-12 bg-neutral-300">
            <img src="img/galant_full_logo_without_words.svg" alt="logo" className="h-full w-auto"/>
        </div>
    );
}

/**
 * Returns the monaco editor
 */
function InnerEditor({tab, editorType, onChange}) {
    return tab && (
        <div className="w-full h-full mt-2">
            <MonacoEditor
                onChange={onChange}
                path={tab.name}
                defaultLanguage={(editorType === "Algorithm") ? "javascript" : "markdown"}
                defaultValue={tab.content}
            />
        </div>
    );
}

/**
 * EditorGroup that defines the tabs list and monaco editor into a component
 */
export default function Editor({ editorType, tabsAtom }) {
    const [tabs, setTabs] = useAtom(tabsAtom); // State for managing tabs
    const selectedTab = TabInterface.getSelectedTab(tabs); // Get the currently selected tab
    const [saved, setSaved] = useState(true); // State for tracking whether changes are saved

    // Handler for editor content change
    function onEditorChange(value) {
        // Update the content of the selected tab
        selectedTab.content = value;

        // Update the tabs state to trigger re-render
        setTabs([...tabs]);

        // Set saved to false
        setSaved(false);
    }

    // Once tabs' value updates, set saved back to true
    useEffect(() => {
        setSaved(true);
    }, [tabs]);

    return (
        <>
            <Header />
            <div className="flex flex-col h-full">
                <TabList tabs={tabs} setTabs={setTabs} examples={(editorType === "Algorithm") ? algorithms : graphs} acceptFileType={(editorType === "Algorithm") ? ".js" : ".txt, .gph, .sgf"} />
                <InnerEditor tab={selectedTab} onChange={onEditorChange} />
                <Overlay tab={selectedTab} saved={saved} editorType={editorType} />
            </div>
        </>
        
    );
}