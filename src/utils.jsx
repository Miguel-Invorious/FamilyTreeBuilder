import { useDispatch } from "react-redux";
import { deleteNode } from "./redux/flowSlice";
import ProfileCard from "./components/profile-card/ProfileCard";
import RelationCard from "./components/relation-card/RelationCard";
import RelationshipEdge from "./components/relationship-edge/RelationshipEdge";
import CustomEdge from "./components/CustomEdge";
import { bool, number } from "prop-types";
export const initialPosition = { x: 0, y: 0 };
export const heightGap = 380;
export const heightOffset = 40;
export const widthGap = 300;
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
export const addParentsAndSiblings = (
  id,
  currentPosition = { x: number, y: number },
  mainNodes = number,
  child
) => {
  const sibling = {
    id: `${mainNodes + 1}`,
    type: "profileNode",
    position: {
      x: currentPosition.x + widthGap,
      y: currentPosition.y,
    },
    data: {
      parents: true,
      parentId: `${mainNodes}`,
      partner: true,
      expartner: false,
      children: 0,
      exchildren: 0,
      childrenId: [],
      exchildrenId: [],
      gender: "female",
      position: {
        x: currentPosition.x + widthGap,
        y: currentPosition.y,
      },
    },
  };
  let nodes = [];
  let edges = [];
  for (let i = 0; i < 2; i++) {
    let position = {
      x: currentPosition.x + (i % 2) === 0 ? widthGap / 2 : -widthGap / 2,
      y: currentPosition.y - heightGap,
    };
    nodes.push({
      id: i % 2 === 0 ? `${mainNodes}` : `${mainNodes}-partner`,
      type: i % 2 === 0 ? "profileNode" : "relationNode",
      position,
      data: {
        position,
        gender: i % 2 === 0 ? "female" : "male",
        isParent: i % 2 === 0,
        isPartner: i % 2 === 0 ? false : true,
        partner: i % 2 === 0,
        children: i % 2 === 0 && 2,
        childrenId: i % 2 === 0 && [child, sibling],
        exchildrenId: i % 2 === 0 && [],
        parentId: [],
        expartner: false,
        exchildren: 0,
      },
    });
  }
  nodes.push(sibling);
  edges.push(
    {
      id: `e-${mainNodes}-${id}`,
      type: "customEdge",
      data: "female",
      source: `${mainNodes}`,
      target: `${id}`,
      targetHandle: "top",
    },
    {
      id: `e-${mainNodes}-partner`,
      type: "relationEdge",
      source: `${mainNodes}`,
      target: `${mainNodes}-partner`,
    },
    {
      id: `e-${mainNodes + 1}-${mainNodes}`,
      type: "customEdge",
      data: sibling.data.gender,
      source: `${mainNodes}`,
      target: `${mainNodes + 1}`,
      targetHandle: "top",
    }
  );
  return { nodes, edges };
};

export const addParent = (
  childId = "",
  childPosition = { x: number, y: number },
  mainNodes = number,
  child
) => {
  let nodes = [];
  let edges = [];
  for (let i = 0; i < 2; i++) {
    let position = {
      x:
        i % 2 === 0
          ? childPosition.x + 0.5 * widthGap
          : childPosition.x - 0.5 * widthGap,
      y: childPosition.y - heightGap,
    };
    nodes.push({
      id: i % 2 === 0 ? `${mainNodes}` : `${mainNodes}-partner`,
      type: i % 2 === 0 ? "profileNode" : "relationNode",
      position,
      data: {
        position,
        gender: i % 2 === 0 ? "female" : "male",
        isParent: i % 2 === 0,
        isPartner: i % 2 === 0 ? false : true,
        partner: i % 2 === 0,
        children: i % 2 === 0 && 1,
        childrenId: i % 2 === 0 && [child],
        exchildrenId: i % 2 === 0 && [],
        parentId: [],
        expartner: false,
        exchildren: 0,
      },
    });
  }
  edges.push(
    {
      id: `e-${mainNodes}-${childId}`,
      type: "customEdge",
      data: "female",
      source: `${mainNodes}`,
      target: `${childId}`,
      targetHandle: "top",
    },
    {
      id: `e-${mainNodes}-partner`,
      type: "relationEdge",
      source: `${mainNodes}`,
      target: `${mainNodes}-partner`,
    }
  );
  return { nodes, edges };
};
export const addPartner_ = (
  partnerId = "",
  partnerPosition = { x: number, y: number },
  partnerGender = ""
) => {
  const nodes = [
    {
      id: `${partnerId}-partner`,
      type: "relationNode",
      position: {
        x:
          partnerGender === "female"
            ? partnerPosition.x - widthGap
            : partnerPosition.x + widthGap,
        y: partnerPosition.y,
      },
      data: {
        isPartner: true,
        gender: partnerGender === "female" ? "male" : "female",
      },
    },
  ];
  const edges = [
    {
      id: `e-${partnerId}-partner`,
      type: "relationEdge",
      source: `${partnerId}`,
      sourceHandle: "relatives",
      target: `${partnerId}-partner`,
      targetHandle: "partner",
    },
  ];
  return { nodes, edges };
};

