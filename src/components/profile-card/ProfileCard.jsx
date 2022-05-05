import React, { useState } from "react";
import ProfileInformation from "../profile-information/ProfileInformation";
import ProfileButtons from "../profile-buttons/ProfileButtons";
import { useAddParent, useAddPartner, useAddSibling } from "../../utils";
import "./ProfileCard.scss";

const ProfileCard = ({ data, id }) => {
  const [viewButtons, toggleButtons] = useState(false);
  const [viewAddMenu, toggleAddMenu] = useState(false);
  const [siblingsCount, setSiblingsCount] = useState(1);
  const [handles, setHandles] = useState(data);
  const setPartner = useAddPartner(id, handles.position, handles.female);
  const setParents = useAddParent(id, handles.position);
  const setSiblings = useAddSibling(id, siblingsCount, handles.position);
  const addSibling = () => {
    if (!handles.parents) {
      addParent();
    }
    setSiblings();
    setSiblingsCount(siblingsCount + 1);
  };
  const deleteNode = () => {};
  const addParent = () => {
    setHandles({ ...handles, parents: true });
    setParents();
  };
  const addPartner = () => {
    setHandles({ ...handles, partner: true });
    console.log("User is:", handles.female ? "female" : "male");
    setPartner();
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
      <ProfileInformation closeMenu={menuClose} handles={handles} />
      <ProfileButtons
        addParent={addParent}
        hasParents={handles.parents}
        addSibling={addSibling}
        isSibling={handles.isSibling}
        deleteNode={deleteNode}
        addPartner={addPartner}
        hasPartner={handles.partner}
        viewButtons={viewButtons}
        viewAddMenu={viewAddMenu}
        toggleAddMenu={toggleAddMenu}
      />
    </div>
  );
};

export default ProfileCard;
