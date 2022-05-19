import React from "react";
import { getSmoothStepPath } from "react-flow-renderer";
import { Gender } from "../types/gender.ts";
import { widthGap } from "../utils.tsx";
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data }) => {
  const offset = 4;
  const centerX =
    data === Gender.Male
      ? sourceX + widthGap / 2 - offset*2.8
      : sourceX - widthGap / 2 + offset;

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
