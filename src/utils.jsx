import ProfileCard from "./components/profile-card/ProfileCard";
import RelationCard from "./components/relation-card/RelationCard";
import RelationshipEdge from "./components/relationship-edge/RelationshipEdge";
import CustomEdge from "./components/CustomEdge";
//import { initialEdge, initialNode } from "./nodes";
import { node, number, string } from "prop-types";
import { atom } from "jotai";

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
export const nodeData = {
  parent: false,
  partner: false,
  expartner: false,
  children: 0,
  exchildren: 0,
  childNodes: [],
  exchildNodes: [],
  parentNode: [],
  gender: "female",
  position: { x: 0, y: 0 },
};
export const relationNodeData = {};
export const initialNode = [
  {
    id: "0",
    type: "profileNode",
    position: { x: 0, y: 0 },
    data: nodeData,
  },
];
export const initialEdge = [];
export const nodesAtom = atom(initialNode);
export const edgesAtom = atom(initialEdge);
export const parentAtom = atom("0");
export const nodeCountAtom = atom(1);
export const addPartner = (me, id = string) => {
  const nodes = [
    {
      id: `${id}-partner`,
      type: "relationNode",
      position: {
        x:
          me.gender === "female"
            ? me.position.x - widthGap
            : me.position.x + widthGap,
        y: me.position.y,
      },
      data: {
        gender: me.gender === "female" ? "male" : "female",
      },
    },
  ];
  const edges = [
    {
      id: `e-${id}-partner`,
      type: "relationEdge",
      source: `${id}`,
      sourceHandle: "relatives",
      target: `${id}-partner`,
      targetHandle: "partner",
    },
  ];
  return [nodes, edges];
};
export const addEx = (data, id) => {
  const x = data.partner ? 2 * widthGap : widthGap;
  const position = {
    x: data.gender === "female" ? data.position.x - x : data.position.x + x,
    y: data.position.y,
  };
  const nodes = [
    {
      id: `${id}-expartner`,
      type: "relationNode",
      position: position,
      data: {
        isExPartner: true,
        gender: data.gender === "female" ? "male" : "female",
      },
    },
  ];
  const edges = [
    {
      id: `e-${id}-expartner`,
      type: "relationEdge",
      source: data.partner ? `${id}-partner` : `${id}`,
      sourceHandle: data.partner ? "expartner" : "relatives",
      target: `${id}-expartner`,
      targetHandle: "partner",
      animated: true,
    },
  ];
  return [nodes, edges];
};

export const addFamily = (me, id = string, nodeCount = number) => {
  let nodes = [];
  let edges = [];
  const position = {
    x:
      me.data.gender === "female"
        ? me.data.position.x - widthGap
        : me.data.position.x + widthGap,
    y: me.data.position.y,
  };
  const parentPosition = {
    x: me.data.position.x,
    y: me.data.position.y - heightGap,
  };
  const sibling = {
    id: `${nodeCount + 1}`,
    type: "profileNode",
    position: position,
    data: {
      ...nodeData,
      position,
      parent: true,
    },
  };
  const parent = {
    id: `${nodeCount}`,
    type: "profileNode",
    position: parentPosition,
    data: {
      ...nodeData,
      position: parentPosition,
      partner: true,
      children: 2,
      childNodes: [me, sibling],
      gender: me.data.gender,
    },
  };

  nodes.push(
    ...[
      parent,
      {
        id: `${nodeCount}-partner`,
        type: "relationNode",
        position: {
          ...parentPosition,
          x:
            me.data.gender === "female"
              ? parentPosition.x - widthGap
              : parentPosition.x + widthGap,
        },
        data: { gender: me.data.gender === "male" ? "female" : "male" },
      },
      { ...sibling, data: { ...sibling.data, parentNode: parent } },
    ]
  );
  edges.push(
    ...[
      {
        id: `e-${nodeCount}-${id}`,
        type: "customEdge",
        data: me.data.gender,
        source: `${nodeCount}`,
        target: `${id}`,
        targetHandle: "top",
        sourceHandle: "relatives",
      },
      {
        id: `e-${nodeCount}-partner`,
        type: "relationEdge",
        source: `${nodeCount}`,
        target: `${nodeCount}-partner`,
      },
      {
        id: `e-${nodeCount + 1}-${nodeCount}`,
        type: "customEdge",
        data: me.data.gender,
        source: `${nodeCount}`,
        target: `${nodeCount + 1}`,
        targetHandle: "top",
        sourceHandle: "relatives",
      },
    ]
  );
  return [nodes, edges];
};
export const addParents = (me, nodeCount = number, id = string) => {
  let nodes = [];
  let edges = [];
  console.log(me);
  const parentPosition = {
    x: me.data.position.x + widthGap / 2,
    y: me.data.position.y - heightGap,
  };
  nodes.push(
    ...[
      {
        id: `${nodeCount}`,
        type: "profileNode",
        position: parentPosition,
        data: {
          ...nodeData,
          position: parentPosition,
          partner: true,
          children: 1,
          childNodes: [me],
          gender: "female",
        },
      },
      {
        id: `${nodeCount}-partner`,
        type: "relationNode",
        position: { ...parentPosition, x: parentPosition.x - widthGap },
        data: { gender: "male" },
      },
    ]
  );
  edges.push(
    ...[
      {
        id: `e-${nodeCount}-${id}`,
        type: "customEdge",
        data: "female",
        source: `${nodeCount}`,
        target: `${id}`,
        targetHandle: "top",
        sourceHandle: "relatives",
      },
      {
        id: `e-${nodeCount}-partner`,
        type: "relationEdge",
        source: `${nodeCount}`,
        target: `${nodeCount}-partner`,
      },
    ]
  );
  return [nodes, edges];
};

