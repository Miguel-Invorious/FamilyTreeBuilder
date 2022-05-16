import { Node, Edge } from "react-flow-renderer";
import { FamilyMember, useFamilyMember } from "./utils2.ts";
import { useEffect, useState } from "react";
import { Position } from "./types/position";

export const widthGap = 310;
export const heightGap = 380;

export function useGetNodesAndEdges() {
  const { familyMember, hasParents } = useFamilyMember();

  const [currentNodes, setCurrentNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    let nodeId = 0;
    const nodes = [];
    const baseFamilyMember = getBaseParent();

    renderFamily(baseFamilyMember);

    function renderFamily(headFamilyMember: FamilyMember) {
      // Render children
      let childrenNodes = [] as Node[];
      if (headFamilyMember.children.length) {
        let firstChildX = 0;
        let firstChildY = 0;

        headFamilyMember.children.forEach((child) => {
          if (isHeadFamilyMember(child)) {
            renderFamily(child);
          }

          const node = buildNode({ x: firstChildX, y: firstChildY });
          firstChildX += widthGap;
          childrenNodes.push(node);
        });
        nodes.push(...childrenNodes);
      }

      // Render family member
      let baseNodeX = 0;
      let baseNodeY = 0;

      if (childrenNodes.length) {
        const firstChildX = childrenNodes[0].position.x;
        const lastChildX = childrenNodes[childrenNodes.length - 1].position.x;
        baseNodeX = (firstChildX + lastChildX) / 2 - widthGap / 2;
        baseNodeY = childrenNodes[0].position.y - heightGap;
      }

      const baseNode = buildNode({ x: baseNodeX, y: baseNodeY });

      nodes.push(baseNode);

      // Render partner
      if (headFamilyMember.partner) {
        const partnerNode = buildNode({
          x: baseNode.position.x + widthGap,
          y: baseNode.position.y,
        });
        nodes.push(partnerNode);
      }
    }

    function isHeadFamilyMember(familyMember: FamilyMember) {
      console.log(familyMember);
      if (familyMember.partner) {
        return true;
      }

      if (familyMember.children.length) {
        return true;
      }
    }

    function getBaseParent() {
      let currentFamilyMember = familyMember;
      while (hasParents(currentFamilyMember)) {
        currentFamilyMember = familyMember.parents[0];
      }

      return currentFamilyMember;
    }

    function buildNode(position: Position): Node {
      nodeId++;

      return {
        id: nodeId.toString(),
        type: "profileNode",
        position,
        data: {},
      };
    }

    setCurrentNodes(nodes);
    setEdges(edges);
  }, [familyMember]);

  return [currentNodes, edges];
}
