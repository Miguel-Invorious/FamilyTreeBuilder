import React, { useState, useEffect } from "react";
import ProfileInformation from "../profile-information/ProfileInformation.tsx";
import ProfileButtons from "../profile-buttons/ProfileButtons";
import {
  nodesAtom,
  edgesAtom,
  nodeCountAtom,
  parentAtom,
  addFamily,
  addSibling,
  addParents,
  addPartner,
  addEx,
  deleteNode,
  deleteEdge,
} from "../../utils.tsx";
import "./ProfileCard.scss";

import { useAtom } from "jotai";
import { useFamilyMember } from "../../use-family-member.ts";
import { Gender } from "../../types/gender";

const ProfileCard = ({ id, data }) => {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [papuest, setParent] = useAtom(parentAtom);
  const [nodeCount, setNodeCount] = useAtom(nodeCountAtom);
  const [viewButtons, toggleButtons] = useState(false);
  const [viewAddMenu, toggleAddMenu] = useState(false);
  const { familyMember } = data;
  const { gender } = familyMember;
  const {
    addParents,
    addSibling,
    addPartner,
    addExPartner,
    changeGender,
    deleteMember,
  } = useFamilyMember();
  const handleAddSibling = () => {
    addSibling(familyMember);
  };

  const handleAddParent = () => {
    addParents(familyMember);
  };

  const handleAddPartner = () => {
    addPartner(familyMember);
  };
  const handleChangeGender = (gender: Gender) => {
    changeGender(familyMember, gender);
  };
  const handleAddExPartner = () => {
    addExPartner(familyMember);
  };
  const handleDeleteNode = () => {
    deleteMember(familyMember);
  };
  const menuClose = () => {
    toggleButtons(false);
    toggleAddMenu(false);
  };

  return (
    <div
      className="container"
      onMouseEnter={() => toggleButtons(true)}
      onMouseLeave={menuClose}
    >
      <ProfileInformation
        closeMenu={menuClose}
        changeGender={handleChangeGender}
        initialGender={gender}
      />
      <ProfileButtons
        addParent={handleAddParent}
        addPartner={handleAddPartner}
        addExPartner={handleAddExPartner}
        addSibling={handleAddSibling}
        deleteNode={handleDeleteNode}
        toggleAddMenu={toggleAddMenu}
        hasParents={data.haveParents}
        hasPartner={data.havePartner}
        hasExPartner={data.haveExPartner}
        viewButtons={viewButtons}
        viewAddMenu={viewAddMenu}
      />
    </div>
  );
};

export default ProfileCard;
