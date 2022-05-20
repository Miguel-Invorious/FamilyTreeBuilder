import { atom, useAtom } from "jotai";
import { Gender } from "./types/gender.ts";

export interface FamilyMember {
  parents: [FamilyMember | null, FamilyMember | null];
  partner: FamilyMember | null;
  exPartner: FamilyMember | null;
  children: FamilyMember[];
  siblings: FamilyMember[];
  exChildren: FamilyMember[];
  gender: Gender;
  id: string;
}

const baseFamilyMember = createFamilyMember(0);
let memberId = 1;
export const baseFamilyMemberAtom = atom(baseFamilyMember);
export function useFamilyMember() {
  const [familyMember, setFamilyMember] = useAtom(baseFamilyMemberAtom);

  function addParents(familyMember: FamilyMember) {
    const parentA = createFamilyMember(memberId);
    const parentB = createFamilyMember(memberId, true, `${memberId}-partner`);
    parentA.partner = parentB;
    parentB.partner = parentA;
    setGender(parentA, parentB);
    setParents(parentA, parentB);
    memberId++;
    refresh();
  }

  function addSibling(familyMember: FamilyMember) {
    if (!hasParents(familyMember)) {
      addParents(familyMember);
    }
    const sibling = createFamilyMember(memberId);
    memberId++;
    setSibling(familyMember, sibling);
    refresh();
  }

  function addChild(familyMember: FamilyMember) {
    const newChild = createFamilyMember(memberId);
    newChild.parents = [familyMember, familyMember.partner];
    if (familyMember.children) {
      newChild.siblings = [...familyMember.children];
      familyMember.children.forEach((child) => child.siblings.push(newChild));
    }
    memberId++;
    familyMember.children.push(newChild);
    refresh();
  }
  function addExChild(familyMember: FamilyMember) {
    const newExChild = createFamilyMember(memberId);
    newExChild.parents = [familyMember, familyMember.exPartner];
    if (familyMember.exChildren) {
      newExChild.siblings = [...familyMember.exChildren];
      familyMember.exChildren.forEach((exChild) =>
        exChild.siblings.push(newExChild)
      );
    }
    memberId++;
    familyMember.exChildren.push(newExChild);
    refresh();
  }
  function addPartner(familyMember: FamilyMember) {
    const partner = createFamilyMember(
      memberId,
      true,
      `${familyMember.id}-partner`
    );
    familyMember.partner = partner;
    partner.partner = familyMember;
    if (hasParents(familyMember)) {
      addChildPartnerToParents(familyMember, partner);
    }
    refresh();
  }
  function addExPartner(familyMember: FamilyMember) {
    const exPartner = createFamilyMember(
      memberId,
      true,
      `${familyMember.id}-expartner`
    );
    familyMember.exPartner = exPartner;
    exPartner.partner = familyMember;
    if (hasParents(familyMember)) {
      addChildExPartnerToParents(familyMember, exPartner);
    }
    refresh();
  }
  function deleteMember(familyMember: FamilyMember) {
    console.log("Deleting:", familyMember);
    if (hasParents(familyMember)) {
      console.log("Deleting from my parents");
      familyMember.parents.forEach(
        (parent) =>
          (parent.children = parent.children.filter(
            (child) => child.id !== familyMember.id
          ))
      );
      console.log(familyMember.parents);
    }
    if (hasSiblings(familyMember)) {
      console.log("Deleting from my siblings");
      familyMember.siblings.forEach(
        (sibling) =>
          (sibling.siblings = sibling.siblings.filter(
            (sibling) => sibling.id !== familyMember.id
          ))
      );
    }
    refresh();
  }

  function hasParents(familyMember: FamilyMember) {
    return familyMember.parents.every((parent) => parent !== null);
  }

  function hasSiblings(familyMember: FamilyMember) {
    return familyMember.siblings.length > 0;
  }

  function hasChildren(familyMember: FamilyMember) {
    return familyMember.children.length > 0;
  }
  function hasMoreThanOneChild(familyMember: FamilyMember) {
    return familyMember.children.length > 1;
  }
  function hasPartner(familyMember: FamilyMember) {
    return familyMember.partner != null;
  }
  function hasExPartner(familyMember: FamilyMember) {
    return familyMember.exPartner != null;
  }
  function getPreviousUncle(familyMember: FamilyMember): {
    hasPrevUncle: boolean;
    prevUncle: FamilyMember;
  } {
    const parent = familyMember.parents[0];
    if (!hasParents(parent)) {
      return { hasPrevUncle: false, prevUncle: {} as FamilyMember };
    }
    const grandPa = parent.parents[0];
    const { children: uncles } = grandPa;
    const indexOfParent = uncles.map((uncle) => uncle.id).indexOf(parent.id);
    const previousUncleIndex = indexOfParent - 1;
    return {
      hasPrevUncle: previousUncleIndex >= 0,
      prevUncle: uncles[previousUncleIndex],
    };
  }

  function setParents(father: FamilyMember, mother: FamilyMember) {
    father.children.push(familyMember);
    mother.children.push(familyMember);
    familyMember.parents = [father, mother];
  }

  function addChildPartnerToParents(
    familyMember: FamilyMember,
    partner: FamilyMember
  ) {
    familyMember.parents.forEach(
      (parent: FamilyMember) =>
        (parent.children = parent.children.map((child) =>
          child.id === familyMember.id ? { ...child, partner: partner } : child
        ))
    );
  }
  function addChildExPartnerToParents(
    familyMember: FamilyMember,
    exPartner: FamilyMember
  ) {
    familyMember.parents.forEach(
      (parent: FamilyMember) =>
        (parent.children = parent.children.map((child) =>
          child.id === familyMember.id
            ? { ...child, exPartner: exPartner }
            : child
        ))
    );
  }
  // Tiene un bug
  function setSibling(familyMember: FamilyMember, sibling: FamilyMember) {
    sibling.parents = familyMember.parents;
    sibling.parents.forEach((parent) => parent.children.push(sibling));
    familyMember.siblings.push(sibling);
    sibling.siblings.push(familyMember);
  }

  function isFemale(familyMember: FamilyMember) {
    return familyMember.gender === Gender.Female;
  }

  function isFirstChild(familyMember: FamilyMember) {
    if (!hasParents(familyMember)) {
      return false;
    }
    return familyMember.id === familyMember.parents[0].children[0].id;
  }

  function setGender(familyMember: FamilyMember, partner: FamilyMember) {
    const partnerGender =
      familyMember.gender === Gender.Female ? Gender.Male : Gender.Female;
    partner.gender = partnerGender;
    refresh();
  }

  function changeGender(familyMember: FamilyMember, gender: Gender) {
    familyMember.gender = gender;
    if (hasParents(familyMember)) {
      familyMember.parents.forEach(
        (parent) =>
          (parent.children = parent.children.map((child) =>
            child.id === familyMember.id ? { ...child, gender } : child
          ))
      );
    }
    refresh();
  }

  function isHeadFamilyMember(familyMember: FamilyMember) {
    if (hasPartner(familyMember)) {
      return true;
    }
    if (hasChildren(familyMember)) {
      return true;
    }
  }
  function isFemaleAndHasPartner(familyMember: FamilyMember) {
    return hasPartner(familyMember) && isFemale(familyMember);
  }
  function getPreviousSibling(familyMember: FamilyMember): {
    hasPrevSibling: boolean;
    prevSibling: FamilyMember;
  } {
    if (hasParents(familyMember)) {
      const { children } = familyMember.parents[0];
      const previousSiblingIndex =
        children.map((child) => child.id).indexOf(familyMember.id) - 1;
      if (previousSiblingIndex >= 0) {
        return {
          hasPrevSibling: true,
          prevSibling: children[previousSiblingIndex],
        };
      }
    }
    return { hasPrevSibling: false, prevSibling: {} as FamilyMember };
  }
  function getBaseParent() {
    let currentFamilyMember = familyMember;
    while (hasParents(currentFamilyMember)) {
      currentFamilyMember = familyMember.parents[0];
    }

    return currentFamilyMember;
  }
  function refresh() {
    setFamilyMember({ ...familyMember });
  }

  return {
    familyMember,
    addParents,
    addSibling,
    addPartner,
    addExPartner,
    addChild,
    addExChild,
    hasParents,
    hasSiblings,
    hasChildren,
    getPreviousUncle,
    hasMoreThanOneChild,
    hasPartner,
    hasExPartner,
    isFemale,
    isFirstChild,
    setGender,
    changeGender,
    isHeadFamilyMember,
    isFemaleAndHasPartner,
    getPreviousSibling,
    getBaseParent,
    deleteMember,
  };
}

function createFamilyMember(
  id: number,
  partner = false,
  partnerId?: string
): FamilyMember {
  return {
    parents: [null, null],
    partner: null,
    exPartner: null,
    children: [],
    exChildren: [],
    siblings: [],
    gender: Gender.Female,
    id: !partner ? id.toString() : partnerId,
  };
}
