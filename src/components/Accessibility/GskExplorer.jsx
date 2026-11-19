import { useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
    graphAtom,
    gskModeAtom,
    gskCurrentNodeIdAtom,
    gskNavigationResetAtom,
    speechEnabledAtom
} from "states/_atoms/atoms";
import SpeechInterface from "interfaces/SpeechInterface/SpeechInterface";
import shortcuts, { matchesShortcut } from "config/keyboardShortcuts";

function getConnections(graph, nodeId) {
    const node = graph.nodes.get(nodeId);
    if (!node) return [];

    return [...new Set(node.edges.values())].filter(edge => {
        const neighborId = edge.source === nodeId
            ? edge.target
            : edge.source;
        const neighbor = graph.nodes.get(neighborId);

        return neighbor &&
            !edge.attributes.get("hidden") &&
            !neighbor.attributes.get("hidden") &&
            !neighbor.attributes.get("dummy");
    });
}
export default function GskExplorer() {
    const graph = useAtomValue(graphAtom);
    const speechEnabled = useAtomValue(speechEnabledAtom);
    const gskMode = useAtomValue(gskModeAtom);
    const navigationReset = useAtomValue(gskNavigationResetAtom);
    const [currentNodeId, setCurrentNodeId] = useAtom(gskCurrentNodeIdAtom);
    const lastAnnouncement = useRef(null);
    const navigationHistory = useRef([]);
    const pendingReturn = useRef(null);
    const [connectionIndex, setConnectionIndex] = useState(-1);

    useEffect(() => {
        navigationHistory.current = [];
        pendingReturn.current = null;
        lastAnnouncement.current = null;
        setConnectionIndex(-1);
    }, [navigationReset]);

    // Restore the crossed edge after returning to a previous node.
    useEffect(() => {
        const entry = pendingReturn.current;
        pendingReturn.current = null;

        if (gskMode && entry && entry.nodeId === currentNodeId) {
            const connections = getConnections(graph, currentNodeId);

            const index = connections.findIndex(edge =>
                edge.source === entry.edgeSource &&
                edge.target === entry.edgeTarget
            );

            setConnectionIndex(index);

            if (index === -1) {
                SpeechInterface.speakText(
                    "The previously crossed edge is no longer available."
                );
            }
            } else {
                setConnectionIndex(-1);
            }
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
            const parts = [`Node ${currentNode.id}`];

            for (const attribute of ["label", "weight", "color", "shape"]) {
                const value = currentNode.attributes.get(attribute);

                if (
                    value !== undefined &&
                    value !== null &&
                    value !== "" &&
                    !currentNode.attributes.get(`${attribute}Hidden`)
                ) {
                    parts.push(`${attribute} ${value}`);
                }
            }

            parts.push(
                currentNode.attributes.get("marked") ? "marked" : "not marked"
            );
            parts.push(
            currentNode.attributes.get("highlighted")
                ? "highlighted"
                : "not highlighted"
            );

            description = `${parts.join(", ")}.`;

        } else if (currentNodeId !== null) {
            setCurrentNodeId(null);
        }

        // Avoid repeating the same description on unrelated graph updates.
        if (speechEnabled && lastAnnouncement.current !== description) {
            lastAnnouncement.current = description;
            SpeechInterface.speakText(description);
        }
    }, [gskMode, graph, currentNodeId, setCurrentNodeId, speechEnabled, navigationReset]);


    useEffect(() => {
    function onKeyDown(event) {
        if (!gskMode) return;
        SpeechInterface.cancelSpeech()
        if (matchesShortcut(event, shortcuts.gskStopSpeech)) {
            event.preventDefault();
            SpeechInterface.cancelSpeech();
            return;
        }

        if (matchesShortcut(event, shortcuts.gskGoBack)) {
            event.preventDefault();
            SpeechInterface.cancelSpeech();

            let skipped = false;

            while (navigationHistory.current.length > 0) {
                const entry = navigationHistory.current.pop();
                const previousNode = graph.nodes.get(entry.nodeId);

            if (
                !previousNode ||
                previousNode.attributes.get("hidden") ||
                previousNode.attributes.get("dummy")
            ) {
                skipped = true;
                continue;
            }

            if (skipped) {
                SpeechInterface.speakText(
                "Unavailable nodes were skipped."
                );
            }

            pendingReturn.current = entry;
            lastAnnouncement.current = null;
            setConnectionIndex(-1);
            setCurrentNodeId(entry.nodeId);
            return;
        }

        SpeechInterface.speakText(
            skipped
                ? "Previous nodes are no longer available."
                : "No previous node."
            );
            return;
        }

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

        const connections = getConnections(graph, currentNodeId);

        
            if (describe && !connections[connectionIndex]) {
                const parts = [`Node ${node.id}`];

                for (const attribute of ["label", "weight", "color", "shape"]) {
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

    navigationHistory.current.push({
        nodeId: currentNodeId,
        edgeSource: selectedEdge.source,
        edgeTarget: selectedEdge.target
    });
    SpeechInterface.cancelSpeech();
    setConnectionIndex(-1);
    setCurrentNodeId(neighborId);
    return;
}

        const index = describe
            ? connectionIndex
            : connectionIndex < 0
                ? (next ? 0 : connections.length - 1)
                : (connectionIndex + (next ? 1 : -1) + connections.length)
                    % connections.length;

        if (!describe) {
            setConnectionIndex(index);
        }

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
            `${direction} node ${neighborId}. ` +
            `Connection ${index + 1} of ${connections.length}. ` +
            `Endpoints ${edge.source} and ${edge.target}`;

        for (const attribute of ["label", "weight", "color"]) {
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

        description += edge.attributes.get("highlighted")
            ? ", highlighted"
            : ", not highlighted";

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