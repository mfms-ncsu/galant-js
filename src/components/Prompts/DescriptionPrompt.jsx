/**
 * Shows the graph introduction from an algorithm.
 * @author Henry Tavares
 */
import IntroductionDialog from "components/Accessibility/IntroductionDialog";

export default function DescriptionPrompt({ prompt, callback }) {
    return <IntroductionDialog title="About this graph" text={prompt.text} onClose={callback} />;
}
