import React, { useState, useEffect } from "react";
import ProfileInformation from "../profile-information/ProfileInformation";
import ProfileButtons from "../profile-buttons/ProfileButtons";
import {
  nodesAtom,
  edgesAtom,
  nodeCountAtom,
  parentAtom,
  addFamily,
  addSibling,
  addParents,
  addPartner,
  addEx,
  deleteNode,
  deleteEdge,
} from "../../utils";
import "./ProfileCard.scss";

import { useAtom } from "jotai";
const ProfileCard = ({ id, data }) => {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [papuest, setParent] = useAtom(parentAtom);
  const [nodeCount, setNodeCount] = useAtom(nodeCountAtom);
  const [viewButtons, toggleButtons] = useState(false);
  const [viewAddMenu, toggleAddMenu] = useState(false);
  const handleAddSibling = () => {
    if (!data.parent) {
      const me = nodes.find((node) => node.id === id);
      const [newNodes, newEdges] = addFamily(me, id, nodeCount);
      setNodes([
        ...nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: { ...node.data, parent: true, parentNode: newNodes[0] },
              }
            : node
        ),
        ...newNodes,
      ]);
      setEdges([...edges, ...newEdges]);
      setNodeCount(nodeCount + 2);
      setParent(newNodes[0].id);
    } else {
      const parent = nodes.find((node) => node.id === data.parentNode.id);
      let fromPartner = parent.data.childNodes.find((child) => child.id === id);
      let fromEx = parent.data.exchildNodes.find(
        (exchild) => exchild.id === id
      );
      const [newNodes, newEdges] = addSibling(
        nodeCount,
        nodes.find((node) => node.id === data.parentNode.id),
        fromEx
      );
      if (fromPartner) {
        setNodes([
          ...nodes
            .map((node) =>
              node.id === data.parentNode.id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      children: node.data.children + 1,
                      childNodes: [...node.data.childNodes, ...newNodes],
                    },
                  }
                : node
            )
            .map((node) => {
              if (node.data.parentNode) {
                return node.data.parentNode.id === id
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        parentNode: {
                          ...node.data.parentNode,
                          data: {
                            ...node.data.parentNode.data,
                            children: node.data.parentNode.data.children + 1,
                            childNodes: [
                              ...node.data.parentNode.data.childNodes,
                              ...newNodes,
                            ],
                          },
                        },
                      },
                    }
                  : node;
              }
              return node;
            }),
          ...newNodes,
        ]);
      }
      if (fromEx) {
        setNodes([
          ...nodes
            .map((node) =>
              node.id === data.parentNode.id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      exchildren: node.data.exchildren + 1,
                      exchildNodes: [...node.data.exchildNodes, ...newNodes],
                      parentNode: node.data.parentNode.data
                        ? {
                            ...node.data.parentNode,
                            data: {
                              ...node.data.parentNode.data,
                              exchildren: node.data.parentNode.exchildren + 1,
                              exchildNodes: [
                                ...node.data.parentNode.exchildNodes,
                                ...newNodes,
                              ],
                            },
                          }
                        : node.data.parentNode,
                    },
                  }
                : node
            )
            .map((node) => {
              if (node.data.parentNode) {
                return node.data.parentNode.id === id.replace(/\D/g, "")
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        parentNode: {
                          ...node.data.parentNode,
                          data: {
                            ...node.data.parentNode.data,
                            exchildren:
                              node.data.parentNode.data.exchildren + 1,
                            exchildNodes: [
                              ...node.data.parentNode.data.exchildNodes,
                              ...newNodes,
                            ],
                          },
                        },
                      },
                    }
                  : node;
              }
              return node;
            }),
          ...newNodes,
        ]);
      }
      setEdges([...edges, ...newEdges]);
      setNodeCount(nodeCount + 1);
    }
  };
  const handleAddParent = () => {
    const me = nodes.find((node) => node.id === id);
    const [newNodes, newEdges] = addParents(me, nodeCount, id);
    setNodes([
      ...nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...node.data, parent: true, parentNode: newNodes[0] },
            }
          : node
      ),
      ...newNodes,
    ]);
    setParent(newNodes[0].id);
    setEdges([...edges, ...newEdges]);
    setNodeCount(nodeCount + 1);
  };
  const handleAddPartner = () => {
    const [newNodes, newEdges] = addPartner(data, id);
    setNodes([
      ...nodes
        .map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  partner: true,
                  parentNode: node.data.parentNode.data
                    ? {
                        ...node.data.parentNode,
                        data: {
                          ...node.data.parentNode.data,
                          childNodes:
                            node.data.parentNode.data.children > 0
                              ? node.data.parentNode.data.childNodes.map(
                                  (child) =>
                                    child.id === id
                                      ? {
                                          ...child,
                                          data: {
                                            ...child.data,
                                            partner: true,
                                          },
                                        }
                                      : child
                                )
                              : node.data.childNodes,
                          exchildNodes:
                            node.data.parentNode.exchildren > 0
                              ? node.data.parentNode.data.exchildNodes.map(
                                  (child) =>
                                    child.id === id
                                      ? {
                                          ...child,
                                          data: {
                                            ...child.data,
                                            partner: true,
                                          },
                                        }
                                      : child
                                )
                              : node.data.childNodes,
                        },
                      }
                    : node.data.parentNode,
                },
              }
            : node
        )
        .map((node) =>
          node.id === data.parentNode.id
            ? {
                ...node,
                data: {
                  ...node.data,
                  childNodes:
                    node.data.children > 0
                      ? node.data.childNodes.map((child) =>
                          child.id === id
                            ? {
                                ...child,
                                data: {
                                  ...child.data,
                                  partner: true,
                                },
                              }
                            : child
                        )
                      : node.data.childNodes,
                  exchildNodes:
                    node.data.exchildren > 0
                      ? node.data.exchildNodes.map((child) =>
                          child.id === id
                            ? {
                                ...child,
                                data: {
                                  ...child.data,
                                  partner: true,
                                },
                              }
                            : child
                        )
                      : node.data.exchildNodes,
                },
              }
            : node
        ),
      ...newNodes,
    ]);
    setEdges([...edges, ...newEdges]);
  };
  const handleAddExPartner = () => {
    const [newNodes, newEdges] = addEx(data, id);
    setNodes([
      ...nodes
        .map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  expartner: true,
                  parentNode: node.data.parentNode.data
                    ? {
                        ...node.data.parentNode,
                        data: {
                          ...node.data.parentNode.data,
                          childNodes:
                            node.data.parentNode.children > 0
                              ? node.data.parentNode.data.childNodes.map(
                                  (child) =>
                                    child.id === id
                                      ? {
                                          ...child,
                                          data: {
                                            ...child.data,
                                            expartner: true,
                                          },
                                        }
                                      : child
                                )
                              : node.data.childNodes,
                          exchildNodes:
                            node.data.parentNode.exchildren > 0
                              ? node.data.parentNode.data.exchildNodes.map(
                                  (child) =>
                                    child.id === id
                                      ? {
                                          ...child,
                                          data: {
                                            ...child.data,
                                            expartner: true,
                                          },
                                        }
                                      : child
                                )
                              : node.data.childNodes,
                        },
                      }
                    : node.data.parentNode,
                },
              }
            : node
        )
        .map((node) =>
          node.id === data.parentNode.id
            ? {
                ...node,
                data: {
                  ...node.data,
                  childNodes:
                    node.data.children > 0
                      ? node.data.childNodes.map((child) =>
                          child.id === id
                            ? {
                                ...child,
                                data: {
                                  ...child.data,
                                  expartner: true,
                                },
                              }
                            : child
                        )
                      : node.data.childNodes,
                  exchildNodes:
                    node.data.exchildren > 0
                      ? node.data.exchildNodes.map((child) =>
                          child.id === id
                            ? {
                                ...child,
                                data: {
                                  ...child.data,
                                  expartner: true,
                                },
                              }
                            : child
                        )
                      : node.data.exchildNodes,
                },
              }
            : node
        ),
      ...newNodes,
    ]);
    setEdges([...edges, ...newEdges]);
  };
  const handleDeleteNode = () => {
    const newNodes = deleteNode(id, nodes);
    const newEdges = deleteEdge(id, edges, nodes);
    if (data.parent) {
      const parent = nodes.find((node) => node.id === data.parentNode.id);
      let fromPartner = parent.data.childNodes.find((child) => child.id === id);
      let fromEx = parent.data.exchildNodes.find(
        (exchild) => exchild.id === id
      );
      if (fromPartner) {
        setNodes(
          newNodes.map((node) =>
            node.id === data.parentNode.id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    children: node.data.children - 1,
                    childNodes: node.data.childNodes.filter(
                      (child) => !child.id.includes(id)
                    ),
                  },
                }
              : node
          )
        );
      }
      if (fromEx) {
        setNodes([
          ...newNodes.map((node) =>
            node.id === data.parentNode.id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    exchildren: node.data.exchildren - 1,
                    exchildNodes: node.data.exchildNodes.filter(
                      (child) => !child.id.includes(id)
                    ),
                  },
                }
              : node
          ),
        ]);
      }
    }
    setEdges([...newEdges]);
  };
  const menuClose = () => {
    toggleButtons(false);
    toggleAddMenu(false);
  };

  return (
    <div
      className="container"
      onMouseEnter={() => toggleButtons(true)}
      onMouseLeave={menuClose}
    >
      <ProfileInformation closeMenu={menuClose} gender={data.gender} id={id} />
      <ProfileButtons
        addParent={handleAddParent}
        addPartner={handleAddPartner}
        addExPartner={handleAddExPartner}
        addSibling={handleAddSibling}
        deleteNode={handleDeleteNode}
        toggleAddMenu={toggleAddMenu}
        hasParents={data.parents}
        hasPartner={data.partner}
        hasExPartner={data.expartner}
        isSibling={data.isSibling}
        viewButtons={viewButtons}
        viewAddMenu={viewAddMenu}
      />
    </div>
  );
};

export default ProfileCard;
