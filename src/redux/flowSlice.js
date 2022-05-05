import { createSlice } from "@reduxjs/toolkit";

const initialNode = [
  {
    id: "0",
    type: "profileNode",
    position: { x: 0, y: 0 },
    data: {
      parents: false,
      partner: false,
      expartners: 0,
      children: 0,
      female: true,
      position: { x: 0, y: 0 },
    },
  },
];
const initialEdge = [];
export const flowSlice = createSlice({
  name: "flow",
  initialState: {
    nodes: initialNode,
    edges: initialEdge,
  },
  reducers: {
    addNode: (state, action) => ({
      ...state,
      nodes: [...state.nodes, ...action.payload],
    }),
    addEdge: (state, action) => ({
      ...state,
      edges: [...state.edges, ...action.payload],
    }),
    updateFlow: (state, action) => ({
      ...state,
      edges: [...state.edges, ...action.payload.edges],
      nodes: [...state.nodes, ...action.payload.nodes],
    }),
  },
});

export const { addNode, addEdge, updateFlow } = flowSlice.actions;
export default flowSlice.reducer;
