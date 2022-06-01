import { Node, Edge } from "react-flow-renderer";
import { FamilyMember, useFamilyMember } from "./use-family-member.ts";
import { useEffect, useState } from "react";
import { Position } from "./types/position";
import { NodeType } from "./types/node-type.ts";
import { EdgeType } from "./types/edge-type.ts";
import { NodeData } from "./types/node-data";
import { Gender } from "./types/gender.ts";
import { HandleNames } from "./types/handle-names.ts";
import { widthGap, heightGap } from "./utils.tsx";

export function useGetNodesAndEdges() {
  const {
    familyMember,
    isFemale,
    isFirstChild,
    isFirstExChild,
    isChild,
    isExChild,
    hasParents,
    hasSiblings,
    hasChildren,
    hasExChildren,
    hasMoreThanOneChild,
    hasMoreThanOneExChild,
    getPreviousUncle,
    hasPartner,
    isHeadFamilyMember,
    getPreviousSibling,
    getPreviousExSibling,
    getBaseParent,
    hasExPartner,
  } = useFamilyMember();

  const [currentNodes, setCurrentNodes] = useState<Node[]>([]);
  const [currentEdges, setCurrentEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const nodes = [] as Node[];
    const edges = [] as Edge[];
    const baseFamilyMember = getBaseParent();
    render(baseFamilyMember);

    function render(familyMember: FamilyMember) {
      if (hasChildren(familyMember)) {
        let childrenEdges = [] as Edge[];
        familyMember.children.forEach((child) => {
          render(child);
          const edge = buildEdge(
            familyMember.id,
            child.id,
            HandleNames.Children,
            HandleNames.Parent,
            EdgeType.CustomEdge,
            { gender: familyMember.gender }
          );
          childrenEdges.push(edge);
        });
        edges.push(...childrenEdges);
      }
      if (hasExChildren(familyMember)) {
        let exChildrenEdges = [] as Edge[];
        let center;
        familyMember.exChildren.forEach((exChild) => {
          render(exChild);
          if (hasMoreThanOneExChild(familyMember)) {
            center = getFamilyMemberNode(familyMember.exChildren[0]).position.x;
          }
          let edgeSource = hasPartner(familyMember)
            ? familyMember.partner.id
            : familyMember.id;
          const edge = buildEdge(
            edgeSource,
            exChild.id,
            HandleNames.Relatives,
            HandleNames.Parent,
            EdgeType.CustomEdge,
            { gender: familyMember.gender, center }
          );
          exChildrenEdges.push(edge);
        });
        edges.push(...exChildrenEdges);
      }
      let baseNodeX = 0;
      let baseNodeY = 0;
      let baseNodeData: NodeData = {
        familyMember,
        haveParents: hasParents(familyMember),
        havePartner: hasPartner(familyMember),
        haveExPartner: hasExPartner(familyMember),
      };
      if (!isHeadFamilyMember(familyMember)) {
        if (isChild(familyMember)) {
          if (isFirstChild(familyMember)) {
            let { x, y } = getFirstChildPosition(familyMember);
            baseNodeX = x;
            baseNodeY = y;
          } else {
            let { x, y } = getChildPosition(familyMember);
            baseNodeX = x;
            baseNodeY = y;
          }
        }
        if (isExChild(familyMember)) {
          if (isFirstExChild(familyMember)) {
            const parent = familyMember.parents[0];
            if (hasChildren(parent)) {
              const { children } = parent;
              const { position: firstSiblingPosition } = getFamilyMemberNode(
                children[0]
              );
              const { position: lastSiblingPosition } = getFamilyMemberNode(
                children[children.length - 1]
              );
              baseNodeY = firstSiblingPosition.y;
              if (isFemale(parent)) {
                baseNodeX = firstSiblingPosition.x - widthGap;
                if (hasPartner(children[0]) && isFemale(children[0])) {
                  baseNodeX -= 1.5 * widthGap;
                }
              } else {
                baseNodeX = lastSiblingPosition.x + widthGap;
              }
            } else {
              const { hasPrevUncle, prevUncle } =
                getPreviousUncle(familyMember);
              if (hasPrevUncle) {
                const { position: prevUnclePosition } =
                  getFamilyMemberNode(prevUncle);
                baseNodeY = prevUnclePosition.y + heightGap;
                if (isFemale(familyMember.parents[0])) {
                  baseNodeX = prevUnclePosition.x + 2 * widthGap;
                } else {
                  baseNodeX = prevUnclePosition.x + 3 * widthGap;
                }
              }
            }
          } else {
            let { x, y } = getExChildPosition(familyMember);
            baseNodeX = x;
            baseNodeY = y;
          }
        }
      } else {
        if (hasExChildren(familyMember) && !hasChildren(familyMember)) {
          const { exChildren } = familyMember;
          const { position } = getFamilyMemberNode(exChildren[0]);
          baseNodeY = position.y - heightGap;
          baseNodeX = position.x - widthGap / 2;
          if (hasPartner(familyMember)) {
            baseNodeX = position.x - 1.5 * widthGap;
          }
          if (isFemale(familyMember)) {
            baseNodeX = position.x + widthGap / 2;
            if (hasPartner(familyMember)) {
              baseNodeX = position.x + 1.5 * widthGap;
            }
          }
        } else {
          if (hasChildren(familyMember)) {
            const { children } = familyMember;
            const { x, y } = centerParentNode(children, familyMember);
            baseNodeX = x;
            baseNodeY = y;
          } else {
            if (isFirstChild(familyMember)) {
              const { hasPrevUncle, prevUncle } =
                getPreviousUncle(familyMember);
              if (hasPrevUncle) {
                const { position: prevUnclePosition } =
                  getFamilyMemberNode(prevUncle);
                baseNodeY = prevUnclePosition.y + heightGap;
                if (isHeadFamilyMember(prevUncle)) {
                  if (hasExChildren(prevUncle) && !isFemale(prevUncle)) {
                    const { exChildren: exCousins } = prevUncle;
                    const prevExCousin = exCousins[exCousins.length - 1];
                    const { position: prevExCousinPosition } =
                      getFamilyMemberNode(prevExCousin);
                    baseNodeX = prevExCousinPosition.x + 1.5 * widthGap;
                  } else {
                    if (hasMoreThanOneChild(prevUncle)) {
                      const { children: cousins } = prevUncle;
                      const prevCousin = cousins[cousins.length - 1];
                      const { position: prevCousinPosition } =
                        getFamilyMemberNode(prevCousin);
                      baseNodeY = prevCousinPosition.y;
                      if (hasSiblings(familyMember)) {
                        if (isFemale(familyMember)) {
                          baseNodeX = prevCousinPosition.x + 2.5 * widthGap;
                        } else {
                          baseNodeX = prevCousinPosition.x + 1.5 * widthGap;
                        }
                      } else {
                        baseNodeX = prevCousinPosition.x + 2 * widthGap;
                      }
                    } else {
                      if (isFemale(prevUncle)) {
                        if (hasSiblings(familyMember)) {
                          if (isFemale(familyMember)) {
                            baseNodeX = prevUnclePosition.x + 2.5 * widthGap;
                          } else {
                            baseNodeX = prevUnclePosition.x + 1.5 * widthGap;
                          }
                        } else {
                          baseNodeX = prevUnclePosition.x + 2 * widthGap;
                        }
                      } else {
                        if (hasSiblings(familyMember)) {
                          if (isFemale(familyMember)) {
                            baseNodeX = prevUnclePosition.x + 3.5 * widthGap;
                            if (hasExPartner(familyMember.parent[0])) {
                              baseNodeX += widthGap;
                            }
                          } else {
                            baseNodeX = prevUnclePosition.x + 2.5 * widthGap;
                            if (hasExPartner(familyMember.parent[0])) {
                              baseNodeX += widthGap;
                            }
                          }
                        } else {
                          baseNodeX = prevUnclePosition.x + 3 * widthGap;
                        }
                      }
                    }
                  }
                } else {
                  if (hasSiblings(familyMember)) {
                    if (isFemale(familyMember)) {
                      baseNodeX = prevUnclePosition.x + 2.5 * widthGap;
                    } else {
                      baseNodeX = prevUnclePosition.x + 1.5 * widthGap;
                    }
                  } else {
                    baseNodeX = prevUnclePosition.x + 2 * widthGap;
                  }
                }
              }
            } else {
              const { hasPrevSibling, prevSibling } =
                getPreviousSibling(familyMember);
              if (hasPrevSibling) {
                const { position: prevSiblingPosition } =
                  getFamilyMemberNode(prevSibling);
                baseNodeY = prevSiblingPosition.y;
                if (!isFemale(familyMember)) {
                  baseNodeX = prevSiblingPosition.x + 1.5 * widthGap;
                } else {
                  if (isHeadFamilyMember(prevSibling)) {
                    if (hasExChildren(prevSibling) && !isFemale(prevSibling)) {
                      const { exChildren: exNephews } = prevSibling;
                      const prevExNephew = exNephews[exNephews.length - 1];
                      const { position: prevExCousinPosition } =
                        getFamilyMemberNode(prevExNephew);
                      baseNodeX = prevExCousinPosition.x + 3 * widthGap;
                      if (hasExPartner(familyMember)) {
                        baseNodeX += widthGap;
                      }
                    } else {
                      if (hasMoreThanOneChild(prevSibling)) {
                        const { children: nephews } = prevSibling;
                        const prevNephew = nephews[nephews.length - 1];
                        const { position: prevNephewPosition } =
                          getFamilyMemberNode(prevNephew);
                        if (isFemale(familyMember)) {
                          baseNodeX = prevNephewPosition.x + 2.5 * widthGap;
                          if (hasExPartner(familyMember)) {
                            baseNodeX = baseNodeX + widthGap;
                          }
                        } else {
                          baseNodeX = prevNephewPosition.x + 1.5 * widthGap;
                        }
                      } else {
                        if (isFemale(prevSibling)) {
                          if (isFemale(familyMember)) {
                            baseNodeX = prevSiblingPosition.x + 2.5 * widthGap;
                            if (hasExPartner(familyMember)) {
                              baseNodeX += widthGap;
                            }
                          } else {
                            baseNodeX = prevSiblingPosition.x + 1.5 * widthGap;
                            if (hasExPartner(familyMember)) {
                              baseNodeX += widthGap;
                            }
                          }
                        } else {
                          if (isFemale(familyMember)) {
                            baseNodeX = prevSiblingPosition.x + 3.5 * widthGap;
                            if (hasExPartner(prevSibling)) {
                              baseNodeX += widthGap;
                            }
                            if (hasExPartner(familyMember)) {
                              baseNodeX += widthGap;
                            }
                          } else {
                            baseNodeX = prevSiblingPosition.x + 2.5 * widthGap;
                          }
                        }
                      }
                    }
                  } else {
                    if (isFemale(familyMember)) {
                      baseNodeX = prevSiblingPosition.x + 2.5 * widthGap;
                      if (hasExPartner(familyMember)) {
                        baseNodeX = prevSiblingPosition.x + 3.5 * widthGap;
                      }
                    } else {
                      baseNodeX = prevSiblingPosition.x + 1.5 * widthGap;
                    }
                  }
                }
              }
            }
          }
        }
      }

      const baseNode = buildNode(
        { x: baseNodeX, y: baseNodeY },
        familyMember.id,
        baseNodeData
      );
      if (hasPartner(familyMember)) {
        const { partnerNode, partnerEdge } = renderPartner(
          baseNode,
          familyMember
        );
        nodes.push(partnerNode);
        edges.push(partnerEdge);
      }
      if (hasExPartner(familyMember)) {
        const { exPartnerNode, exPartnerEdge } = renderExPartner(
          baseNode,
          familyMember
        );
        nodes.push(exPartnerNode);
        edges.push(exPartnerEdge);
      }
      nodes.push(baseNode);
    }
    function centerParentNode(
      children: FamilyMember[],
      familyMember: FamilyMember
    ): Position {
      let x = 0,
        y = 0;
      const { position: firstChildPosition } = getFamilyMemberNode(children[0]);
      const { position: lastChildPosition } = getFamilyMemberNode(
        children[children.length - 1]
      );
      y = lastChildPosition.y - heightGap;
      const centerX =
        (lastChildPosition.x - firstChildPosition.x) / 2 + widthGap / 2;
      if (isFemale(familyMember)) {
        x = firstChildPosition.x + centerX;
        if (!hasMoreThanOneChild(familyMember)) {
          x += 2;
        }
      } else {
        x = lastChildPosition.x - centerX;
        if (!hasMoreThanOneChild(familyMember)) {
          x += 6;
        }
      }

      return { x, y };
    }
    function renderPartner(baseNode: Node, familyMember: FamilyMember) {
      baseNode.data.havePartner = true;
      let partnerPositionX = 0;
      if (isFemale(familyMember)) {
        partnerPositionX = baseNode.position.x - widthGap;
      } else {
        partnerPositionX = baseNode.position.x + widthGap;
      }
      const partnerNode = buildNode(
        {
          x: partnerPositionX,
          y: baseNode.position.y,
        },
        familyMember.partner.id,
        { familyMember },
        NodeType.RelationNode
      );
      const partnerEdge = buildEdge(
        familyMember.id,
        familyMember.partner.id,
        HandleNames.Relatives,
        HandleNames.Partner,
        EdgeType.RelationEdge,
        familyMember
      );
      return { partnerNode, partnerEdge };
    }
    function renderExPartner(baseNode: Node, familyMember: FamilyMember) {
      baseNode.data.haveExPartner = true;
      let exPartnerPositionX = 0;
      let edgeSource = familyMember.id;
      if (hasPartner(familyMember)) {
        edgeSource = familyMember.partner.id;
        if (isFemale(familyMember)) {
          exPartnerPositionX = baseNode.position.x - 2 * widthGap;
        } else {
          exPartnerPositionX = baseNode.position.x + 2 * widthGap;
        }
      } else {
        if (isFemale(familyMember)) {
          exPartnerPositionX = baseNode.position.x - widthGap;
        } else {
          exPartnerPositionX = baseNode.position.x + widthGap;
        }
      }
      if (hasMoreThanOneExChild(familyMember)) {
        const { exChildren } = familyMember;
        const { position: firstChildPosition } = getFamilyMemberNode(
          exChildren[0]
        );
        const { position: lastChildPosition } = getFamilyMemberNode(
          exChildren[exChildren.length - 1]
        );
        exPartnerPositionX =
          firstChildPosition.x +
          (lastChildPosition.x - firstChildPosition.x) / 2;
      } else {
        if (hasExChildren(familyMember)) {
          const { position } = getFamilyMemberNode(familyMember.exChildren[0]);
          if (isFemale(familyMember)) {
            exPartnerPositionX = position.x - widthGap / 2;
          } else {
            exPartnerPositionX = position.x + widthGap / 2;
          }
        }
      }

      const exPartnerNode = buildNode(
        {
          x: exPartnerPositionX,
          y: baseNode.position.y,
        },
        familyMember.exPartner.id,
        { familyMember },
        NodeType.RelationNode
      );
      const exPartnerEdge = buildEdge(
        edgeSource,
        familyMember.exPartner.id,
        HandleNames.Relatives,
        HandleNames.Partner,
        EdgeType.RelationEdge,
        familyMember,
        true
      );
      return { exPartnerNode, exPartnerEdge };
    }
    function buildNodeData(): NodeData {
      return {
        haveParents: false,
        havePartner: false,
        haveExPartner: false,
        familyMember: {} as FamilyMember,
      };
    }
    function buildNode(
      position: Position,
      id: string,
      data?: {},
      type = NodeType.ProfileNode
    ): Node {
      return {
        id,
        type: type,
        position,
        data: { ...buildNodeData(), ...data } as NodeData,
      };
    }
    function buildEdge(
      source: string,
      target: string,
      sourceHandle: HandleNames,
      targetHandle: HandleNames,
      type = EdgeType.CustomEdge,
      data?: Gender | FamilyMember,
      animated?: boolean
    ): Edge {
      return {
        id: `${source}-${target}`,
        type: type,
        data,
        source,
        target,
        targetHandle,
        sourceHandle,
        animated,
      };
    }
    function getFamilyMemberNode(familyMember: FamilyMember): Node {
      return nodes.find((node) => node.id === familyMember.id);
    }
    function setPositionWithSiblings(
      familyMember: FamilyMember,
      basePosition: Position
    ): number {
      if (hasSiblings(familyMember)) {
        return basePosition.x + 1.5 * widthGap;
      } else {
        return basePosition.x + 2 * widthGap;
      }
    }
    function getFirstChildPosition(familyMember: FamilyMember): Position {
      let x = 0,
        y = 0;
      const { hasPrevUncle, prevUncle } = getPreviousUncle(familyMember);
      if (hasPrevUncle) {
        const { position: prevUnclePosition } = getFamilyMemberNode(prevUncle);
        y = prevUnclePosition.y + heightGap;
        if (isHeadFamilyMember(prevUncle)) {
          if (hasMoreThanOneChild(prevUncle)) {
            const { children: cousins } = prevUncle;
            const prevCousin = cousins[cousins.length - 1];
            const { position: prevCousinPosition } =
              getFamilyMemberNode(prevCousin);

            x = setPositionWithSiblings(familyMember, prevCousinPosition);
            if (hasExPartner(prevUncle)) {
              x += widthGap;
            }
            if (hasExPartner(familyMember.parents[0])) {
              x += widthGap;
            }
            if (hasMoreThanOneExChild(familyMember.parents[0])) {
              x += widthGap * (familyMember.parents[0].exChildren.length - 1);
            }
          } else {
            if (isFemale(prevUncle)) {
              x = prevUnclePosition.x + 2 * widthGap;
            } else {
              x = prevUnclePosition.x + 3 * widthGap;
            }
            if (hasExPartner(prevUncle)) {
              x += widthGap;
            }
            if (hasExPartner(familyMember.parents[0])) {
              x += widthGap;
            }
            if (hasMoreThanOneExChild(familyMember.parents[0])) {
              x += widthGap * (familyMember.parents[0].exChildren.length - 1);
            }
          }
        } else {
          x = setPositionWithSiblings(familyMember, prevUnclePosition);
          if (isFemale(familyMember.parents[0])) {
            if (hasExPartner(familyMember.parents[0])) {
              if (hasSiblings(familyMember)) {
                x = prevUnclePosition.x + 2.5 * widthGap;
              } else {
                x = prevUnclePosition.x + 3 * widthGap;
              }

              if (hasExChildren(familyMember.parents[0])) {
                x += widthGap * familyMember.parents[0].exChildren.length;
              }
            }
          }
        }
      } else {
        x = 0;
        y = 0;
      }
      return { x, y };
    }
    function getChildPosition(familyMember: FamilyMember): Position {
      let x = 0,
        y = 0;
      const { hasPrevSibling, prevSibling } = getPreviousSibling(familyMember);
      if (hasPrevSibling) {
        const { position: prevSiblingPosition } =
          getFamilyMemberNode(prevSibling);
        y = prevSiblingPosition.y;
        if (isHeadFamilyMember(prevSibling)) {
          if (hasMoreThanOneExChild(prevSibling) && !isFemale(prevSibling)) {
            const { exChildren: exNephews } = prevSibling;
            const prevExNephew = exNephews[exNephews.length - 1];
            const { position: prevExCousinPosition } =
              getFamilyMemberNode(prevExNephew);
            x = prevExCousinPosition.x + 1.5 * widthGap;
          } else {
            if (hasExPartner(prevSibling)) {
              if (isFemale(prevSibling)) {
                x = prevSiblingPosition.x + 1.5 * widthGap;
              } else {
                x = prevSiblingPosition.x + 2.5 * widthGap;
                if (hasPartner(prevSibling)) {
                  x = prevSiblingPosition.x + 3.5 * widthGap;
                }
              }
            } else {
              if (hasMoreThanOneChild(prevSibling)) {
                const { children: nephews } = prevSibling;
                const prevNephew = nephews[nephews.length - 1];
                const { position: prevNephewPosition } =
                  getFamilyMemberNode(prevNephew);
                x = prevNephewPosition.x + 1.5 * widthGap;
              } else {
                if (isFemale(prevSibling)) {
                  x = prevSiblingPosition.x + 1.5 * widthGap;
                } else {
                  x = prevSiblingPosition.x + 2.5 * widthGap;
                  if (hasExPartner(prevSibling)) {
                    x = prevSiblingPosition.x + 3.5 * widthGap;
                  }
                }
              }
            }
          }
        } else {
          x = prevSiblingPosition.x + widthGap;
        }
      }
      return { x, y };
    }
    function getExChildPosition(familyMember: FamilyMember): Position {
      let x = 0,
        y = 0;
      const { hasPrevSibling, prevSibling } =
        getPreviousExSibling(familyMember);
      if (hasPrevSibling) {
        const { position: prevSiblingPosition } =
          getFamilyMemberNode(prevSibling);
        y = prevSiblingPosition.y;
        if (isHeadFamilyMember(prevSibling)) {
          if (hasMoreThanOneChild(prevSibling)) {
            const { children: nephews } = prevSibling;
            const prevNephew = nephews[nephews.length - 1];
            const { position: prevNephewPosition } =
              getFamilyMemberNode(prevNephew);
            x = prevNephewPosition.x - 1.5 * widthGap;
          } else {
            if (isFemale(prevSibling)) {
              x = prevSiblingPosition.x - 1.5 * widthGap;
            } else {
              x = prevSiblingPosition.x - 2.5 * widthGap;
            }
          }
        } else {
          const parent = familyMember.parents[0];
          if (isFemale(parent)) {
            x = prevSiblingPosition.x - widthGap;
          } else {
            x = prevSiblingPosition.x + widthGap;
          }
        }
      }

      return { x, y };
    }
    setCurrentNodes(nodes);
    setCurrentEdges(edges);
  }, [familyMember]);

  return [currentNodes, currentEdges];
}
