import React, { useEffect } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import { useAtom } from "jotai";
import {
  nodeTypes,
  edgeTypes,
  nodesAtom,
  edgesAtom,
  parentAtom,
  reorder,
  nodeCountAtom,
} from "../../utils";

const FlowContainer = () => {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [nodeCount] = useAtom(nodeCountAtom);
  const [parent] = useAtom(parentAtom);
  // console.log("Nodes: ", nodes, " edges:", edges);
  // useEffect(() => {
  //   setNodes(reorder(parent, nodes));
  // },[edges]);
  return (
    <div className="App">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default FlowContainer;
