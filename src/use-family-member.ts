import { faM } from "@fortawesome/free-solid-svg-icons";
import { atom, useAtom } from "jotai";
import { Gender } from "./types/gender.ts";

export interface FamilyMember {
  parents: [FamilyMember | null, FamilyMember | null];
  partner: FamilyMember | null;
  children: FamilyMember[];
  siblings: FamilyMember[];
  gender: Gender;
  id: string;
}

const baseFamilyMember = createFamilyMember(0);
let memberId = 1;
export const baseFamilyMemberAtom = atom(baseFamilyMember);
export function useFamilyMember() {
  const [familyMember, setFamilyMember] = useAtom(baseFamilyMemberAtom);

  function addParents() {
    const parentA = createFamilyMember(memberId);
    const parentB = createFamilyMember(memberId, true, `${memberId}-partner`);
    parentA.partner = parentB;
    parentB.partner = parentA;
    setGender(parentA, parentB);
    setParents(parentA, parentB);
    memberId++;
    refresh();
  }

  function addSibling() {
    if (!hasParents(familyMember)) {
      addParents();
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

  function hasParents(familyMember: FamilyMember) {
    return familyMember.parents.every((parent) => parent !== null);
  }

  function hasSiblings(familyMember: FamilyMember) {
    return familyMember.siblings.length > 0;
  }

  function hasChildren(familyMember: FamilyMember) {
    return familyMember.children.length > 0;
  }

  function hasPartner(familyMember: FamilyMember) {
    return familyMember.partner != null;
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
    return familyMember === familyMember.parents[0].children[0];
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

  function refresh() {
    setFamilyMember({ ...familyMember });
  }

  return {
    familyMember,
    addParents,
    addSibling,
    addPartner,
    addChild,
    hasParents,
    hasSiblings,
    hasChildren,
    hasPartner,
    isFemale,
    isFirstChild,
    setGender,
    changeGender,
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
    children: [],
    siblings: [],
    gender: Gender.Female,
    id: !partner ? id.toString() : partnerId,
  };
}
