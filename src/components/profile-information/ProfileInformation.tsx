import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Handle, Position } from "react-flow-renderer";
import PhotoSelector from "../photo-selector/PhotoSelector";
import { Gender } from "../../types/gender.ts";
import { ProfileInformationForm } from "./profile-information";
import { HandleNames } from "../../types/handle-names.ts";

import "./ProfileInformation.scss";
const ProfileInformation = ({ changeGender }) => {
  const formRef = useRef(null);
  const [formMenu, setFormMenu] = useState(false);
  const [isDeceased, setDeceased] = useState(false);
  const [information, setInformation] = useState<ProfileInformationForm>({
    firstname: "",
    lastname: "",
    dateOfBirth: "",
    dateOfDeath: undefined,
    deceased: false,
    gender: undefined,
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ProfileInformationForm>();
  const onSubmit = (data) => {
    setFormMenu(false);
    setInformation(data);
    changeGender(data.gender);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setFormMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef]);
  return (
    <div className="information-container">
      <div className="profile-card">
        <div className="photo-container">
          <Handle
            type="target"
            position={Position.Left}
            className="center"
            id={HandleNames.Partner}
          />
          <Handle
            type="target"
            className="top"
            position={Position.Top}
            id={HandleNames.Parent}
          />
          <Handle
            type="source"
            position={Position.Left}
            className="center"
            id={HandleNames.Relatives}
          />
          <Handle
            type="source"
            position={Position.Left}
            className="center"
            id={HandleNames.ExPartner}
          />
          <PhotoSelector />
        </div>
        <div className="information" ref={formRef}>
          {formMenu ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>
                <span>First Name/s</span>
                <input
                  defaultValue={information.firstname}
                  {...register("firstname", { required: true })}
                />
                <span className="error">{errors.firstname && "required"}</span>
              </label>
              <label>
                <span>Last Name</span>
                <input {...register("lastname")} />
              </label>
              <label>
                <span>Date of birth</span>
                <input
                  type="date"
                  {...register("dateOfBirth", { required: true })}
                />
                <span className="error">
                  {errors.dateOfBirth && "required"}
                </span>
              </label>
              <label>
                <span>Gender</span>
                <select
                  {...register("gender", { required: true })}
                  defaultValue="pick your gender"
                >
                  <option value={Gender.Female}>{Gender.Female}</option>
                  <option value={Gender.Male}>{Gender.Male}</option>
                </select>
                <span className="error">{errors.gender && "required"}</span>
              </label>
              <label>
                <span>Deceased</span>
                <input
                  type="checkbox"
                  {...register("deceased")}
                  onChange={(e) => setDeceased(!isDeceased)}
                />
              </label>
              {isDeceased && (
                <label>
                  <span>Date of death</span>
                  <input type="date" {...register("dateOfDeath")} />
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
              <div className="firstname">
                {information.firstname || "firstname"}
              </div>
              <div className="birthdate">{information.dateOfBirth}</div>
              {information.deceased && (
                <div className="ded">{information.dateOfDeath}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfileInformation;
