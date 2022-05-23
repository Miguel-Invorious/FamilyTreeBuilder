import React, { useState, useCallback, useRef, useEffect } from "react";
import { ResizableBox } from "react-resizable";
import Cropper from "react-easy-crop";
import Dialog from "@mui/material/Dialog";
import getCroppedImg from "./cropImage";
import "./PhotoDialog.scss";

const PhotoDialog = ({ open, onClose, imageSrc, setCroppedImage }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedAreaPixels = useRef();
  const cropRef = useRef(null);
  const onCropAreaChange = useCallback(
    (croppedArea, croppedPixels) => {
      croppedAreaPixels.current = croppedPixels;
    },
    [croppedAreaPixels]
  );
  const handleCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels.current
      );
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  const handleClose = () => {
    handleCroppedImage();
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cropRef.current && !cropRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cropRef]);

  return (
    <Dialog open={open} className="photo-modal">
      <div className="resize-container" ref={cropRef}>
        <ResizableBox
          className="resize"
          width={300}
          height={300}
          minConstraints={[250, 250]}
          maxConstraints={[600, 600]}
          resizeHandles={["sw", "se", "nw", "ne", "w", "e"]}
          handle={(h, ref) => (
            <span className={`custom-handle custom-handle-${h}`} ref={ref} />
          )}
        >
          <div className="cropper-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropAreaChange={onCropAreaChange}
            />
          </div>
        </ResizableBox>
      </div>
    </Dialog>
  );
};
export default PhotoDialog;
