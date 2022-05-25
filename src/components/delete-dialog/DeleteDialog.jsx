import React from "react";
import Dialog from "@mui/material/Dialog";
import "./DeleteDialog.scss";
const DeleteDialog = ({ open, onClose, deleteNode }) => {
  const handleOnDelete = () => {
    onClose();
    deleteNode();
  };
  return (
    <Dialog open={open} className="delete-modal">
      <div className="container">
        <p>Are you sure you want to delete this individual?</p>
        <span>this will also delete his/her partners and children</span>
        <div className="buttons">
          <button onClick={handleOnDelete}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </Dialog>
  );
};
export default DeleteDialog;
