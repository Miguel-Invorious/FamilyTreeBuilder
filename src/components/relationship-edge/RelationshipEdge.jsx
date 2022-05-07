import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getBezierPath, getEdgeCenter } from "react-flow-renderer";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFlow,
  addChildrenById,
  addExChildrenById,
  addMainNode,
} from "../../redux/flowSlice";
import { addChild, buttonDimension } from "../../utils";
import "./RelationshipEdge.scss";

const RelationshipEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) => {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const parent = useSelector((state) =>
    state.flow.nodes.filter((node) => node.id === id.replace(/\D/g, ""))
  );
  const mainNodes = useSelector((state) => state.flow.mainNodesCount);
  const dispatch = useDispatch();
  const handleClick = () => {
    const { nodes, edges } = addChild(
      id,
      { x: sourceX, y: sourceY },
      parent[0],
      mainNodes
    );
    dispatch(updateFlow({ nodes, edges }));
    dispatch(addMainNode());
    id.replace(/^[a-z]-\d-/, "") === "partner"
      ? dispatch(
          addChildrenById({ parentId: id.replace(/\D/g, ""), childId: nodes })
        )
      : dispatch(addExChildrenById({ parentId: id.replace(/\D/g, ""), nodes }));
  };
  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={buttonDimension}
        height={buttonDimension}
        x={edgeCenterX - buttonDimension / 2}
        y={edgeCenterY - buttonDimension / 2}
        className="edge-button"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="button" onClick={handleClick}>
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </foreignObject>
    </>
  );
};
export default RelationshipEdge;
