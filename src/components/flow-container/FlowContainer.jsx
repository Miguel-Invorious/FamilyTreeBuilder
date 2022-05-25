import React from "react";
import ReactFlow, {
  Controls,
  Background,
  useReactFlow,
} from "react-flow-renderer";
import { nodeTypes, edgeTypes } from "../../utils.tsx";
import { useGetNodesAndEdges } from "../../use-get-nodes-and-edges.ts";

const FlowContainer = () => {
  const [nodes, edges] = useGetNodesAndEdges();
  const reactFlowInstance = useReactFlow();
  return (
    <div className="App">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={() => reactFlowInstance.fitView()}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default FlowContainer;
