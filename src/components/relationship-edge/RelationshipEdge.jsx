import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getEdgeCenter, getSmoothStepPath } from "react-flow-renderer";
import {
  addChild,
  buttonDimension,
  nodesAtom,
  edgesAtom,
  parentAtom,
  nodeCountAtom,
  widthOffset,
  reorder
} from "../../utils";
import { useAtom } from "jotai";
import "./RelationshipEdge.scss";

const RelationshipEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
}) => {
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX: targetX + widthOffset,
    targetY,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [nodeCount, setNodeCount] = useAtom(nodeCountAtom);
  const [papuest]=useAtom(parentAtom)
  const handleClick = () => {
    const me = nodes.find((node) => node.id === id.replace(/\D/g, ""));
    const [newNodes, newEdges] = addChild(id, me, nodeCount);
    id.replace(/^[a-z]-\d-/, "") === "partner"
      ? setNodes([
          ...nodes
            .map((node) =>
              node.id === id.replace(/\D/g, "")
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
                return node.data.parentNode.id === id.replace(/\D/g, "")
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
        ])
      : setNodes([
          ...nodes
            .map((node) =>
              node.id === id.replace(/\D/g, "")
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      exchildren: node.data.exchildren + 1,
                      exchildNodes: [...node.data.exchildNodes, ...newNodes],
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
    setEdges([...edges, ...newEdges]);
    setNodeCount(nodeCount + 1);
  };
  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={buttonDimension}
        height={buttonDimension}
        x={edgeCenterX - buttonDimension / 2}
        y={edgeCenterY - buttonDimension / 2}
        className="edge-button"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="button" onClick={handleClick}>
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </foreignObject>
    </>
  );
};
export default RelationshipEdge;
