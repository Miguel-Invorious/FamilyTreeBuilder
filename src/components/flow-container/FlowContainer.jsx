import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import { useSelector } from "react-redux";
import { nodeTypes, edgeTypes } from "../../utils";

const FlowContainer = () => {
  const nodes = useSelector((state) => state.flow.nodes);
  const edges = useSelector((state) => state.flow.edges);
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
