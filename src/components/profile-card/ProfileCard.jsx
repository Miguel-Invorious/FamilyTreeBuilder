import React, { useState } from "react";
import PropTypes from "prop-types";
import ProfileInformation from "../profile-information/ProfileInformation";
import ProfileButtons from "../profile-buttons/ProfileButtons";
import "./ProfileCard.scss";

const ProfileCard = ({ data, id }) => {
  const [viewButtons, toggleButtons] = useState(false);
  const [viewAddMenu, toggleAddMenu] = useState(false);
  const [handles, setHandles] = useState({
    parent: false,
    sibling: false,
    partner: false,
  });
  const handleAddSibling = () => {
    if (!handles.parent && !data.hasParents) {
      handleAddParent();
      data.hasParents = true;
    }
    setHandles({ ...handles, sibling: true });
    data.addSibling(id, data.position);
  };
  const handleDeleteNode = () => {
    data.deleteNode(id);
  };
  const handleAddParent = () => {
    setHandles({ ...handles, parent: true });
    data.addParents(id, data.position);
  };
  const handleAddPartner = () => {
    setHandles({ ...handles, partner: true });
    data.addCurrentPartner(id, data.position);
  };
  const handleMenuClose = () => {
    toggleButtons(false);
    toggleAddMenu(false);
  };
  return (
    <div
      className="container"
      onMouseEnter={() => toggleButtons(true)}
      onMouseLeave={handleMenuClose}
    >
      <ProfileInformation
        nodeData={data}
        closeMenu={handleMenuClose}
        handles={handles}
      />
      <ProfileButtons
        handleAddParent={handleAddParent}
        handleAddSibling={handleAddSibling}
        handleDeleteNode={handleDeleteNode}
        handleAddPartner={handleAddPartner}
        viewButtons={viewButtons}
        viewAddMenu={viewAddMenu}
        toggleAddMenu={toggleAddMenu}
      />
    </div>
  );
};
ProfileCard.propTypes = {
  firstname: PropTypes.string,
  dateOfBirth: PropTypes.string,
};
export default ProfileCard;
