import React, { useState } from "react";
import PhotoDialog from "./PhotoDialog";
import DefaultProfilePhoto from "../../assets/profile-image.jpg";
import "./PhotoSelector.scss";
const PhotoSelector = ({ closeMenu }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [open, setOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  const onChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setOpen(true);
    }
  };
  const handleCloseModal = () => setOpen(false);
  return (
    <>
      {imageSrc ? (
        <>
          <PhotoDialog
            open={open}
            onClose={handleCloseModal}
            imageSrc={imageSrc}
            setImageSrc={setImageSrc}
            setCroppedImage={setCroppedImage}
            closeMenu={closeMenu}
          />
          <img
            src={croppedImage}
            alt="profile"
            className="picture"
            onClick={() => setOpen(true)}
          />
        </>
      ) : (
        <label>
          <img className="picture" src={DefaultProfilePhoto} alt="profile" />
          <input type="file" onChange={onChange} accept="image/*" />
        </label>
      )}
    </>
  );
};
function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}
export default PhotoSelector;
