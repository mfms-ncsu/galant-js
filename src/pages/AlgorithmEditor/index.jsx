/**
 * AlgorithmEditorView Component
 * 
 * This component represents the view for editing algorithm-related content.
 * It consists of a header section and an EditorGroup component for managing algorithm editors.
 */

// Import EditorGroup component from the specified path
import EditorGroup from "../AlgorithmEditor/EditorGroup"
import PrimaryButton from "components/Buttons/PrimaryButton"

// Header component responsible for displaying the header section
function Header() {
    return (
        // Header section containing logo and documentation link
        <div className="flex items-start justify-between px-2 pt-1 w-auto h-12 bg-neutral-300">
            <img src="img/galant_full_logo_without_words.svg" alt="logo" className="h-full w-auto"/>

            <PrimaryButton>
                <a target="_blank" href="/documentation.pdf">User Manual</a>
            </PrimaryButton>
        </div>
    )
}


// Main AlgorithmEditorView component
export default function AlgorithmEditorView() {
    
    return (
        // Fragment containing Header and EditorGroup components
        <>
            <Header />
            <EditorGroup editorType="Algorithm" />
        </>
    )
}