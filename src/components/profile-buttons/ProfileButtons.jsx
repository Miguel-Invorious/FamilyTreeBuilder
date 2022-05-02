import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
const ProfileButtons = ({
  handleAddParent,
  handleAddPartner,
  handleAddSibling,
  handleDeleteNode,
  viewButtons,
  viewAddMenu,
  toggleAddMenu,
}) => {
  return (
    <>
      {viewButtons && (
        <>
          <div className="button top" onClick={handleAddParent}>
            <FontAwesomeIcon icon={faPlus} />
          </div>
          {viewAddMenu ? (
            <div className="add-menu rigth">
              <button onClick={handleAddSibling}>Add sibling</button>
              <button onClick={handleAddPartner}>Add current Partner</button>
              <button>Add ex partner</button>
            </div>
          ) : (
            <div className="button rigth" onClick={() => toggleAddMenu(true)}>
              <FontAwesomeIcon icon={faPlus} />
            </div>
          )}

          <div className="button bottom" onClick={handleDeleteNode}>
            <FontAwesomeIcon icon={faX} />
          </div>
        </>
      )}
    </>
  );
};
export default ProfileButtons;
