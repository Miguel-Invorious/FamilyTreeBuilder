import React from "react";
import { getSmoothStepPath } from "react-flow-renderer";
import { widthGap } from "../utils";
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}) => {
  const centerX =
    data === "male" ? sourceX + widthGap / 2 : sourceX - widthGap / 2;

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
      />
    </>
  );
};
export default CustomEdge;
