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
const RelationCard = ({ data, id }) => {
  const [isVisible, setVisible] = useState(false);
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const toggleMenu = () => setVisible(!isVisible);
  const handleDelete = () => {
    const newNodes = deleteRelation(id, nodes);
    const newEdges = deleteEdge(id, edges, nodes);
    setNodes([...newNodes]);
    setEdges([...newEdges]);
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
