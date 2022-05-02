import { height } from "@mui/system";
import { useEffect, useState } from "react";
import { useEdgesState, useNodesState } from "react-flow-renderer";

export const useFamilyTree = () => {
  const initialPosition = { x: 0, y: 0 };
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
      return newNodes;
      //return orderNodes(newNodes, parentPosition, `${id}-child`);
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
  useEffect(() => {
    setNodes([
      {
        id: "0",
        type: "profileNode",
        position: initialPosition,
        data: {
          addSibling,
          addCurrentPartner,
          deleteNode,
          addParents,
          position: initialPosition,
          hasParents: false,
          sibling: 0,
          children: 0,
        },
      },
    ]);
  }, []);
  return [nodes, edges, onNodesChange, onEdgesChange];
};
