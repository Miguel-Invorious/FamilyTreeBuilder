import { atom, useAtom } from "jotai";

export interface FamilyMember {
  parents: [FamilyMember | null, FamilyMember | null];
  partner: FamilyMember | null;
  children: FamilyMember[];
  siblings: FamilyMember[];
}

const baseFamilyMember = createFamilyMender();

export const baseFamilyMemberAtom = atom(baseFamilyMember);

export function useFamilyMember() {
  const [familyMember, setFamilyMember] = useAtom(baseFamilyMemberAtom);

  function addParents() {
    const parentA = createFamilyMender();
    const parentB = createFamilyMender();
    parentA.partner = parentB;
    parentB.partner = parentA;
    setParents(parentA, parentB);
    refresh();
  }

  function addSibling() {
    if (!hasParents(familyMember)) {
      addParents();
    }
    const sibling = createFamilyMender();
    setSibling(familyMember, sibling);
    refresh();
  }

  function addPartner() {
    const partner = createFamilyMender();
    familyMember.partner = partner;
    partner.partner = familyMember;
    refresh();
  }

  function hasParents(familyMember: FamilyMember) {
    return familyMember.parents.every((parent) => parent !== null);
  }

  function setParents(father: FamilyMember, mother: FamilyMember) {
    father.children.push(familyMember);
    mother.children.push(familyMember);
    familyMember.parents = [father, mother];
  }

  // Tiene un bug
  function setSibling(familyMember: FamilyMember, sibling: FamilyMember) {
    sibling.parents = familyMember.parents;
    sibling.parents.forEach((parent) => parent.children.push(sibling));
    familyMember.siblings.push(sibling);
    sibling.siblings.push(familyMember);
  }

  function refresh() {
    setFamilyMember({ ...familyMember });
  }

  return { familyMember, addParents, addSibling, addPartner, hasParents };
}

function createFamilyMender(): FamilyMember {
  return {
    parents: [null, null],
    partner: null,
    children: [],
    siblings: [],
  };
}
