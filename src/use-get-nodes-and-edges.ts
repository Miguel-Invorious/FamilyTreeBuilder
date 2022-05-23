import { Node, Edge, Handle } from "react-flow-renderer";
import { FamilyMember, useFamilyMember } from "./use-family-member.ts";
import { useEffect, useState } from "react";
import { Position } from "./types/position";
import { NodeType } from "./types/node-type.ts";
import { EdgeType } from "./types/edge-type.ts";
import { NodeData } from "./types/node-data";
import { Gender } from "./types/gender.ts";
import { HandleNames } from "./types/handle-names.ts";
export const widthGap = 310;
export const heightGap = 380;

export function useGetNodesAndEdges() {
  const {
    familyMember,
    isFemale,
    isFirstChild,
    isFirstExChild,
    hasParents,
    hasSiblings,
    hasChildren,
    hasExChildren,
    hasMoreThanOneChild,
    getPreviousUncle,
    hasPartner,
    isHeadFamilyMember,
    getPreviousSibling,
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
            familyMember.gender
          );
          childrenEdges.push(edge);
        });
        edges.push(...childrenEdges);
      }
      if (hasExChildren(familyMember)) {
        let exChildrenEdges = [] as Edge[];
        familyMember.exChildren.forEach((exChild) => {
          console.log("Rendering ex child:", exChild.id);
          render(exChild);
          const edge = buildEdge(
            familyMember.id,
            exChild.id,
            HandleNames.Children,
            HandleNames.Parent,
            EdgeType.CustomEdge,
            familyMember.gender
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
        if (isFirstExChild(familyMember) && !hasSiblings(familyMember)) {
          
        }
        if (isFirstChild(familyMember)) {
          const { hasPrevUncle, prevUncle } = getPreviousUncle(familyMember);
          if (hasPrevUncle) {
            const { position: prevUnclePosition } =
              getFamilyMemberNode(prevUncle);
            baseNodeY = prevUnclePosition.y + heightGap;
            if (isHeadFamilyMember(prevUncle)) {
              if (hasMoreThanOneChild(prevUncle)) {
                const { children: cousins } = prevUncle;
                const prevCousin = cousins[cousins.length - 1];
                const { position: prevCousinPosition } =
                  getFamilyMemberNode(prevCousin);
                baseNodeY = prevCousinPosition.y;
                if (hasSiblings(familyMember)) {
                  baseNodeX = prevCousinPosition.x + 1.5 * widthGap;
                } else {
                  baseNodeX = prevCousinPosition.x + 2 * widthGap;
                }
              } else {
                if (isFemale(prevUncle)) {
                  baseNodeX = prevUnclePosition.x + 2 * widthGap;
                } else {
                  baseNodeX = prevUnclePosition.x + 3 * widthGap;
                }
              }
            } else {
              if (hasSiblings(familyMember)) {
                baseNodeX = prevUnclePosition.x + 1.5 * widthGap;
              } else {
                baseNodeX = prevUnclePosition.x + 2 * widthGap;
              }
            }
          } else {
            baseNodeX = 0;
            baseNodeY = 0;
          }
        } else {
          const { hasPrevSibling, prevSibling } =
            getPreviousSibling(familyMember);
          if (hasPrevSibling) {
            const { position: prevSiblingPosition } =
              getFamilyMemberNode(prevSibling);
            baseNodeY = prevSiblingPosition.y;
            if (isHeadFamilyMember(prevSibling)) {
              if (hasMoreThanOneChild(prevSibling)) {
                const { children: nephews } = prevSibling;
                const prevNephew = nephews[nephews.length - 1];
                const { position: prevNephewPosition } =
                  getFamilyMemberNode(prevNephew);
                baseNodeX = prevNephewPosition.x + 1.5 * widthGap;
              } else {
                if (isFemale(prevSibling)) {
                  baseNodeX = prevSiblingPosition.x + 1.5 * widthGap;
                } else {
                  baseNodeX = prevSiblingPosition.x + 2.5 * widthGap;
                }
              }
            } else {
              baseNodeX = prevSiblingPosition.x + widthGap;
            }
          }
        }
      } else {
        if (hasExChildren(familyMember) && !hasChildren(familyMember)) {
          const { exChildren } = familyMember;
          const { x, y } = centerParentNode(exChildren);
          baseNodeX = x;
          baseNodeY = y;
        }
        if (hasChildren(familyMember)) {
          const { children } = familyMember;
          const { x, y } = centerParentNode(children);
          baseNodeX = x;
          baseNodeY = y;
        } else {
          if (isFirstChild(familyMember)) {
            const { hasPrevUncle, prevUncle } = getPreviousUncle(familyMember);
            if (hasPrevUncle) {
              const { position: prevUnclePosition } =
                getFamilyMemberNode(prevUncle);
              baseNodeY = prevUnclePosition.y + heightGap;
              if (isHeadFamilyMember(prevUncle)) {
                console.log("with family");
                if (hasMoreThanOneChild(prevUncle)) {
                  console.log("with more than 1 child");
                  const { children: cousins } = prevUncle;
                  const prevCousin = cousins[cousins.length - 1];
                  const { position: prevCousinPosition } =
                    getFamilyMemberNode(prevCousin);
                  baseNodeY = prevCousinPosition.y;
                  if (hasSiblings(familyMember)) {
                    console.log("and i have sibling");
                    if (isFemale(familyMember)) {
                      baseNodeX = prevCousinPosition.x + 2.5 * widthGap;
                    } else {
                      baseNodeX = prevCousinPosition.x + 1.5 * widthGap;
                    }
                  } else {
                    console.log("and i dont have siblings");
                    baseNodeX = prevCousinPosition.x + 2 * widthGap;
                  }
                } else {
                  console.log("with less than 1 child");
                  if (isFemale(prevUncle)) {
                    console.log("is aunt");
                    if (hasSiblings(familyMember)) {
                      console.log("and i have sibling");
                      if (isFemale(familyMember)) {
                        baseNodeX = prevUnclePosition.x + 2.5 * widthGap;
                      } else {
                        baseNodeX = prevUnclePosition.x + 1.5 * widthGap;
                      }
                    } else {
                      console.log("and i dont have siblings");
                      baseNodeX = prevUnclePosition.x + 2 * widthGap;
                    }
                  } else {
                    console.log("is uncle");
                    if (hasSiblings(familyMember)) {
                      console.log("and i have sibling");
                      if (isFemale(familyMember)) {
                        baseNodeX = prevUnclePosition.x + 3.5 * widthGap;
                      } else {
                        baseNodeX = prevUnclePosition.x + 2.5 * widthGap;
                      }
                    } else {
                      console.log("and i dont have siblings");
                      baseNodeX = prevUnclePosition.x + 3 * widthGap;
                    }
                  }
                }
              } else {
                console.log("with no family");
                if (hasSiblings(familyMember)) {
                  console.log("and i have sibling");
                  if (isFemale(familyMember)) {
                    baseNodeX = prevUnclePosition.x + 2.5 * widthGap;
                  } else {
                    baseNodeX = prevUnclePosition.x + 1.5 * widthGap;
                  }
                } else {
                  console.log("and i dont have siblings");
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
              if (isHeadFamilyMember(prevSibling)) {
                if (hasMoreThanOneChild(prevSibling)) {
                  const { children: nephews } = prevSibling;
                  const prevNephew = nephews[nephews.length - 1];
                  const { position: prevNephewPosition } =
                    getFamilyMemberNode(prevNephew);
                  if (isFemale(familyMember)) {
                    baseNodeX = prevNephewPosition.x + 2.5 * widthGap;
                  } else {
                    baseNodeX = prevNephewPosition.x + 1.5 * widthGap;
                  }
                } else {
                  if (isFemale(prevSibling)) {
                    if (isFemale(familyMember)) {
                      baseNodeX = prevSiblingPosition.x + 2.5 * widthGap;
                    } else {
                      baseNodeX = prevSiblingPosition.x + 1.5 * widthGap;
                    }
                  } else {
                    if (isFemale(familyMember)) {
                      baseNodeX = prevSiblingPosition.x + 3.5 * widthGap;
                    } else {
                      baseNodeX = prevSiblingPosition.x + 2.5 * widthGap;
                    }
                  }
                }
              } else {
                if (isFemale(familyMember)) {
                  baseNodeX = prevSiblingPosition.x + 2.5 * widthGap;
                } else {
                  baseNodeX = prevSiblingPosition.x + 1.5 * widthGap;
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
    function centerParentNode(children: FamilyMember[]): Position {
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
      } else {
        x = lastChildPosition.x - centerX;
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
      if (isFemale(familyMember)) {
        if (hasPartner(familyMember)) {
          exPartnerPositionX = baseNode.position.x - 2 * widthGap;
          edgeSource = familyMember.partner.id;
        } else {
          exPartnerPositionX = baseNode.position.x - widthGap;
        }
      } else {
        if (hasPartner(familyMember)) {
          exPartnerPositionX = baseNode.position.x + 2 * widthGap;
          edgeSource = familyMember.partner.id;
        } else {
          exPartnerPositionX = baseNode.position.x + widthGap;
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

    setCurrentNodes(nodes);
    setCurrentEdges(edges);
  }, [familyMember]);

  return [currentNodes, currentEdges];
}
