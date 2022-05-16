import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Handle } from "react-flow-renderer";
import { useAtom } from "jotai";
import { nodesAtom } from "../../utils.tsx";
import PhotoSelector from "../photo-selector/PhotoSelector";
import "./ProfileInformation.scss";
import { Checkbox, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

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
  const { handleSubmit, control } = useForm();
  const onSubmit = (data) => {
    if (closeMenu) {
      closeMenu();
    }
    setFormMenu(false);
    setInformation(data);
    console.log(data);
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
        // setFormMenu(false);
        // if (closeMenu) {
        //   closeMenu();
        // }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef, closeMenu]);
  return (
    <div className="information-container" ref={formRef}>
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
            position="left"
            className="center"
            id="expartner"
          />
          <PhotoSelector closeMenu={closeMenu} />
        </div>
        <div className="information">
          {formMenu ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>
                <span>First Name/s</span>
                <Controller
                  name="firstname"
                  control={control}
                  render={({ field }) => <TextField {...field} />}
                />
              </label>
              <label>
                <span>Last Name</span>
                <Controller
                  name="lastname"
                  control={control}
                  render={({ field }) => <TextField {...field} />}
                />
              </label>
              <label>
                <span>Date of birth</span>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  )}
                />
              </label>
              <label>
                <span>Gender</span>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <MenuItem value={"female"}>Female</MenuItem>
                      <MenuItem value={"male"}>Male</MenuItem>
                    </Select>
                  )}
                />
              </label>
              <label>
                <span>Deceased</span>
                <Controller
                  name="lastname"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      onChange={() => {
                        field.onChange();
                        setDeceased(!isDeceased);
                      }}
                    />
                  )}
                />
              </label>
              {isDeceased && (
                <label>
                  <span>Date of death</span>
                  <Controller
                    name="dateOfDeath"
                    control={control}
                    render={({ field }) => <DatePicker {...field} />}
                  />
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
