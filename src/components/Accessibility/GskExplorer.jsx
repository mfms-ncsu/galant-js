import { useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
    graphAtom,
    gskModeAtom,
    gskCurrentNodeIdAtom,
    speechEnabledAtom
} from "states/_atoms/atoms";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";
import shortcuts, { matchesShortcut } from "config/keyboardShortcuts";

export default function GskExplorer() {
    const graph = useAtomValue(graphAtom);
    const speechEnabled = useAtomValue(speechEnabledAtom);
    const gskMode = useAtomValue(gskModeAtom);
    const [currentNodeId, setCurrentNodeId] = useAtom(gskCurrentNodeIdAtom);
    const lastAnnouncement = useRef(null);
    const [connectionIndex, setConnectionIndex] = useState(-1);

    // Reset connection selection when the node, graph, or mode changes.
    useEffect(() => {
        setConnectionIndex(-1);
    }, [currentNodeId, graph, gskMode]);

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


    useEffect(() => {
    function onKeyDown(event) {
        if (!gskMode) return;

        const next = matchesShortcut(event, shortcuts.gskNextConnection);
        const previous = matchesShortcut(event, shortcuts.gskPreviousConnection);
        const move = matchesShortcut(event, shortcuts.gskMoveToNeighbor);
        const describe = matchesShortcut(event, shortcuts.gskDescribeNode);

        if (!next && !previous && !move && !describe) return;
        event.preventDefault();

        const node = graph.nodes.get(currentNodeId);

        if (!node) {
            SpeechInterface.cancelSpeech();
            SpeechInterface.speakText("No current node available.");
            return;
        }

        const connections = [...new Set(node.edges.values())]
            .filter(edge => {
                const neighborId = edge.source === currentNodeId
                    ? edge.target
                    : edge.source;
                const neighbor = graph.nodes.get(neighborId);

                return neighbor &&
                    !edge.attributes.get("hidden") &&
                    !neighbor.attributes.get("hidden") &&
                    !neighbor.attributes.get("dummy");
            });

        
            if (describe) {
                const parts = [`Node ${node.id}`];

                for (const attribute of ["label", "weight"]) {
                    const value = node.attributes.get(attribute);

                    if (
                        value !== undefined &&
                        value !== null &&
                        value !== "" &&
                        !node.attributes.get(`${attribute}Hidden`)
                    ) {
                        parts.push(`${attribute} ${value}`);
                    }
                }

                parts.push(node.attributes.get("marked") ? "marked" : "not marked");
                parts.push(
                    node.attributes.get("highlighted")
                    ? "highlighted"
                    : "not highlighted"
                );
                parts.push(
                    `${connections.length} connection${connections.length === 1 ? "" : "s"}`
                );

                SpeechInterface.cancelSpeech();
                SpeechInterface.speakText(`${parts.join(", ")}.`);
                return;
            }
            
        if (!connections.length) {
            SpeechInterface.cancelSpeech();
            SpeechInterface.speakText("No connections.");
            return;
        }

        if (move) {
        const selectedEdge = connections[connectionIndex];

        if (!selectedEdge) {
            SpeechInterface.cancelSpeech();
            SpeechInterface.speakText(
                "Choose a connection with Up or Down before moving."
                );
            return;
        }

    const neighborId = selectedEdge.source === currentNodeId
        ? selectedEdge.target
        : selectedEdge.source;

    SpeechInterface.cancelSpeech();
    setConnectionIndex(-1);
    setCurrentNodeId(neighborId);
    return;
}

        const index = connectionIndex < 0
            ? (next ? 0 : connections.length - 1)
            : (connectionIndex + (next ? 1 : -1) + connections.length)
                % connections.length;

        setConnectionIndex(index);

        const edge = connections[index];
        const neighborId = edge.source === currentNodeId
            ? edge.target
            : edge.source;

        let direction = "Edge to";

        if (edge.source === edge.target) {
            direction = "Self-loop at";
        } else if (graph.isDirected) {
            direction = edge.source === currentNodeId
                ? "Outgoing edge to"
                : "Incoming edge from";
        }

        let description =
            `Connection ${index + 1} of ${connections.length}. ` +
            `${direction} node ${neighborId}`;

        for (const attribute of ["label", "weight"]) {
            const value = edge.attributes.get(attribute);

            if (
                value !== undefined &&
                value !== null &&
                value !== "" &&
                !edge.attributes.get(`${attribute}Hidden`)
            ) {
                description += `, ${attribute} ${value}`;
            }
        }

        SpeechInterface.cancelSpeech();
        SpeechInterface.speakText(`${description}.`);
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
        document.removeEventListener("keydown", onKeyDown);
    };
}, [gskMode, graph, currentNodeId, connectionIndex, setCurrentNodeId]);

return null;
}