import Cytoscape from 'globals/Cytoscape';
import { useAtom } from "jotai";
import { graphAtom, userChangeManagerAtom } from 'states/_atoms/atoms';
import GraphInterface from "interfaces/GraphInterface/GraphInterface.js";
import { Popover } from '@headlessui/react'
import PreferenceButton from 'components/Buttons/PreferenceButton';
import SecondaryButton from 'components/Buttons/SecondaryButton';
import { useRef } from 'react'

/**
 * Popover for control settings.
 */
export default function ControlSettingsPopover() {
    // Ref for popover button
    const button = useRef(null);

    const [graph, setGraph] = useAtom(graphAtom);
    const [userChangeManager, setUserChangeManager] = useAtom(userChangeManagerAtom);

    // Function to handle auto camera action
    function autoCamera() {
        Cytoscape.fit(Cytoscape.elements(), 100);
    }

    // Function to handle auto layout action
    function autoLayout() {
        // Disable for Layered Graphs
        if (graph.type == "layered")
            return;

        const graphScalar = graph.scalar;
        const idealEdgeLength = Math.min(window.innerWidth / graphScalar.x, window.innerHeight / graphScalar.y);
        var layout = Cytoscape.layout({ name: 'cose-bilkent', fit: false, animate: false, idealEdgeLength: idealEdgeLength,
            stop: function () {
                let newGraph = graph;
                let newChangeManager = userChangeManager;

                Cytoscape.nodes().forEach(node => {
                    const nodePosition = node.position();

                    // Compute the logical coordinate (nearest integer) after scaling down the physical coordinate
                    let logicalX = Math.floor(nodePosition.x / graphScalar.x + 0.5);
                    let logicalY = Math.floor(nodePosition.y / graphScalar.y + 0.5);
                  
                    // Update the node's position in the graph (logical)
                    [newGraph, newChangeManager] = GraphInterface.setNodePosition(newGraph, newChangeManager, node.id(), logicalX, logicalY);

                    // Update the node's position in Cytoscape (physical)
                    node.position({
                      x: logicalX * graphScalar.x,
                      y: logicalY * graphScalar.y,
                    });
                });

                setGraph(newGraph);
                setUserChangeManager(newChangeManager);
            }
        });

        layout.run();
    }

    // Function to toggle the popover menu
    function toggle() {
        button.current && button.current.click();
    }
   
    return (
        <Popover className="relative">
            <PreferenceButton shortcut="v" callback={toggle} buttonRef={button}>
                Layout (v)
            </PreferenceButton>

            <Popover.Panel className="absolute right-0 z-10 w-64 p-4 pt-2 rounded-xl bg-white shadow-lg pointer-events-auto">
                <p className='text-lg font-semibold text-center'>Controls</p>
                <SecondaryButton onClick={(e) => autoCamera()} className="my-2">Auto Camera</SecondaryButton>
                <SecondaryButton onClick={(e) => autoLayout()}>Auto Layout</SecondaryButton>
            </Popover.Panel>
        </Popover>
    );
}
