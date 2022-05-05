import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
const ProfileButtons = ({
  addParent,
  hasParents,
  addPartner,
  hasPartner,
  addSibling,
  isSibling,
  deleteNode,
  viewButtons,
  viewAddMenu,
  toggleAddMenu,
}) => {
  return (
    <>
      {viewButtons && (
        <>
          {!hasParents && (
            <div className="button top" onClick={addParent}>
              <FontAwesomeIcon icon={faPlus} />
            </div>
          )}
          {viewAddMenu ? (
            <div className="add-menu rigth">
              {!isSibling && <button onClick={addSibling}>Add sibling</button>}
              {!hasPartner && <button onClick={addPartner}>Add partner</button>}
              <button>Add ex partner</button>
            </div>
          ) : (
            <div className="button rigth" onClick={() => toggleAddMenu(true)}>
              <FontAwesomeIcon icon={faPlus} />
            </div>
          )}

          <div className="button bottom" onClick={deleteNode}>
            <FontAwesomeIcon icon={faX} />
          </div>
        </>
      )}
    </>
  );
};
export default ProfileButtons;