export const addSibling = (nodeCount = number, parent, fromEx) => {
  const xPos =
    parent.data.gender === "female"
      ? fromEx
        ? parent.data.exchildNodes[0].position.x -
          widthGap * parent.data.exchildren
        : parent.data.childNodes[0].position.x - widthGap * parent.data.children
      : fromEx
      ? parent.data.exchildNodes[0].position.x +
        widthGap * parent.data.exchildren
      : parent.data.childNodes[0].position.x + widthGap * parent.data.children;

  const yPos = parent.position.y + heightGap;
  const position = {
    x: xPos,
    y: yPos,
  };
  const nodes = [
    {
      id: `${nodeCount}`,
      type: "profileNode",
      position,
      data: {
        ...nodeData,
        parent: true,
        parentNode: parent,
        position,
      },
    },
  ];
  const edges = [
    {
      id: `e-${nodeCount}-parent`,
      type: "customEdge",
      data: parent.data.gender,
      source: fromEx
        ? parent.data.partner
          ? `${parent.id}-partner`
          : `${parent.id}`
        : `${parent.id}`,
      sourceHandle: fromEx
        ? parent.data.partner
          ? "expartner"
          : "relatives"
        : "relatives",
      target: `${nodeCount}`,
      targetHandle: "top",
    },
  ];
  return [nodes, edges];
};
export const addChild = (id = "", parent, mainNodes) => {
  const xPos =
    parent.data.gender === "female"
      ? id.replace(/^[a-z]-\d-/, "") === "partner"
        ? parent.data.children > 0
          ? parent.data.childNodes[0].position.x -
            widthGap * parent.data.children
          : parent.position.x - widthGap / 2
        : parent.data.exchildren > 0
        ? parent.data.exchildNodes[0].position.x -
          widthGap * parent.data.exchildren
        : parent.position.x - 1.5 * widthGap
      : id.replace(/^[a-z]-\d-/, "") === "partner"
      ? parent.data.children > 0
        ? parent.data.childNodes[0].position.x + widthGap * parent.data.children
        : parent.position.x + widthGap / 2
      : parent.data.exchildren > 0
      ? parent.data.exchildNodes[0].position.x +
        widthGap * parent.data.exchildren
      : parent.position.x + 1.5 * widthGap;

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
        ...nodeData,
        parent: true,
        parentNode: parent,
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
        id.replace(/^[a-z]-\d-/, "") === "partner"
          ? `${id.replace(/\D/g, "")}`
          : parent.data.partner
          ? `${id.replace(/\D/g, "")}-partner`
          : `${id.replace(/\D/g, "")}`,
      target: `${mainNodes}`,
      targetHandle: "top",
      sourceHandle: parent.data.expartner ? "expartner" : "relatives",
    },
  ];

  return [nodes, edges];
};

