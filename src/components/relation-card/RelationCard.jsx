import React, { useState } from "react";
import ProfileInformation from "../profile-information/ProfileInformation.tsx";
import {
  deleteRelation,
  deleteEdge,
  edgesAtom,
  nodesAtom,
} from "../../utils.tsx";
import { useAtom } from "jotai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useFamilyMember } from "../../use-family-member.ts";
import { Relations } from "../../types/relations.enum.ts";
const RelationCard = ({ data, id }) => {
  const [isVisible, setVisible] = useState(false);
  const { deleteRelation } = useFamilyMember();
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const toggleMenu = () => setVisible(!isVisible);
  const { familyMember } = data;
  const handleDelete = () => {
    console.log(data);
    const splitId = id.split("-");
    const from = splitId[splitId.length - 1];
    deleteRelation(familyMember, from);
    if (from === Relations.Partner) {
      data.hasPartner = false;
    }
    if (from === Relations.ExPartner) {
      data.hasExPartner = false;
    }
  };
  return (
    <div
      className="container"
      onMouseEnter={toggleMenu}
      onMouseLeave={toggleMenu}
    >
      <ProfileInformation profileData={data} />
      {isVisible && (
        <div className="button bottom" onClick={handleDelete}>
          <FontAwesomeIcon icon={faX} />
        </div>
      )}
    </div>
  );
};

export default RelationCard;
