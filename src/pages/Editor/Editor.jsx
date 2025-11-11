import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import TabInterface from "interfaces/TabInterface/TabInterface";
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import Overlay from "./Overlay";
import TabList from "components/Tabs/TabList";
import algorithms from 'data/algorithms.json';
import graphs from 'data/graphs.json';
import * as threadFunctions from 'states/Algorithm/Thread.js';

function InnerEditor({ tab, editorType, onChange }) {
    return (
        <MonacoEditor
            value={tab?.content}
            onChange={onChange}
            path={tab?.name}
            language={editorType === "Algorithm" ? "Algorithm-Language" : "markdown"}

            beforeMount={(monaco) => {
                monaco.languages.register({ id: "Algorithm-Language" });

                const suggestions = Object.keys(threadFunctions).map((name) => ({
                    label: name,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: `${name}()`,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: "Thread function",
                }));

                monaco.languages.registerCompletionItemProvider("Algorithm-Language", {
                    triggerCharacters: [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"],
                    provideCompletionItems() {
                        return { suggestions };
                    },
                });
            }}
            options={{
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
            }}
        />
    );
}

export default function Editor({ editorType, tabsAtom }) {
    const [tabs, setTabs] = useAtom(tabsAtom);
    const selectedTab = TabInterface.getSelectedTab(tabs);
    const [saved, setSaved] = useState(true);

    function onEditorChange(value) {
        selectedTab.content = value;
        setTabs([...tabs]);
        setSaved(false);
    }

    useEffect(() => {
        setSaved(true);
    }, [tabs]);

    return (
        <div className="flex flex-col h-full">
            <TabList
                tabs={tabs}
                setTabs={setTabs}
                examples={editorType === "Algorithm" ? algorithms : graphs}
                acceptFileType={editorType === "Algorithm" ? ".js" : ".txt, .gph, .sgf, .tree"}
            />
            <InnerEditor tab={selectedTab} editorType={editorType} onChange={onEditorChange} />
            <Overlay tab={selectedTab} saved={saved} editorType={editorType} />
        </div>
    );
}
