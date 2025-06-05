import { useState, useRef } from "react";
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';

/**
 * Returns a tab component, which displays its name and allows you to change its name.
 * In edit mode, tab shows intermediateName, and allows user to focus on input box to change name.
 */
export default function Tab({tab, onClick, onRename, onRemove}) {
    console.log("in Tab, tab =", tab);
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
        <div tabIndex={0} className="flex bg-transparent" onClick={() => onClick(tab)} onKeyDown={onTabSelectByKey}>
            <div className={`flex items-center py-1 ps-2 pe-1 rounded-t-lg text-xl font-semibold ${tab.selected ? "bg-white" : "bg-neutral-300"}`}>
                <div className="relative overflow-hidden cursor-default whitespace-nowrap">
                    <span className="opacity-0 pr-1">{editMode ? intermediateName : tab.name}</span>
                    <input className={`absolute inset-x-0 bg-transparent outline-none caret-blue-500 ${!editMode && 'pointer-events-none' }`} ref={inputField} value={editMode ? intermediateName : tab.name} size={intermediateName.length} disabled={!editMode} onChange={(event) => setIntermediateName(event.target.value.trim())} onKeyUp={onEnter} onBlur={() => setEditMode(false)} ></input>
                </div>

                <button className="p-1 rounded-full hover:bg-black/10" onClick={onEdit}>
                    <PencilIcon className="h-4"/>
                </button>

                <button className="p-1 rounded-full hover:bg-black/10" onClick={onRemoveClick}>
                    <XMarkIcon className="h-4 stroke stroke-black"/>
                </button>
            </div>
        </div>
    );
}