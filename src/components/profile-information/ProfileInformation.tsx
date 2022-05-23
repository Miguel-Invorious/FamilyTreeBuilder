import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Handle, Position } from "react-flow-renderer";
import { useAtom } from "jotai";
import { nodesAtom } from "../../utils.tsx";
import PhotoSelector from "../photo-selector/PhotoSelector";
import "./ProfileInformation.scss";
import { Checkbox, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Gender } from "../../types/gender.ts";
import { ProfileInformationForm } from "./profile-information";
import { HandleNames } from "../../types/handle-names.ts";

const ProfileInformation = ({ closeMenu, changeGender, initialGender }) => {
  const formRef = useRef(null);
  const [formMenu, setFormMenu] = useState(false);
  const [isDeceased, setDeceased] = useState(false);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [information, setInformation] = useState<ProfileInformationForm>({
    firstname: "",
    lastname: "",
    dateOfBirth: undefined,
    dateOfDeath: undefined,
    deceased: false,
    gender: undefined,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileInformationForm>();
  const birthDate =
    information.dateOfBirth &&
    `${
      information.dateOfBirth.getMonth() + 1
    }/${information.dateOfBirth.getDate()}/${information.dateOfBirth.getFullYear()}`;
  const deathDate =
    information.dateOfDeath &&
    `${
      information.dateOfDeath.getMonth() + 1
    }/${information.dateOfDeath.getDate()}/${information.dateOfDeath.getFullYear()}`;
  const onSubmit = (data) => {
    if (closeMenu) {
      closeMenu();
    }
    setFormMenu(false);
    setInformation(data);
    changeGender(data.gender);
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
                  // rules={{ required: true }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        value={information.firstname}
                        onChange={(event) => {
                          const { value } = event.target;
                          setInformation({
                            ...information,
                            firstname: value,
                          });
                          field.onChange(value);
                        }}
                      />
                      <span className="error">
                        {errors.firstname && "required"}
                      </span>
                    </>
                  )}
                />
              </label>
              <label>
                <span>Last Name</span>
                <Controller
                  name="lastname"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={information.lastname}
                      onChange={(event) => {
                        const { value } = event.target;
                        setInformation({
                          ...information,
                          lastname: value,
                        });
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </label>
              <label>
                <span>Date of birth</span>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  // rules={{ required: true }}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        {...field}
                        renderInput={(params) => <TextField {...params} />}
                        open={isCalendarOpen}
                        onOpen={() => setCalendarOpen(true)}
                        onClose={() => setCalendarOpen(false)}
                      />
                      <span className="error">
                        {errors.dateOfBirth && "required"}
                      </span>
                    </>
                  )}
                />
              </label>
              <label>
                <span>Gender</span>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        value={information.gender}
                        onChange={(event) => {
                          const { value } = event.target;
                          setInformation({
                            ...information,
                            gender: Gender[value],
                          });
                          field.onChange(value);
                        }}
                      >
                        <MenuItem value={Gender.Female} selected>
                          {Gender.Female}
                        </MenuItem>
                        <MenuItem value={Gender.Male}>{Gender.Male}</MenuItem>
                      </Select>
                      <span className="error">
                        {errors.gender && "required"}
                      </span>
                    </>
                  )}
                />
              </label>
              <label>
                <span>Deceased</span>
                <Controller
                  name="deceased"
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
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
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
              <div className="firstname">
                {information.firstname || "firstname"}
              </div>
              <div className="birthdate">{birthDate}</div>
              {information.deceased && <div className="ded">{deathDate}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfileInformation;
