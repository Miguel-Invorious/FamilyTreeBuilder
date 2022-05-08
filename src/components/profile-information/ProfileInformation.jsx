import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Handle } from "react-flow-renderer";
import { useAtom } from "jotai";
import { nodesAtom } from "../../utils";
import PhotoSelector from "../photo-selector/PhotoSelector";
import "./ProfileInformation.scss";

const ProfileInformation = ({ closeMenu, gender, id }) => {
  const formRef = useRef(null);
  const [formMenu, setFormMenu] = useState(false);
  const [isDeceased, setDeceased] = useState(false);
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [information, setInformation] = useState({
    firstname: "firstname",
    birthDate: "Birthdate",
    deceased: false,
    gender,
  });
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    if (closeMenu) {
      closeMenu();
    }
    setFormMenu(false);
    setInformation(data);
    setNodes(
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, gender: data.gender } }
          : node
      )
    );
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
      <div className="profile-card">
        <div className="photo-container">
          <Handle
            type="target"
            position={"left"}
            className={"center"}
            id="partner"
          />
          <Handle type="target" className="top" position="top" id="top" />
          <Handle
            type="source"
            position={"left"}
            className={"center"}
            id="relatives"
          />
          <Handle
            type="source"
            position={"rigth"}
            className={"center"}
            id="expartner"
          />
          <PhotoSelector closeMenu={closeMenu} />
        </div>

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
                <select {...register("gender")}>
                  <option value={"female"}>Female</option>
                  <option value={"male"}>Male</option>
                </select>
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
