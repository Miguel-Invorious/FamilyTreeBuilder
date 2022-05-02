import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import Dialog from "@mui/material/Dialog";
import getCroppedImg from "./cropImage";

const PhotoDialog = ({ open, onClose, imageSrc, setCroppedImage }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const ref = useRef(null);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const handleCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  const handleClose = () => {
    handleCroppedImage();
    onClose();
  };
  return (
    <Dialog open={open} className="photo-modal">
      <div className="cropper-container">
        <Cropper
          image={imageSrc}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={1.1}
          cropShape="round"
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <button onClick={handleClose}>Close modal</button>
    </Dialog>
  );
};
export default PhotoDialog;
