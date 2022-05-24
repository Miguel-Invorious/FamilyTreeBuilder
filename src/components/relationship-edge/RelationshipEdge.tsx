import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getEdgeCenter, getSmoothStepPath } from "react-flow-renderer";
import {
  buttonDimension,
  widthOffset,
  relationFormHeight,
  widthGap,
  relationFormOffset,
} from "../../utils.tsx";
import { useFamilyMember } from "../../use-family-member.ts";
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
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { addChild, addExChild, changeRelationType, isFemale } =
    useFamilyMember();
  const splittedId = id.split("-");
  const relationFormX = isFemale(data)
    ? targetX + relationFormOffset / 2
    : sourceX + relationFormOffset / 2;
  const from = splittedId[splittedId.length - 1];
  const handleClick = () => {
    if (from === Relations.Partner) {
      addChild(data);
    }
    if (from === Relations.ExPartner) {
      addExChild(data);
    }
  };
  const handleRelationChange = (relation: Relations) => {
    changeRelationType(data, from, relation);
    setMenuOpen(false);
  };
  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        onClick={() => setMenuOpen(true)}
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
      <foreignObject
        width={widthGap - relationFormOffset}
        height={relationFormHeight}
        x={relationFormX}
        y={sourceY - relationFormHeight * 2}
      >
        {isMenuOpen && (
          <div className="relation-menu">
            <p>Current partner</p>{" "}
            <span onClick={() => handleRelationChange(Relations.Partner)}>
              ______
            </span>
            <p>Ex partner</p>{" "}
            <span onClick={() => handleRelationChange(Relations.ExPartner)}>
              --------
            </span>
          </div>
        )}
      </foreignObject>
    </>
  );
};
export default RelationshipEdge;
