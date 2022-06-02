import React, { useState } from "react";
import ProfileInformation from "../profile-information/ProfileInformation.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useFamilyMember } from "../../use-family-member.ts";
import { Relations } from "../../types/relations.enum.ts";
import DeleteDialog from "../delete-dialog/DeleteDialog";
import "./RelationCard.scss";
const RelationCard = ({ data, id }) => {
  const { deleteRelation } = useFamilyMember();
  const { familyMember } = data;
  const handleDelete = () => {
    const from = id.replace(/-*[0-9]-*/gm, "");
    deleteRelation(familyMember, from, id);
    if (from === Relations.Partner) {
      data.hasPartner = false;
    }
  };
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <div className="container">
      <ProfileInformation
        profileData={data}
      />
      <div className="button bottom" onClick={() => setOpen(true)}>
        <FontAwesomeIcon icon={faX} />
      </div>
      <DeleteDialog
        open={open}
        onClose={handleClose}
        deleteNode={handleDelete}
      />
    </div>
  );
};

export default RelationCard;
