import React from "react";
import ProfileInformation from "../profile-information/ProfileInformation.tsx";
import ProfileButtons from "../profile-buttons/ProfileButtons";
import { useFamilyMember } from "../../use-family-member.ts";
import { Gender } from "../../types/gender";
import "./ProfileCard.scss";

const ProfileCard = ({  data }) => {
  const { familyMember } = data;
  const { gender } = familyMember;
  const {
    familyMember: test,
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
    addParents(familyMember);;
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
  return (
    <div className="container">
      <ProfileInformation
        changeGender={handleChangeGender}
        initialGender={gender}
      />
      <ProfileButtons
        addParent={handleAddParent}
        addPartner={handleAddPartner}
        addExPartner={handleAddExPartner}
        addSibling={handleAddSibling}
        deleteNode={handleDeleteNode}
        hasParents={data.haveParents}
        hasPartner={data.havePartner}
        hasExPartner={data.haveExPartner}
      />
    </div>
  );
};

export default ProfileCard;
