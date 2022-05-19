import { Node, Edge, Handle } from "react-flow-renderer";
import { FamilyMember, useFamilyMember } from "./use-family-member.ts";
import { useEffect, useState } from "react";
import { Position } from "./types/position";
import { NodeType } from "./types/node-type.ts";
import { EdgeType } from "./types/edge-type.ts";
import { NodeData } from "./types/node-data";
import { Gender } from "./types/gender.ts";
import { HandleNames } from "./types/handle-names.ts";
import { useReactFlow } from "react-flow-renderer";
export const widthGap = 310;
export const heightGap = 380;

export function useGetNodesAndEdges() {
  const {
    familyMember,
    isFemale,
    isFirstChild,
    hasParents,
    hasSiblings,
    hasChildren,
    hasPartner,
  } = useFamilyMember();

  const [currentNodes, setCurrentNodes] = useState<Node[]>([]);
  const [currentEdges, setCurrentEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const nodes = [];
    const edges = [];
    const baseFamilyMember = getBaseParent();
    renderFamily(baseFamilyMember);

    function renderFamily(headFamilyMember: FamilyMember) {
      console.log("Position myself", headFamilyMember.id, "nodes:", nodes);
      // Render children
      let childrenEdges = [] as Edge[];
      if (headFamilyMember.children.length) {
        headFamilyMember.children.forEach((child: FamilyMember) => {
          renderFamily(child);
          const edge = buildEdge(
            headFamilyMember.id,
            child.id,
            HandleNames.Children,
            HandleNames.Parent
          );
          childrenEdges.push(edge);
        });
        edges.push(...childrenEdges);
      }

      // Render family member

      let baseNodeX = 0;
      let baseNodeY = 0;

      if (hasSiblings(headFamilyMember)) {
        const previousSibling = getPreviousSibling(headFamilyMember);
        if (isFirstChild(headFamilyMember)) {
          if (hasParents(headFamilyMember) && nodes.length > 0) {
            const prevUncle = nodes[nodes.length - 1];
            baseNodeY = prevUncle.position.y + heightGap;
            console.log(
              nodes,
              "Im first child whit no prev sibling and i have an uncle"
            );
            baseNodeX = prevUncle.position.x + 2 * widthGap;
          }
        } else {
          if (previousSibling) {
            const { position: prevSiblingPosition } =
              getPreviousSiblingNode(headFamilyMember);
            baseNodeY = prevSiblingPosition.y;
            console.log("my previous sibling");
            if (isHeadFamilyMember(previousSibling)) {
              console.log("has a family with");
              if (hasPartner(previousSibling)) {
                console.log("partner");
                if (isFemale(previousSibling)) {
                  baseNodeX = setPositionWithSiblings(
                    prevSiblingPosition.x,
                    headFamilyMember,
                    1.5,
                    2.5
                  );
                } else {
                  baseNodeX = setPositionWithSiblings(
                    prevSiblingPosition.x,
                    headFamilyMember,
                    2.5,
                    3.5
                  );
                }
              }
              if (previousSibling.children.length > 1) {
                console.log("children", prevSiblingPosition);
                const { children } = previousSibling;
                const lastChildId = children[children.length - 1].id;
                const lastChildPosition = nodes.find(
                  (node) => node.id === lastChildId
                ).position;
                baseNodeX = lastChildPosition.x + widthGap;
              }
            } else {
              console.log("has no family");
              baseNodeX = setPositionWithSiblings(
                prevSiblingPosition.x,
                headFamilyMember,
                1,
                2.5
              );
            }
          }
        }
      } else {
        console.log("i have no siblings");
        if (hasParents(headFamilyMember)) {
          if (nodes.length) {
            const parentId = headFamilyMember.parents[0].id;
            const parentIndex = headFamilyMember.parents[0].parents[0].children
              .map((child) => child.id)
              .indexOf(parentId);
            const prevUncleId =
              headFamilyMember.parents[0].siblings[parentIndex - 1].id;
            console.log(prevUncleId, nodes);
            const prevUncle = nodes.find((node) => node.id === prevUncleId);
            baseNodeY = prevUncle.position.y + heightGap;
            baseNodeX = prevUncle.position.x + 2 * widthGap;
          }
        }
      }
      //TODO: CHANGE GENDER OF DEFAULTEDGE WHEN GENDER IS CHANGED
      if (isHeadFamilyMember(headFamilyMember)) {
        console.log("i have a family", headFamilyMember.id);
        //Center if has childs
        if (hasChildren(headFamilyMember)) {
          const { children } = headFamilyMember;
          const firstChildId = children[0].id;
          const firstChildPosition = nodes.find(
            (node) => node.id === firstChildId
          ).position;
          const lastChildId = children[children.length - 1].id;
          const lastChildPosition = nodes.find(
            (node) => node.id === lastChildId
          ).position;
          const centerX =
            (lastChildPosition.x - firstChildPosition.x) / 2 + widthGap / 2;
          console.log(firstChildPosition, lastChildPosition, centerX);
          if (isFemale(headFamilyMember)) {
            baseNodeX = firstChildPosition.x + centerX;
          } else {
            baseNodeX = lastChildPosition.x - centerX;
          }
          baseNodeY = lastChildPosition.y - heightGap;
        } else {
          if (hasPartner(headFamilyMember)) {
            console.log("i have partner");
            if (hasParents(headFamilyMember)) {
              if (isFirstChild(headFamilyMember)) {
                console.log("im first child with a family and have parents");
              }
            }
            if (hasSiblings(headFamilyMember)) {
              const previousSibling = getPreviousSibling(headFamilyMember);
              if (previousSibling === undefined) {
                console.log("i have no previuous sibling and a family");
              } else {
                console.log("i have prev sibling:", previousSibling);
                const { position } = getPreviousSiblingNode(headFamilyMember);
                baseNodeX = position.x + 2.5 * widthGap;
              }
            }
          }
        }
      }
      const baseNode = buildNode(
        { x: baseNodeX, y: baseNodeY },
        headFamilyMember.id,
        { familyMember: headFamilyMember }
      );

      nodes.push(baseNode);

      // Render partner
      if (headFamilyMember.partner) {
        baseNode.data.havePartner = true;
        let partnerPositionX = 0;
        if (isFemale(headFamilyMember)) {
          partnerPositionX = baseNode.position.x - widthGap;
        } else {
          partnerPositionX = baseNode.position.x + widthGap;
        }
        const partnerNode = buildNode(
          {
            x: partnerPositionX,
            y: baseNode.position.y,
          },
          headFamilyMember.partner.id,
          {},
          NodeType.RelationNode
        );
        const partnerEdge = buildEdge(
          headFamilyMember.id,
          headFamilyMember.partner.id,
          HandleNames.Relatives,
          HandleNames.Partner,
          EdgeType.RelationEdge,
          headFamilyMember
        );
        nodes.push(partnerNode);
        edges.push(partnerEdge);
      }
      console.log(
        "My final position is",
        headFamilyMember.id,
        baseNodeX,
        baseNodeY
      );
    }

    function isHeadFamilyMember(familyMember: FamilyMember) {
      if (familyMember.partner) {
        return true;
      }

      if (familyMember.children.length) {
        return true;
      }
    }
    function isFemaleAndHasPartner(familyMember: FamilyMember) {
      return hasPartner(familyMember) && isFemale(familyMember);
    }

    function setPositionWithSiblings(
      siblingPosition: number,
      familyMember: FamilyMember,
      defaultMultiplier: number,
      conditionalMultiplier: number
    ) {
      let x = siblingPosition + defaultMultiplier * widthGap;

      if (isFemaleAndHasPartner(familyMember)) {
        x = siblingPosition + conditionalMultiplier * widthGap;
      }
      return x;
    }

    function getBaseParent() {
      let currentFamilyMember = familyMember;
      while (hasParents(currentFamilyMember)) {
        currentFamilyMember = familyMember.parents[0];
      }

      return currentFamilyMember;
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
      data?: Gender | FamilyMember
    ): Edge {
      return {
        id: `${source}-${target}`,
        type: type,
        data,
        source,
        target,
        targetHandle,
        sourceHandle,
      };
    }

    function getPreviousSiblingNode(familyMember: FamilyMember): Node {
      const { children } = familyMember.parents[0];

      const previousSiblingIndex =
        children.map((child) => child.id).indexOf(familyMember.id) - 1;
      const previousSiblingId = children[previousSiblingIndex].id;
      return nodes.find((node) => node.id === previousSiblingId);
    }

    function getPreviousSibling(familyMember: FamilyMember): FamilyMember {
      const { children } = familyMember.parents[0];
      const previousSiblingIndex =
        children.map((child) => child.id).indexOf(familyMember.id) - 1;
      return children[previousSiblingIndex];
    }
    setCurrentNodes(nodes);
    setCurrentEdges(edges);
  }, [familyMember]);

  return [currentNodes, currentEdges];
}
