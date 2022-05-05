import React, { useState } from "react";
import { getBezierPath, getSmoothStepPath } from "react-flow-renderer";
import { heightGap, widthGap } from "../utils";
const CustomEdge = ({
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
  const centerX = sourceX - 0.5 * widthGap;
  const centerY = sourceY + 0.5 * heightGap;
  const sourceToCenter = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: centerX,
    targetY: centerY,
    borderRadius: 0,
  });
  const centerToTarget = getSmoothStepPath({
    sourceX: centerX,
    sourceY: centerY,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
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
        d={sourceToCenter + centerToTarget}
        markerEnd={markerEnd}
      />
    </>
  );
};
export default CustomEdge;
