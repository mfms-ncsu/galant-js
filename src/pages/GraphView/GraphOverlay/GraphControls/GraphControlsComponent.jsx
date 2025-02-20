import ControlSettingsPopover from "./Components/ControlSettingsPopover"
import NodeSettingsPopover from "./Components/NodeSettingsPopover"
import EdgeSettingsPopover from "./Components/EdgeSettingsPopover"


export default function GraphControlsComponent() {
    return (
        <div className="absolute right-1 top-1">
            <div className="flex-col space-y-1">
                <p>Preferences</p>
                <div><ControlSettingsPopover /></div>
                <div><NodeSettingsPopover /></div>
                <div><EdgeSettingsPopover /></div>
            </div>
        </div>
    )
}