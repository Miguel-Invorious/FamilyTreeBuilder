import React, { useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
} from "react-flow-renderer";
import {
  nodeTypes,
  edgeTypes,
} from "../../utils.tsx";
import { useGetNodesAndEdges } from "../../use-get-nodes-and-edges.ts";

const FlowContainer = () => {
  const [nodes, edges] = useGetNodesAndEdges();
  const reactFlowInstance = useReactFlow();
  const fitView = () => reactFlowInstance.fitView();
  useEffect(() => {
fitView();
  }, [nodes]);
  console.log("Nodes: ", nodes);
  //console.log("edges: ", edges);

  return (
    <div className="App">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={fitView}
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
