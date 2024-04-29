/**
 * AlgorithmEditorView Component
 * 
 * This component represents the view for editing algorithm-related content.
 * It consists of a header section and an EditorGroup component for managing algorithm editors.
 */

// Import EditorGroup component from the specified path
import EditorGroup from "../AlgorithmEditor/EditorGroup"

// Header component responsible for displaying the header section
function Header() {
    return (
        // Header section containing logo and documentation link
        <div className="flex items-center justify-between px-2 pt-1 w-auto h-12">
            <img src="img/galant_full_logo_without_words.svg" alt="logo" className="h-full w-auto"/>
            <a class="editor-buttons" href="/documentation.pdf"><label>User Manual</label></a>
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