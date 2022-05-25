import React from "react";
import { getSmoothStepPath } from "react-flow-renderer";
import { Gender } from "../types/gender.ts";
import { widthGap } from "../utils.tsx";
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data }) => {
  const offset = 2;
  let centerX = 0;
  if (data.gender === Gender.Male) {
    centerX = sourceX + widthGap / 2 - offset;
    if (data.center) {
      centerX = data.center;
    }
  } else {
    centerX = sourceX - widthGap / 2 + offset;
    if (data.center) {
      centerX = data.center;
    }
  }
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
