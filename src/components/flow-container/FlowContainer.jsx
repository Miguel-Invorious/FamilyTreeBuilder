import React, { useEffect, useState } from "react";
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
} from "../../utils.tsx";
import { useFamilyMember } from "../../utils2.ts";
import { useGetNodesAndEdges } from "../../use-get-nodes-and-edges.ts";

const FlowContainer = () => {
  const [nodes, edges] = useGetNodesAndEdges();

  const [nodeCount] = useAtom(nodeCountAtom);
  const [parent] = useAtom(parentAtom);


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
