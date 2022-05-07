import React from "react";
import { getSmoothStepPath } from "react-flow-renderer";
import { widthGap, widthOffset, buttonDimension } from "../utils";
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
}) => {
  const centerX =
    data === "female"
      ? sourceX - widthGap / 2 + widthOffset
      : sourceX + widthGap / 2 - widthOffset;

  const sourceToCenterX = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX: centerX,
    targetY: sourceY,
  });
  const centerXtoTarget = getSmoothStepPath({
    sourceX: centerX,
    sourceY: sourceY,
    targetX,
    targetY: targetY,
    borderRadius: 0,
  });
  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={sourceToCenterX + centerXtoTarget}
        markerEnd={markerEnd}
      />
    </>
  );
};
export default CustomEdge;
