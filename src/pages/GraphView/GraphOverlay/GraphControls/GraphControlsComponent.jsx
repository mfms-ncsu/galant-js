import ControlSettingsPopover from "./Components/ControlSettingsPopover"
import NodeSettingsPopover from "./Components/NodeSettingsPopover"
import EdgeSettingsPopover from "./Components/EdgeSettingsPopover"
import PreferencesPopover from "./Components/PreferencesPopover"


export default function GraphControlsComponent() {
    return (
        <div className="flex justify-end space-x-4 m-2 mb-0">
            <ControlSettingsPopover />
            <NodeSettingsPopover />
            <EdgeSettingsPopover />
            <PreferencesPopover />
        </div>
    )
}