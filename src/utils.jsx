import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNode, addEdge, updateFlow } from "./redux/flowSlice";
import { useEdgesState, useNodesState } from "react-flow-renderer";
import ProfileCard from "./components/profile-card/ProfileCard";
import RelationCard from "./components/relation-card/RelationCard";
import RelationshipEdge from "./components/relationship-edge/RelationshipEdge";
import CustomEdge from "./components/CustomEdge";
import { bool, number } from "prop-types";
export const initialPosition = { x: 0, y: 0 };
export const heightGap = 300;
export const widthGap = 300;
export const useAddParent = (
  childId = "",
  childPosition = { x: number, y: number }
) => {
  const dispatch = useDispatch();
  let nodes = [];
  let edges = [];
  for (let i = 0; i < 2; i++) {
    let position = {
      x: childPosition.x + 0.5 * (i % 2) === 0 ? widthGap : -widthGap,
      y: childPosition.y - heightGap,
    };
    nodes.push({
      id: `${childId}-parent-${i}`,
      type: i % 2 === 0 ? "profileNode" : "relationNode",
      position,
      data: {
        position,
        female: i % 2 === 0,
        isParent: i % 2 === 0,
        isPartner: !(i % 2) === 0,
        partner: i % 2 === 0,
        children: 0,
      },
    });
  }
  edges.push(
    {
      id: `e-${childId}-parent`,
      type: "customEdge",
      source: `${childId}-parent-0`,
      target: `${childId}`,
      targetHandle: "top",
    },
    {
      id: `e-${childId}-parent-relation`,
      type: "relationEdge",
      source: `${childId}-parent-0`,
      target: `${childId}-parent-1`,
    }
  );
  return () => {
    dispatch(updateFlow({ nodes, edges }));
  };
};
export const useAddPartner = (
  partnerId = "",
  partnerPosition = { x: number, y: number },
  isPartnerFemale = bool
) => {
  const dispatch = useDispatch();
  return () => {
    dispatch(
      addNode([
        {
          id: `${partnerId}-partner`,
          type: "relationNode",
          position: {
            x: isPartnerFemale
              ? partnerPosition.x - widthGap
              : partnerPosition.x + widthGap,
            y: partnerPosition.y,
          },
          data: { isPartner: true, female: !isPartnerFemale },
        },
      ])
    );
    dispatch(
      addEdge([
        {
          id: `e-${partnerId}-partner`,
          type: "relationEdge",
          source: `${partnerId}`,
          target: `${partnerId}-partner`,
        },
      ])
    );
  };
};
export const useAddSibling = (
  siblingId = "",
  siblings = number,
  siblingPosition = { x: number, y: number }
) => {
  const dispatch = useDispatch();
  return () => {
    dispatch(
      addNode([
        {
          id: `${siblingId}-s-${siblings}`,
          type: "profileNode",
          position: {
            x: siblingPosition.x + widthGap * siblings,
            y: siblingPosition.y,
          },
          data: {
            parents: true,
            partner: false,
            expartners: 0,
            children: 0,
            female: false,
            isSibling: true,
            position: {
              x: siblingPosition.x + widthGap * siblings,
              y: siblingPosition.y,
            },
          },
        },
      ])
    );
    dispatch(
      addEdge([
        {
          id: `e-${siblingId}-s-${siblings}-partner`,
          type: "customEdge",
          source: `${siblingId}-parent-0`,
          target: `${siblingId}-s-${siblings}`,
          targetHandle: "top",
        },
      ])
    );
  };
};
export const nodeTypes = {
  profileNode: ProfileCard,
  relationNode: RelationCard,
};
export const edgeTypes = {
  relationEdge: RelationshipEdge,
  customEdge: CustomEdge,
};
export const useFamilyTree = () => {
  const initialPosition = { x: 0, y: 0 };
  const initalNodes = [
    {
      id: "0",
      type: "profileNode",
      position: initialPosition,
      parentNode: "0-pos",
      extent: "parent",
      data: {
        position: initialPosition,
        hasParents: false,
        sibling: 0,
        children: 0,
      },
    },
  ];
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [mokeNodes, setMokeNodes] = useState([]);
  let siblings = 0;
  let children = 0;
  const siblingGap = 300;
  const parentsGap = 400;
  const heightGap = 300;
  const addSibling = (id, currentPosition) => {
    siblings++;
    setNodes((currentNodes) => [
      ...currentNodes,
      {
        id: `s-${siblings}`,
        type: "profileNode",
        position: {
          x: currentPosition.x + siblingGap * siblings,
          y: currentPosition.y,
        },
        data: {
          addSibling,
          addCurrentPartner,
          deleteNode,
          isSibling: true,
          hasParents: true,
          position: {
            x: currentPosition.x + siblingGap * siblings,
            y: currentPosition.y,
          },
        },
      },
    ]);
    setEdges((currentEdges) => [
      ...currentEdges,
      {
        id: `e-${id}-${siblings}`,
        source: `s-${siblings}`,
        target: `${id}`,
        sourceHandle: "top",
        targetHandle: "top",
        type: "step",
      },
    ]);
  };
  const addCurrentPartner = (id, currentPosition) => {
    setNodes((currentNodes) => {
      const newNodes = [
        ...currentNodes,
        {
          id: `${id}-partner`,
          type: "profileNode",
          position: {
            x: currentPosition.x - siblingGap,
            y: currentPosition.y,
          },
          data: {
            addCurrentPartner,
            deleteNode,
            isPartner: true,
            position: {
              x: currentPosition.x - siblingGap,
              y: currentPosition.y,
            },
          },
        },
      ];
      setMokeNodes(newNodes);
      return newNodes;
    });
    setEdges((currentEdges) => [
      ...currentEdges,
      {
        id: `${id}-to-partner`,
        source: `${id}`,
        target: `${id}-partner`,
        sourceHandle: "left",
        targetHandle: "right",
        type: "relationEdge",
        data: { addChild },
      },
    ]);
  };
  const deleteNode = (id) => {
    if (id === "0") {
      return;
    }
    siblings--;
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
    setEdges((currentEdges) =>
      currentEdges.filter((edge) => edge.source !== id && edge.target !== id)
    );
  };
  const addParents = (id, currentPosition) => {
    setNodes((currentNodes) => [
      ...currentNodes,
      {
        id: `${id}-parent-0`,
        type: "profileNode",
        position: {
          x: currentPosition.x - parentsGap,
          y: currentPosition.y - heightGap,
        },
        data: {
          addParents,
          addCurrentPartner,
          deleteNode,
          position: {
            x: currentPosition.x - parentsGap,
            y: currentPosition.y - heightGap,
          },
          isPartner: true,
        },
      },
      {
        id: `${id}-parent-1`,
        type: "profileNode",
        position: {
          x: currentPosition.x + parentsGap,
          y: currentPosition.y - heightGap,
        },
        data: {
          addParents,
          addCurrentPartner,
          deleteNode,
          position: {
            x: currentPosition.x + parentsGap,
            y: currentPosition.y - heightGap,
          },
          isParent: true,
          hasPartner: true,
        },
      },
    ]);
    setEdges((currentEdges) => [
      ...currentEdges,

      {
        id: `e-${id}-parent`,
        source: `${id}-parent-1`,
        target: `${id}`,
        sourceHandle: "left",
        targetHandle: "top",
        type: "step",
      },
      {
        id: `e-${id}-parents`,
        source: `${id}-parent-1`,
        target: `${id}-parent-0`,
        sourceHandle: "left",
        targetHandle: "right",
        type: "relationEdge",
        data: { addChild },
      },
    ]);
  };
  const addChild = (id, parentPosition, children) => {
    setNodes((currentNodes) => {
      const newNodes = [
        ...currentNodes,
        {
          id: `${id}-child-${children}`,
          type: "profileNode",
          position: {
            x: parentPosition.x - siblingGap / 2,
            y: parentPosition.y + heightGap,
          },
          data: {
            addSibling,
            addCurrentPartner,
            deleteNode,
            addChild,
            isChild: true,
            hasParents: true,
            position: {
              x: parentPosition.x - siblingGap / 2,
              y: parentPosition.y + heightGap,
            },
          },
        },
      ];
      //return newNodes;
      return orderNodes(newNodes, parentPosition, `${id}-child`);
    });
    setEdges((currentEdges) => [
      {
        id: `e-${id}-child-${children}`,
        source: `${id}`,
        target: `${id}-child-${children}`,
        sourceHandle: "left",
        targetHandle: "top",
        type: "step",
      },
      ...currentEdges,
    ]);
  };
  const orderNodes = (nodes, parentPosition, filter) => {
    let howMany = nodes.filter((node) => node.id.includes(filter)).length;
    let counter = howMany % 2 === 0 ? howMany / 2 : (howMany - 1) / 2;
    return nodes.map((node) => {
      if (node.id.includes(filter)) {
        const newNode =
          howMany % 2 === 0
            ? {
                ...node,
                position: {
                  ...node.position,
                  x: parentPosition.x - siblingGap * counter,
                },
              }
            : {
                ...node,
                position: {
                  ...node.position,
                  x: parentPosition.x - siblingGap * (1 / 2 + counter),
                },
              };
        counter--;
        return newNode;
      } else return node;
    });
  };

  return [nodes, edges, onNodesChange, onEdgesChange];
};
