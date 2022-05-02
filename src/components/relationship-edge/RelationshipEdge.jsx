import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getBezierPath, getEdgeCenter } from "react-flow-renderer";

import "./RelationshipEdge.scss";

const buttonDimension = 30;
const RelationshipEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}) => {
  const [children, setChildren] = useState(1);
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
  const handleClick = () => {
    setChildren(children + 1);
    data.addChild(id.replace(/\D/g, ""), { x: sourceX, y: sourceY }, children);
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
