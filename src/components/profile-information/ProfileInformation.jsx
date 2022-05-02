import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Handle } from "react-flow-renderer";
import PhotoSelector from "../photo-selector/PhotoSelector";
import DefaultProfilePhoto from "../../assets/profile-image.jpg";
import "./ProfileInformation.scss";

const ProfileInformation = ({ nodeData, closeMenu, handles }) => {
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
    closeMenu();
    setFormMenu(false);
    setInformation(data);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setFormMenu(false);
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef]);
  return (
    <div className="information-container">
      {nodeData.isSibling && (
        <Handle type="source" className="top-handle" position="top" id="top" />
      )}
      {nodeData.isPartner && (
        <Handle type="target" position="right" id="right" />
      )}
      {(handles.partner || nodeData.hasPartner || nodeData.isParent) && (
        <Handle type="source" position="left" id="left" />
      )}
      {(handles.sibling || handles.parent || nodeData.isChild) && (
        <Handle type="target" className="top-handle" position="top" id="top" />
      )}

      <div className="profile-card">
        <PhotoSelector closeMenu={closeMenu}/>
        {/* <img className="picture" src={DefaultProfilePhoto} alt="profile" /> */}
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
