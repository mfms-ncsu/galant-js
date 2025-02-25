/**
 * @fileoverview TabUtils.jsx
 * @author Julian Madrigal
 * This file contains helper functions that are used among several files.
 * Instead of passing handlers for specific functionalities,
 * We have passed tabs and setTabs, and had each function use these helper functions
 * To repeat similar functionality in both files.
 */


/**
 * 
 * @param {Array<import("../../pages/GraphEditor/EditorGroup").Tab>} tabs 
 * @returns {import("../../pages/GraphEditor/EditorGroup").Tab}
 */
export function getSelectedTab(tabs) {
    return tabs.find((tab) => tab.selected);
}

export function getTabByName(tabs, name) {
    return tabs.find((tab) => tab.name === name);
}

/**
 * Helper function on creating tabs.
 * Many functions need functionality to create tabs.
 * Creating a helper functionr reduces need for prop drilling
 * @param {Object} data Contains name and content
 * @param {*} tabs Tabs list
 * @param {*} setTabs Tabs setter
 * @param {boolean} skipUpdating When adding multiple tabs (upload), we may want to wait until all are added to set.
 */
export function addTab(data, tabs, setTabs, skipSetTab) {
    let updatedName = data.name;
    let count = 1;
    
    while (getTabByName(tabs, updatedName)) {
        updatedName = data.name + count;
        count++;
    }

    const tab = {name: updatedName, content: data.content || '', selected: true};
    const prev = getSelectedTab(tabs);
    if (prev) prev.selected = false;

    tabs.push(tab);
    if (!skipSetTab) setTabs([...tabs]);

    return tab;
}
