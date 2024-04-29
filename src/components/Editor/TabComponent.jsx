
import { useState, useRef } from "react";
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';


/**
 * @fileoverview Contains and returns {@link TabComponent}
 * @author Julian Madrigal
 */


/**
 * @typedef {Object} Tab
 * @property {string} name the name of the tab
 * @property {String} content the content of the tab
 * @property {boolean} selected true if the tab is selected, false otherwise
 */


/**
 * Returns a tab component, which displays its name and allows you to change its name.
 * In edit mode, tab shows intermediateName, and allows user to focus on input box to change name.
 * @param {Object} props props
 * @param {Tab} props.tab The tab data related to the tab
 * @param {function} props.onClick The callback function for when a user clicks a tab
 * @param {function} props.onRename The callback function for when a user renames a tab
 * @param {function} props.onRemove The callback function for when a user removes a tab
 * @returns {React.ReactElement}
 */
export default function TabComponent({tab, onClick, onRename, onRemove}) {
    const [editMode, setEditMode] = useState(false);
    const [intermediateName, setIntermediateName] = useState(tab.name);
    const inputField = useRef(null);

    function onEdit(event) {
        setIntermediateName(tab.name);
        setEditMode(true);
        event.stopPropagation();
    }

    function onRemoveClick(event) {
        onRemove(tab);
        event.stopPropagation();
    }

    function onEnter(event) {
        if (event.key !== 'Enter') return;
        onRename(tab, intermediateName.trim());
        setEditMode(false);
    }

    if (editMode && inputField) {
        inputField.current.disabled = false;
        inputField.current.focus();
    }

    // Too long to be inline of HTML, so placed here.
    function onTabSelectByKey(event) {
        if (event.keyCode !== 13 && event.keyCode !== 32) return;
        onClick(tab);
    }


    return(
        <div tabIndex={0} className={`tab group flex space-x-1 px-2 py-1 rounded-t-md font-semibold outline-2 outline-blue-300 focus-within:outline ${tab.selected ? "bg-white" : "bg-gray-100"}`} onClick={() => onClick(tab)} onKeyDown={onTabSelectByKey}>
            <div className="relative overflow-hidden cursor-default whitespace-nowrap">
                <span className="opacity-0 pr-1">{editMode ? intermediateName : tab.name}</span>
                <input className={`absolute inset-x-0 bg-transparent outline-none caret-blue-500 ${!editMode && 'pointer-events-none' }`} ref={inputField} value={editMode ? intermediateName : tab.name} size={intermediateName.length} disabled={!editMode} onChange={(event) => setIntermediateName(event.target.value.trim())} onKeyUp={onEnter} onBlur={() => setEditMode(false)} ></input>
            </div>

            <button className="p-1 rounded bg-transparent hover:bg-black/10" onClick={onEdit}>
                <PencilIcon className="w-4 h-4"/>
            </button>

            <button className="p-1 rounded bg-transparent hover:bg-black/10" onClick={onRemoveClick}>
                <XMarkIcon className="w-4 h-4"/>
            </button>
        </div>
    )
}