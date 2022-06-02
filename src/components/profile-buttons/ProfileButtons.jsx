import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import DeleteDialog from "../delete-dialog/DeleteDialog";

const ProfileButtons = ({
  addParent,
  hasParents,
  addPartner,
  hasPartner,
  addSibling,
  addExPartner,
  deleteNode,
}) => {
  const [viewAddMenu, setViewAddMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setViewAddMenu(false);
  };
  return (
    <>
      <>
        {!hasParents && (
          <div className="button top" onClick={addParent}>
            <FontAwesomeIcon icon={faPlus} />
          </div>
        )}
        {viewAddMenu ? (
          <div
            className="add-menu rigth"
            onClick={() => setViewAddMenu(false)}
            onMouseLeave={() => setViewAddMenu(false)}
          >
            <button onClick={addSibling}>Add sibling</button>
            {!hasPartner && <button onClick={addPartner}>Add partner</button>}
            <button onClick={addExPartner}>Add ex partner</button>
          </div>
        ) : (
          <div className="button rigth" onClick={() => setViewAddMenu(true)}>
            <FontAwesomeIcon icon={faPlus} />
          </div>
        )}
        <div className="button bottom" onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faX} />
        </div>
      </>
      <DeleteDialog open={open} onClose={handleClose} deleteNode={deleteNode} />
    </>
  );
};
export default ProfileButtons;
