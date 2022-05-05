import React from "react";
import ProfileInformation from "../profile-information/ProfileInformation";

const RelationCard = ({ data, id }) => {
  const handles = data;
  return (
    <div className="container">
      <ProfileInformation profileData={data} handles={handles} />
    </div>
  );
};

export default RelationCard;
