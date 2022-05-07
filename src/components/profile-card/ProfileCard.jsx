import React, { useState } from "react";
import ProfileInformation from "../profile-information/ProfileInformation";
import ProfileButtons from "../profile-buttons/ProfileButtons";
import {
  addParent,
  addPartner_,
  addSibling,
  addEx,
  addParentsAndSiblings,
  useDeleteNode,
} from "../../utils";
import "./ProfileCard.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFlow,
  addValueToMainNode,
  addPartner,
  addExPartner,
  addMainNode,
  addParentById,
  addChildrenById,
  deleteNode,
} from "../../redux/flowSlice";

const ProfileCard = ({ id, data }) => {
  const dispatch = useDispatch();
  const [viewButtons, toggleButtons] = useState(false);
  const [viewAddMenu, toggleAddMenu] = useState(false);
  const [handles, setHandles] = useState(data);
  const mainNodes = useSelector((state) => state.flow.mainNodesCount);
  const me = useSelector(
    (state) => state.flow.nodes.filter((node) => node.id === id)[0]
  );
  const handleAddSibling = () => {
    if (!handles.parents) {
      const { nodes, edges } = addParentsAndSiblings(
        id,
        data.position,
        mainNodes,
        me
      );
      dispatch(updateFlow({ nodes, edges }));
      dispatch(addValueToMainNode(2));
      dispatch(addParentById({ id, parentId: nodes[0] }));
      setHandles({ ...handles, parents: true });
    } else {
      const { nodes, edges } = addSibling(mainNodes, me.data.parentId);
      dispatch(updateFlow({ nodes, edges }));
      dispatch(addMainNode());
      dispatch(
        addChildrenById({ parentId: me.data.parentId.id, childId: nodes })
      );
    }
  };
  const handleDeleteNode = () => dispatch(deleteNode(id));
  const handleAddParent = () => {
    const { nodes, edges } = addParent(id, data.position, mainNodes, me);
    setHandles({ ...handles, parents: true });
    dispatch(updateFlow({ nodes, edges }));
    dispatch(addParentById({ id, parentId: nodes[0] }));
    dispatch(addMainNode());
  };
  const handleAddPartner = () => {
    setHandles({ ...handles, partner: true });
    dispatch(addPartner({ id }));
    dispatch(updateFlow(addPartner_(id, data.position, data.gender)));
  };
  const handleAddExPartner = () => {
    setHandles({ ...handles, expartner: true });
    dispatch(updateFlow(addEx(id, data.position, data.gender, data.partner)));
    dispatch(addExPartner({ id }));
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
        hasParents={handles.parents}
        hasPartner={handles.partner}
        hasExPartner={handles.expartner}
        isSibling={handles.isSibling}
        viewButtons={viewButtons}
        viewAddMenu={viewAddMenu}
      />
    </div>
  );
};

export default ProfileCard;
