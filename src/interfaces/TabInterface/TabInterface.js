/**
 * Interface for interacting with a tab list state.
 * 
 * @author Henry Morris
 */

/**
 ***********
 * HELPERS *
 ***********
 */

/**
 * Finds a tab with the given name from the list of tabs.
 * @param {Tab[]} tabs List of tabs
 * @param {String} name Name to search for
 * @returns Tab with the given name, if it exists
 */
function getTabByName(tabs, name) {
    return tabs.find((tab) => tab.name === name);
}



/**
 ***********
 * GETTERS *
 ***********
 */

/**
 * Exports the tab content to a file. If the content is detected as JavaScript,
 * the file will be saved with a .js extension, otherwise with a .gph extension.
 * 
 * 
 * TODO: MAKE THIS MORE READABLE
 * 
 * 
 * @param {String} type Tab type (Algorithm/Graph)
 * @param {Tab} tab Tab value
 */
function downloadTab(tab, type) {
    if (!tab) return;
    const isAlgorithm = type === "Algorithm";
    
    //Update the file extension if it is missing or incorrect
    let name = tab.name;
    if (isAlgorithm && !tab.name.match(/\.js$/)) {
        name = name.replace(/\.[a-z]+$/).concat(".js")
    }
    if (!isAlgorithm && !tab.name.match(/\.(?:gph|sgf)$/)) {
        name = name.replace(/\.[a-z]+$/).concat(".gph")
    }
    const ext = name.match(/\.[a-zA-Z0-9]+$/);

    if (window.showSaveFilePicker) {
        (async () => {
            try {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: name,
                    types: [{
                        description: isAlgorithm ? "JavaScript Files" : "Text Files",
                        accept:isAlgorithm ? { "text/javascript": [ext] } : { "text/plain": [ext] },
                    }],
                });
                const writableStream = await fileHandle.createWritable();
                await writableStream.write(tab.content);
                await writableStream.close();
            } catch (error) {
                console.error("Error saving file:", error);
            }
        })();
    } else {
        const fileName = window.prompt("Enter the filename to save:");
        if (!fileName) return;
        const blob = new Blob([tab.content], { type: isAlgorithm ? "text/javascript" : "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

/**
 * Gets the selected tab from a list of tabs.
 * @param {Tab[]} tabs List of tabs
 * @returns Selected tab
 */
function getSelectedTab(tabs) {
    return tabs.find((tab) => tab.selected);
}



/**
 ***********
 * SETTERS *
 ***********
 */

/**
 * Adds a new tab to the tabs list state.
 * @param {Tab[]} tabs Existing tabs
 * @param {Tab} data New tab data
 * @returns Updated tab list
 */
function addTab(tabs, data) {
    // Ensure the tab has a unique name
    let updatedName = data.name;
    let count = 1;
    while (getTabByName(tabs, updatedName)) {
        updatedName = data.name + count;
        count++;
    }

    // Create the new tab and make it selected
    const tab = { name: updatedName, content: data.content || '', selected: true };

    // Deselect the previously selected tab
    const prev = getSelectedTab(tabs);
    if (prev) prev.selected = false;

    // Add the new tab to the list
    tabs.push(tab);

    return [...tabs];
}

/**
 * Updates an existing or adds a new tab to the tabs list state.
 * @param {Tab[]} tabs Existing tabs
 * @param {Tab} data New tab data
 * @returns Updated tab list
 */
function updateTab(tabs, data) {
    // Get the tab
    const tab = getTabByName(tabs, data.name);

    // Update the content if the tab exists or create a new tab
    if (tab) {
        tab.content = data.content;
    } else {
        return addTab(tabs, data);
    }

    return [...tabs];
}

/**
 * Deletes the given tab.
 * @param {Tab[]} tabs List of tabs
 * @param {Tab} tab Tab to delete
 * @returns Updated tab list
 */
function deleteTab(tabs, tab) {
    // Filter out the given tab
    tabs = tabs.filter(aTab => aTab !== tab);

    // If the removed tab was selected, we need to find a new one
    if (tab.selected) {
        // If the list of tabs is empty, add a blank tab
        if (tabs.length === 0) {
            tabs.push({ name: "Blank", content: "" });
        }

        // Set the first tab to selectex
        tabs[0].selected = true;
    }

    return [...tabs];
}

/**
 * Renames the given tab.
 * @param {Tab[]} tabs List of tabs
 * @param {Tab} tab Tab to rename
 * @param {String} name New name
 * @returns Updated tab list
 */
function renameTab(tabs, tab, name) {
    // Find the tab by name and update it
    if (name.length > 0 && !tabs.find(tab => tab.name === name)) {
        tab.name = name;
    }

    return [...tabs];
}

/**
 * Sets a new selected tab.
 * @param {Tab[]} tabs List of tabs
 * @param {Tab} tab Selected tab
 * @returns Updated tab list
 */
function setSelected(tabs, tab) {
    // Set the previously selected tab to false
    const prev = getSelectedTab(tabs);
    if (prev) prev.selected = false;

    // Set the newly selected tab to true
    tab.selected = true;
    
    return [...tabs];
}

const TabInterface = {
    downloadTab,
    getSelectedTab,
    addTab,
    updateTab,
    deleteTab,
    renameTab,
    setSelected
};
export default TabInterface;