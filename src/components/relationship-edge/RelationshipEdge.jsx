import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getEdgeCenter, getSmoothStepPath } from "react-flow-renderer";
import {
  buttonDimension,
  nodesAtom,
  edgesAtom,
  parentAtom,
  nodeCountAtom,
  widthOffset,
  reorder,
} from "../../utils.tsx";
import { useFamilyMember } from "../../use-family-member.ts";
import { useAtom } from "jotai";
import { Relations } from "../../types/relations.enum.ts";
import "./RelationshipEdge.scss";

const RelationshipEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
}) => {
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX: targetX + widthOffset,
    targetY,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const { addChild, addExChild } = useFamilyMember();
  const [papuest] = useAtom(parentAtom);
  const handleClick = () => {
    const splittedId = id.split("-");
    const from = splittedId[splittedId.length - 1];
    if (from === Relations.Partner) {
      addChild(data);
    }
    if (from === Relations.ExPartner) {
      addExChild(data);
    }
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
