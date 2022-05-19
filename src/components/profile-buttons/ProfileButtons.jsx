import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
const ProfileButtons = ({
  addParent,
  hasParents,
  addPartner,
  hasPartner,
  hasExPartner,
  addSibling,
  addExPartner,
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
              <button onClick={addSibling}>Add sibling</button>
              {!hasPartner && <button onClick={addPartner}>Add partner</button>}
              {!hasExPartner && (
                <button onClick={addExPartner}>Add ex partner</button>
              )}
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
