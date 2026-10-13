import { useEffect, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
    graphAtom,
    gskModeAtom,
    gskCurrentNodeIdAtom,
    speechEnabledAtom
} from "states/_atoms/atoms";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";

export default function GskExplorer() {
    const graph = useAtomValue(graphAtom);
    const speechEnabled = useAtomValue(speechEnabledAtom);
    const gskMode = useAtomValue(gskModeAtom);
    const [currentNodeId, setCurrentNodeId] = useAtom(gskCurrentNodeIdAtom);
    const lastAnnouncement = useRef(null);

    useEffect(() => {
        if (!gskMode) {
            lastAnnouncement.current = null;
            return;
        }

        if (!speechEnabled) {
            lastAnnouncement.current = null;
        }

        const nodes = [...graph.nodes.values()]
            .filter(node =>
                !node.attributes.get("hidden") &&
                !node.attributes.get("dummy")
            )
            .sort((a, b) => a.sequenceNumber - b.sequenceNumber);

        const currentNode = nodes.find(node => node.id === currentNodeId);

        // Choose a fallback only when the shared cursor is unavailable.
        if (!currentNode && nodes.length > 0) {
            setCurrentNodeId(nodes[0].id);
            return;
        }

        let description = "No nodes available.";

        if (currentNode) {
            const label = currentNode.attributes.get("label");
            const hasLabel = label && !currentNode.attributes.get("labelHidden");

            description = hasLabel
                ? `Node ${currentNode.id}, label ${label}.`
                : `Node ${currentNode.id}.`;
        } else if (currentNodeId !== null) {
            setCurrentNodeId(null);
        }

        // Avoid repeating the same description on unrelated graph updates.
        if (speechEnabled && lastAnnouncement.current !== description) {
            lastAnnouncement.current = description;
            SpeechInterface.speakText(description);
        }
    }, [gskMode, graph, currentNodeId, setCurrentNodeId, speechEnabled]);

    return null;
}