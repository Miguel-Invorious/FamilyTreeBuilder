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
  const relationFormX = isFemale(data)
    ? targetX + relationFormOffset / 2
    : sourceX + relationFormOffset / 2;
  const idClean = id.replace(/-*[0-9]-*/gm, " ").split(" ");
  var from = "";
  idClean.forEach((text) => {
    if (text !== "") {
      from = text;
    }
  });
  const handleClick = () => {
    if (from === Relations.Partner) {
      addChild(data);
    }
    if (from === Relations.ExPartner) {
      var edgeId = id.replace(/\D/gm, "-").split("-");
      var mother = 0;
      edgeId.forEach((id) => {
        if (id !== "") {
          mother = Number(id);
        }
      });
      addExChild(data, mother);
    }
  };
  const handleRelationChange = (relation: Relations) => {
    var edgeId = id.replace(/\D/gm, "-").split("-");
    var mother = 0;
    edgeId.forEach((id) => {
      if (id !== "") {
        mother = Number(id);
      }
    });
    changeRelationType(data, from, relation, mother);
    setMenuOpen(false);
  };
  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path relation-edge"
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
