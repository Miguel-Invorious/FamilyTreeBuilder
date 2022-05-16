import { Gender } from "./gender";
import { Position } from "./position";

export interface NodeData {
  parent: boolean;
  partner: boolean;
  expartner: boolean;
  children: number;
  exchildren: number;
  childNodes: Node[];
  exchildNodes: Node[];
  parentNode: Node[] | Node;
  gender: Gender;
  position: Position;
}
