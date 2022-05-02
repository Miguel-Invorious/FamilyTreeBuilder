import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import ProfileCard from "../profile-card/ProfileCard";

import RelationshipEdge from "../relationship-edge/RelationshipEdge";
import { useFamilyTree } from "../../utils";
const nodeTypes = {
  profileNode: ProfileCard,
};
const edgeTypes = {
  relationEdge: RelationshipEdge,
};
const FlowContainer = () => {
  const [nodes, edges] = useFamilyTree();

  return (
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
  );
};

export default FlowContainer;
