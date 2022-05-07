import { createSlice } from "@reduxjs/toolkit";
const initialNode = [
  {
    id: "0",
    type: "profileNode",
    position: { x: 0, y: 0 },
    data: {
      parents: false,
      parentId: [],
      partner: false,
      expartner: false,
      children: 0,
      exchildren: 0,
      childrenId: [],
      exchildrenId: [],
      gender: "female",
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
    mainNodesCount: 1,
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
    deleteNode: (state, action) => ({
      ...state,
      mainNodesCount: state.mainNodesCount - 1,
      nodes: [
        ...state.nodes.filter((node) => !node.id.includes(action.payload)),
      ],
      edges: [
        ...state.edges.filter((edge) => !edge.id.includes(action.payload)),
      ],
    }),
    addChildrenById: (state, action) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === action.payload.parentId
          ? {
              ...node,
              data: {
                ...node.data,
                children: node.data.children + 1,
                childrenId: [
                  ...node.data.childrenId,
                  ...action.payload.childId,
                ],
              },
            }
          : node
      ),
    }),
    addExChildrenById: (state, action) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === action.payload.parentId
          ? {
              ...node,
              data: {
                ...node.data,
                exchildren: node.data.exchildren + 1,
                exchildrenId: [
                  ...node.data.exchildrenId,
                  ...action.payload.nodes,
                ],
              },
            }
          : node
      ),
    }),
    addPartner: (state, action) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === action.payload.id
          ? {
              ...node,
              data: {
                ...node.data,
                partner: true,
              },
            }
          : node
      ),
    }),
    addExPartner: (state, action) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === action.payload.id
          ? {
              ...node,
              data: {
                ...node.data,
                expartner: true,
              },
            }
          : node
      ),
    }),
    addParentById: (state, action) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === action.payload.id
          ? {
              ...node,
              data: {
                ...node.data,
                parents: true,
                parentId: action.payload.parentId,
              },
            }
          : node
      ),
    }),
    decrementChildrenById: (state, action) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === action.payload
          ? {
              ...node,
              data: { ...node.data, children: node.data.children - 1 },
            }
          : node
      ),
    }),
    addMainNode: (state) => ({
      ...state,
      mainNodesCount: state.mainNodesCount + 1,
    }),
    addValueToMainNode: (state, action) => ({
      ...state,
      mainNodesCount: state.mainNodesCount + action.payload,
    }),
    removeMainNode: (state) => ({
      ...state,
      mainNodesCount: state.mainNodesCount - 1,
    }),
    repositionParent: (state, action) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === action.payload.id
          ? {
              ...node,
              position: action.payload.position,
              data: {
                ...node.data,
                position: action.payload.position,
              },
            }
          : node
      ),
    }),
    setGender: (state, action) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === action.payload.id
          ? {
              ...node,
              data: {
                ...node.data,
                gender: action.payload.gender,
              },
            }
          : node
      ),
    }),
  },
});

export const {
  addNode,
  addEdge,
  updateFlow,
  addChildrenById,
  addExChildrenById,
  addParentById,
  decrementChildrenById,
  addMainNode,
  addPartner,
  addExPartner,
  removeMainNode,
  addValueToMainNode,
  repositionParent,
  setGender,
  deleteNode,
} = flowSlice.actions;
export default flowSlice.reducer;
