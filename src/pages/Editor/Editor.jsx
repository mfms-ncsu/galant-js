import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import TabInterface from "interfaces/TabInterface/TabInterface";
import MonacoEditor from '@monaco-editor/react';
import Overlay from "./Overlay";
import TabList from "components/Tabs/TabList";
import algorithms from 'data/algorithms.json';
import graphs from 'data/graphs.json';
import * as threadFunctions from 'states/Algorithm/Thread.js';
import { editorPreferencesAtom } from "states/_atoms/atoms";

/**
 * Returns the monaco editor
 */
function InnerEditor({ tab, editorType, onChange }) {
    const [editorPreferences] = useAtom(editorPreferencesAtom);
    const [monacoApi, setMonacoApi] = useState(null);

    useEffect(() => {
        if (!monacoApi) return;

        monacoApi.editor.defineTheme("galant-user-theme", {
            base: "vs",
            inherit: false,
            rules: [
                {
                    token: "",
                    foreground: editorPreferences.foreground.replace("#", "")
                }
            ],
            colors: {
                "editor.foreground": editorPreferences.foreground,
                "editor.background": editorPreferences.background,
                "editorCursor.foreground": editorPreferences.foreground,
                "editorLineNumber.foreground": editorPreferences.foreground,
                "editorLineNumber.activeForeground": editorPreferences.foreground,
                "editorGutter.background": editorPreferences.background
            }
        });

        monacoApi.editor.setTheme("galant-user-theme");
    }, [
        monacoApi,
        editorPreferences.foreground,
        editorPreferences.background
    ]);
    return (
        <MonacoEditor
            value={tab?.content}
            onChange={onChange}
            onMount={(_editor, monaco) => setMonacoApi(monaco)}
            path={tab?.name}
            language={editorType === "Algorithm" ? "Algorithm-Language" : "markdown"}
            beforeMount={(monaco) => {
                monaco.languages.register({ id: "Algorithm-Language" });

                // Register the custom language
                monaco.languages.registerCompletionItemProvider("Algorithm-Language", {
                    triggerCharacters: [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"],
                    provideCompletionItems(model, position) {
                        // Get the word at the current position
                        const word = model.getWordUntilPosition(position);
                        const range = {
                            startLineNumber: position.lineNumber,
                            endLineNumber: position.lineNumber,
                            startColumn: word.startColumn,
                            endColumn: word.endColumn
                        };

                        // Gets functions from thread.js and converts to monaco suggestions
                        const suggestions = Object.keys(threadFunctions).map((name) => ({
                            label: name,
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: `${name}()`,
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            detail: "Thread function",
                            range: range
                        }));

                        return { suggestions };
                    },
                });
            }}
            options={{
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
                fontFamily: editorPreferences.fontFamily,
                fontSize: editorPreferences.fontSize,
            }}
        />
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
