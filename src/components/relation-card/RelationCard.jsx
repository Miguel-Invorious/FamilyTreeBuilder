import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProfileInformation from "../profile-information/ProfileInformation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
const RelationCard = ({ data, id }) => {
  const currentGender = useSelector(
    (state) => state.flow.nodes.filter((node) => node.id === id)[0]
  );

  const [isVisible, setVisible] = useState(false);
  const toggleMenu = () => setVisible(!isVisible);
  return (
    <div
      className="container"
      onMouseEnter={toggleMenu}
      onMouseLeave={toggleMenu}
    >
      <ProfileInformation
        profileData={data}
        gender={currentGender.data.gender}
      />
      {isVisible && (
        <div className="button bottom">
          <FontAwesomeIcon icon={faX} />
        </div>
      )}
    </div>
  );
};

export default RelationCard;
