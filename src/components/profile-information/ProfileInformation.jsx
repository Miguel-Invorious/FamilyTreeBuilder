import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Handle } from "react-flow-renderer";
import PhotoSelector from "../photo-selector/PhotoSelector";
import "./ProfileInformation.scss";

const ProfileInformation = ({ closeMenu, handles }) => {
  const formRef = useRef(null);
  const [formMenu, setFormMenu] = useState(false);
  const [isDeceased, setDeceased] = useState(false);
  const [information, setInformation] = useState({
    firstname: "firstname",
    birthDate: "Birthdate",
    deceased: false,
  });

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (closeMenu) {
      closeMenu();
    }
    setFormMenu(false);
    setInformation(data);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setFormMenu(false);
        if (closeMenu) {
          closeMenu();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef, closeMenu]);
  return (
    <div className="information-container">
      <Handle
        type="target"
        position={handles.female ? "left" : "right"}
        id="partner"
        style={{
          visibility: handles.isPartner ? "visible" : "hidden",
        }}
      />
      <Handle
        type="target"
        className="top-handle"
        position="top"
        id="top"
        style={{
          visibility: handles.parents ? "visible" : "hidden",
        }}
      />
      <Handle
        type="source"
        position={handles.female ? "left" : "right"}
        id="relatives"
        style={{
          visibility:
            handles.partner || handles.children || handles.expartners > 0
              ? "visible"
              : "hidden",
        }}
      />

      <div className="profile-card">
        <PhotoSelector closeMenu={closeMenu} />
        <div className="information">
          {formMenu ? (
            <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
              <label>
                <span>First Name/s</span>
                <input
                  type="text"
                  defaultValue={information.firstname}
                  {...register("firstname")}
                />
              </label>
              <label>
                <span>Last Name</span>
                <input type="text" {...register("lastname")} />
              </label>
              <label>
                <span>Date of birth</span>
                <input type="date" {...register("birthDate")} />
              </label>
              <label>
                <span>Gender</span>
                <input type="text" {...register("gender")} />
              </label>
              <label>
                <span>Deceased</span>
                <input
                  type="checkbox"
                  value={true}
                  {...register("deceased")}
                  onChange={() => setDeceased(!isDeceased)}
                />
              </label>
              {isDeceased && (
                <label>
                  <span>Date of death</span>
                  <input type="date" {...register("deathDate")} />
                </label>
              )}
              <input
                type="submit"
                className="save-button"
                value="Save and exit"
              />
            </form>
          ) : (
            <div onClick={() => setFormMenu(true)}>
              <div className="firstname">{information.firstname}</div>
              <div className="birthdate">{information.birthDate}</div>
              {information.deceased && (
                <div className="ded">{information.deathDate}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfileInformation;
