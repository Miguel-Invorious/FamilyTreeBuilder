import { NodeType } from "./node-type";
import { NodeData } from "./node-data";
import { Position } from "./position";

export interface Node {
  id: string;
  type: NodeType;
  data: NodeData;
  position: Position;
}
