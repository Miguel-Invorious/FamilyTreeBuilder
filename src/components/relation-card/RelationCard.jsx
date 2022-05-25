import React, { useState } from "react";
import ProfileInformation from "../profile-information/ProfileInformation.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useFamilyMember } from "../../use-family-member.ts";
import { Relations } from "../../types/relations.enum.ts";
import DeleteDialog from "../delete-dialog/DeleteDialog";
const RelationCard = ({ data, id }) => {
  const [isVisible, setVisible] = useState(false);
  const { deleteRelation } = useFamilyMember();
  const toggleMenu = () => setVisible(!isVisible);
  const { familyMember } = data;
  const handleDelete = () => {
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
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div
      className="container"
      onMouseEnter={toggleMenu}
      onMouseLeave={toggleMenu}
    >
      <ProfileInformation profileData={data} />
      {isVisible && (
        <div className="button bottom" onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faX} />
        </div>
      )}
      <DeleteDialog
        open={open}
        onClose={handleClose}
        deleteNode={handleDelete}
      />
    </div>
  );
};

export default RelationCard;