export const addSibling = (mainNodes, parent) => {
  const nodes = [
    {
      id: `${mainNodes}`,
      type: "profileNode",
      position: {
        x:
          parent.data.childrenId[0].data.position.x +
          widthGap * parent.data.children,
        y: parent.data.childrenId[0].data.position.y,
      },
      data: {
        parents: true,
        parentId: parent,
        partner: false,
        expartner: false,
        children: 0,
        exchildren: 0,
        childrenId: [],
        exchildrenId: [],
        gender: "female",
        position: {
          x:
            parent.data.childrenId[0].data.position.x +
            widthGap * parent.data.children,
          y: parent.data.childrenId[0].data.position.y,
        },
      },
    },
  ];
  const edges = [
    {
      id: `e-${mainNodes}-${parent.id}`,
      type: "customEdge",
      data: nodes[0].data.gender,
      source: `${parent.id}`,
      target: `${mainNodes}`,
      targetHandle: "top",
    },
  ];

  return {
    nodes,
    edges,
  };
};
export const addChild = (
  parentId = "",
  parentPosition = { x: number, y: number },
  parent,
  mainNodes
) => {
  const xPos =
    parent.data.gender === "female"
      ? parentId.replace(/^[a-z]-\d-/, "") === "partner"
        ? parent.data.children > 0
          ? parent.data.childrenId[0].position.x +
            widthGap * parent.data.children
          : parentPosition.x - widthGap / 2 - 40
        : parent.data.exchildren > 0
        ? parent.data.exchildrenId[0].position.x -
          widthGap * parent.data.exchildren
        : parentPosition.x - widthGap / 2 - 40
      : parentId.replace(/^[a-z]-\d-/, "") === "partner"
      ? parent.data.children > 0
        ? parent.data.childrenId[0].position.x - widthGap * parent.data.children
        : parentPosition.x + widthGap / 2 - 95
      : parent.data.exchildren > 0
      ? parent.data.exchildrenId[0].position.x +
        widthGap * parent.data.exchildren
      : parentPosition.x - widthGap / 2 - 40;

  const yPos = parent.position.y + heightGap;
  const position = {
    x: xPos,
    y: yPos,
  };
  const nodes = [
    {
      id: `${mainNodes}`,
      type: "profileNode",
      position,
      data: {
        parents: true,
        parentId: parentId.replace(/\D/g, ""),
        partner: false,
        expartner: false,
        children: 0,
        exchildren: 0,
        childrenId: [],
        exchildrenId: [],
        gender: "female",
        position,
      },
    },
  ];
  const edges = [
    {
      id: `e-${mainNodes}-parent`,
      type: "customEdge",
      data: parent.data.gender,
      source:
        parentId.replace(/^[a-z]-\d-/, "") === "partner"
          ? `${parentId.replace(/\D/g, "")}`
          : parent.data.partner
          ? `${parentId.replace(/\D/g, "")}-partner`
          : `${parentId.replace(/\D/g, "")}`,
      target: `${mainNodes}`,
      targetHandle: "top",
      sourceHandle: parent.data.expartner ? "expartner" : "relatives",
    },
  ];

  return { nodes, edges };
};
export const addEx = (
  partnerId = "",
  partnerPosition = { x: number, y: number },
  partnerGender = "",
  exParnterCurrentPartner = bool
) => {
  const x = exParnterCurrentPartner ? 2 * widthGap : widthGap;
  const position = {
    x:
      partnerGender === "female"
        ? partnerPosition.x - x
        : partnerPosition.x + x,
    y: partnerPosition.y,
  };
  const nodes = [
    {
      id: `${partnerId}-expartner`,
      type: "relationNode",
      position: position,
      data: {
        isExPartner: true,
        gender: partnerGender === "female" ? "male" : "female",
      },
    },
  ];
  const edges = [
    {
      id: `e-${partnerId}-expartner`,
      type: "relationEdge",
      source: exParnterCurrentPartner ? `${partnerId}-partner` : `${partnerId}`,
      sourceHandle: exParnterCurrentPartner ? "expartner" : "relatives",
      target: `${partnerId}-expartner`,
      targetHandle: "partner",
      animated: true,
    },
  ];
  return { nodes, edges };
};