export const deleteNode = (id, nodes) => {
  const nodeToDelete = nodes.find((node) => node.id === id);
  if (nodeToDelete.data.children > 0) {
    nodeToDelete.data.childNodes.forEach((child) => {
      nodes = deleteNode(child.id, nodes);
    });
  }
  return nodes
    .map((node) => {
      if (node.data.children > 0) {
        return node.data.childNodes.includes(nodeToDelete)
          ? {
              ...node,
              data: {
                ...node.data,
                children: node.data.children - 1,
                childNodes: node.data.childNodes.filter(
                  (child) => !child.id.includes(nodeToDelete.id)
                ),
              },
            }
          : node;
      } else if (node.data.exchildren > 0) {
        return node.data.exchildNodes.includes(nodeToDelete)
          ? {
              ...node,
              data: {
                ...node.data,
                exchildren: node.data.exchildren - 1,
                exchildNodes: node.data.exchildNodes.filter(
                  (child) => !child.id.includes(nodeToDelete.id)
                ),
              },
            }
          : node;
      } else return node;
    })
    .filter((node) => !node.id.includes(id));
};
export const deleteRelation = (id, nodes) => {
  const nodePartner = nodes.find((node) => node.id === id.replace(/\D/g, ""));
  if (nodePartner.data.children > 0) {
    nodePartner.data.childNodes.forEach(
      (child) => (nodes = deleteNode(child.id, nodes))
    );
  }
  return nodes
    .map((node) =>
      node.id === id.replace(/\D/g, "")
        ? {
            ...node,
            data: {
              ...node.data,
              children: 0,
              childNodes: [],
              partner:
                id.replace(/\d-/, "") === "partner" ? false : node.data.partner,
              expartner:
                id.replace(/\d-/, "") === "expartner"
                  ? false
                  : node.data.expartner,
            },
          }
        : node
    )
    .filter((node) => !node.id.includes(id));
};
export const deleteEdge = (id, edges, nodes) => {
  const nodeToDelete = nodes.find((node) => node.id === id);
  if (nodeToDelete.data.children > 0) {
    nodeToDelete.data.childNodes.forEach((child) => {
      edges = deleteEdge(child.id, edges, nodes);
    });
  }
  return edges.filter((edge) => !edge.id.includes(id));
};

export const reorder = (papuest, nodes, index, ids) => {
  const me = nodes.find((node) => node.id === papuest);
  const parent = me && nodes.find((node) => node.id === me.data.parentNode.id);
  if (me) {
    if (me.data.childNodes.length > 0) {
      let ids = [];
      me.data.childNodes.forEach((child, index) => {
        ids.push(child.id);
        nodes = reorder(child.id, nodes, index, ids);
      });
      let firstChild = nodes.find((node) => node.id === ids[0]);
      let lastChild = nodes.find((node) => node.id === ids[ids.length - 1]);
      const xGap = Math.abs(lastChild.position.x) - firstChild.position.x;
      const newParentPosX = firstChild.position.x - (xGap + widthGap) / 2;
      return nodes
        .map((node) =>
          node.id === me.id
            ? {
                ...node,
                position: {
                  ...node.position,
                  x: newParentPosX,
                },
                data: {
                  ...node.data,
                  position: {
                    ...node.position,
                    x: newParentPosX,
                  },
                },
              }
            : node
        )
        .map((node) =>
          node.id === `${me.id}-partner`
            ? {
                ...node,
                position: {
                  ...node.position,
                  x: newParentPosX + widthGap,
                },
                data: {
                  ...node.data,
                  position: {
                    ...node.position,
                    x: newParentPosX + widthGap,
                  },
                },
              }
            : node
        );
    }
  }
  if (parent) {
    if (index > 0) {
      const xGap = -widthGap;
      return nodes.map((node) =>
        node.id === me.id
          ? {
              ...node,
              position: {
                ...node.position,
                x: parent.data.childNodes[0].position.x + xGap * index,
              },
              data: {
                ...node.data,
                position: {
                  ...node.position,
                  x: parent.data.childNodes[0].position.x + xGap * index,
                },
              },
            }
          : node
      );
    }
  }
  return nodes;
};
