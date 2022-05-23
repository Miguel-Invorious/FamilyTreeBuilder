import ProfileCard from "./components/profile-card/ProfileCard.tsx";
import RelationCard from "./components/relation-card/RelationCard";
import RelationshipEdge from "./components/relationship-edge/RelationshipEdge";
import CustomEdge from "./components/CustomEdge";

export const heightGap = 380;
export const heightOffset = 40;
export const widthGap = 310;
export const widthOffset = 27;
export const buttonDimension = 30;
export const edgeTypes = {
  relationEdge: RelationshipEdge,
  customEdge: CustomEdge,
};
export const nodeTypes = {
  profileNode: ProfileCard,
  relationNode: RelationCard,
};
