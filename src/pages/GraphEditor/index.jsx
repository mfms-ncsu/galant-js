/**
 * This code exports a component named GraphEditorView, 
 * which renders a header section (Header component) and an EditorGroup component. 
 * The Header component consists of a logo and a link to keyboard shortcuts documentation. 
 * The GraphEditorView component wraps these elements together to form the view for editing graphs.
 * @author Christina Albores
 */
import EditorGroup from "./EditorGroup"
// import openHelpPage from "./GraphView/HeaderComponent.jsx"

// Define a functional component called Header
function Header() {
    // Return JSX representing the header section of the GraphEditorView
    return (
        <div className="flex items-center justify-between px-2 pt-1 w-auto h-12">
            <img src="img/galant_full_logo_without_words.svg" alt="logo" className="h-full w-auto"/>
            <a class="editor-buttons" href="/documentation.pdf"><label>User Manual</label></a>
        </div>
    )
}

// Define the GraphEditorView component as a functional component
export default function GraphEditorView() {
     // Return JSX representing the GraphEditorView component
    return (
        <>
            <Header />
            <EditorGroup />
        </>
    )
}