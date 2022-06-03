import { atom, useAtom } from "jotai";
import { Gender } from "./types/gender.ts";
import { Relations } from "./types/relations.enum.ts";

export interface ExFamily {
  partner: FamilyMember;
  children: FamilyMember[];
}
export interface FamilyMember {
  parents: [FamilyMember | null, FamilyMember | null];
  partner: FamilyMember | null;
  children: FamilyMember[];
  siblings: FamilyMember[];
  exFamilies: ExFamily[];
  gender: Gender;
  age: number;
  id: string;
}

const baseFamilyMember = createFamilyMember(0);
let memberId = 1;
export const baseFamilyMemberAtom = atom(baseFamilyMember);
export function useFamilyMember() {
  const [familyMember, setFamilyMember] = useAtom(baseFamilyMemberAtom);
  function addParents(familyMember: FamilyMember) {
    const parentA = createFamilyMember(memberId);
    const parentB = createFamilyMember(memberId, true, `${parentA.id}-partner`);
    parentA.partner = parentB;
    parentB.partner = parentA;
    setGender(parentA, parentB);
    familyMember.parents = [parentA, parentB];
    parentA.children.push(familyMember);
    memberId += 2;
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
    if (hasChildren(familyMember)) {
      newChild.siblings = [...newChild.siblings, ...familyMember.children];
      familyMember.children.forEach((child) => child.siblings.push(newChild));
    }
    if (hasExChildren(familyMember)) {
      let children = [] as FamilyMember[];
      familyMember.exFamilies.forEach((exFamily) =>
        children.push(...exFamily.children)
      );
      newChild.siblings = [...newChild.siblings, ...children];
      familyMember.exFamilies.forEach((exFamily) =>
        exFamily.children.forEach((children) =>
          children.siblings.push(newChild)
        )
      );
    }
    familyMember.children.push(newChild);
    memberId++;
    refresh();
  }
  function addExChild(familyMember: FamilyMember, mother: number) {
    const newExChild = createFamilyMember(memberId);
    const { children, exFamilies } = familyMember;
    console.log(mother);
    newExChild.parents = [familyMember, exFamilies[mother].partner];
    if (hasChildren(familyMember)) {
      newExChild.siblings = [...newExChild.siblings, ...children];
      children.forEach((child) => child.siblings.push(newExChild));
    }
    if (hasExChildren(familyMember)) {
      let siblings = [] as FamilyMember[];
      exFamilies.forEach((exFamily) => siblings.push(...exFamily.children));
      newExChild.siblings = [...newExChild.siblings, ...siblings];
      exFamilies.forEach((exFamily) =>
        exFamily.children.forEach((children) =>
          children.siblings.push(newExChild)
        )
      );
    }
    exFamilies[mother].children.push(newExChild);
    familyMember.exFamilies = exFamilies.map((exFamily, index) => ({
      ...exFamily,
      partner: {
        ...exFamily.partner,
        id: `${familyMember.id}-expartner-${index}`,
      },
    }));

    memberId++;
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
      `${familyMember.id}-expartner-${familyMember.exFamilies.length}`
    );

    exPartner.partner = familyMember;
    familyMember.exFamilies.push({
      partner: exPartner,
      children: [],
    });
    refresh();
  }
  function deleteMember(familyMember: FamilyMember) {
    const baseParent = getBaseParent();
    if (baseParent.id !== familyMember.id) {
      if (hasParents(familyMember)) {
        familyMember.parents[0].children =
          familyMember.parents[0].children.filter(
            (child) => child.id !== familyMember.id
          );
        familyMember.parents[0].exFamilies.forEach((exFamily) => {
          if (exFamily.partner.id === familyMember.parents[1].id) {
            exFamily.children = exFamily.children.filter(
              (child) => child.id !== familyMember.id
            );
          }
        });
      }

      if (hasSiblings(familyMember)) {
        familyMember.siblings.forEach(
          (sibling) =>
            (sibling.siblings = sibling.siblings.filter(
              (sibling) => sibling.id !== familyMember.id
            ))
        );
      }
      if (hasChildren(familyMember)) {
        familyMember.children = [];
      }
      if (hasExChildren(familyMember)) {
        familyMember.exFamilies = [];
      }
      if (hasPartner(familyMember)) {
        familyMember.partner = null;
      }
      if (familyMember.parents[0].id === baseParent.id) {
        baseParent.children = baseParent.children.filter(
          (child) => child.id !== familyMember.id
        );
        baseFamilyMember.exFamilies = baseFamilyMember.exFamilies.map(
          (exFamily) => ({
            ...exFamily,
            children: exFamily.children.filter(
              (child) => child.id !== familyMember.id
            ),
          })
        );
      }
    } else {
      alert("This node cant be deleted");
    }
    refresh();
  }

  function deleteRelation(
    familyMember: FamilyMember,
    from: string,
    partnerId: string
  ) {
    if (from === Relations.Partner) {
      familyMember.partner = null;
      if (hasChildren(familyMember)) {
        familyMember.children = [];
      }
    }
    if (from === Relations.ExPartner) {
      familyMember.exFamilies = familyMember.exFamilies.filter(
        (exFamilies) => exFamilies.partner.id !== partnerId
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
  function hasExChildren(familyMember: FamilyMember) {
    let hasExChildren = false;
    familyMember.exFamilies.forEach((exFamily) => {
      if (exFamily.children.length > 0) hasExChildren = true;
    });
    return hasExChildren;
  }
  function hasMoreThanOneChild(familyMember: FamilyMember) {
    return familyMember.children.length > 1;
  }
  function hasMoreThanOneExChild(familyMember: FamilyMember) {
    let hasMoreThanOne = false;
    familyMember.exFamilies.forEach((exFamily) => {
      if (exFamily.children.length > 1) {
        hasMoreThanOne = true;
      }
    });
    return hasMoreThanOne;
  }
  function hasPartner(familyMember: FamilyMember) {
    return familyMember.partner != null;
  }
  function hasExPartner(familyMember: FamilyMember) {
    return familyMember.exFamilies.length > 0;
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
    if (!hasParents(familyMember)) {
      return false;
    }
    return familyMember.id === familyMember.parents[0].children[0]?.id;
  }
  function isChild(familyMember: FamilyMember) {
    if (hasParents(familyMember)) {
      const { parents } = familyMember;
      const { children } = parents[0];
      return children.some((child) => child.id === familyMember.id);
    }
    return false;
  }
  function isExChild(familyMember: FamilyMember) {
    if (hasParents(familyMember)) {
      const { parents } = familyMember;
      const { exFamilies } = parents[0];
      let isExChild = false;
      exFamilies.forEach((family) =>
        family.children.forEach((child) => {
          if (child.id === familyMember.id) {
            isExChild = true;
          }
        })
      );
      return isExChild;
    }
    return false;
  }
  function isFirstExChild(familyMember: FamilyMember) {
    if (!hasParents(familyMember)) {
      return false;
    }
    if (familyMember.parents[0].exFamilies[0].children[0]) {
      return (
        familyMember.id === familyMember.parents[0].exFamilies[0].children[0].id
      );
    }
    return false;
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
    if (hasChildren(familyMember)) {
      familyMember.children.forEach(
        (child) => (child.parents[0].gender = gender)
      );
    }
    if (hasExChildren(familyMember)) {
      familyMember.exFamilies.forEach((exFamily) =>
        exFamily.children.forEach((child) => (child.parents[0].gender = gender))
      );
    }
    refresh();
  }
  function isHeadFamilyMember(familyMember: FamilyMember) {
    if (hasPartner(familyMember)) {
      return true;
    }
    if (hasExPartner(familyMember)) {
      return true;
    }
    if (hasChildren(familyMember)) {
      return true;
    }
    if (hasExChildren(familyMember)) {
      return true;
    }
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
  function getPreviousExSibling(familyMember: FamilyMember): {
    hasPrevSibling: boolean;
    prevSibling: FamilyMember;
  } {
    if (hasParents(familyMember)) {
      const { exFamilies } = familyMember.parents[0];
      const exChildren = exFamilies.find(
        (exFamily) => exFamily.partner.id === familyMember.parents[1].id
      ).children;
      const previousSiblingIndex =
        exChildren.map((child) => child.id).indexOf(familyMember.id) - 1;
      if (previousSiblingIndex >= 0) {
        return {
          hasPrevSibling: true,
          prevSibling: exChildren[previousSiblingIndex],
        };
      }
    }
    return { hasPrevSibling: false, prevSibling: {} as FamilyMember };
  }
  function changeRelationType(
    familyMember: FamilyMember,
    actualRelation: Relations,
    newRelation: Relations,
    mother?: number
  ) {
    if (
      actualRelation === Relations.Partner &&
      newRelation === Relations.ExPartner
    ) {
      const { partner: newExPartner } = familyMember;
      newExPartner.children = familyMember.children;
      familyMember.partner = null;
      familyMember.children = [];
      newExPartner.id = `${familyMember.id}-expartner-${familyMember.exFamilies.length}`;
      familyMember.exFamilies.push({
        partner: newExPartner,
        children: newExPartner.children,
      });
    }
    if (
      actualRelation === Relations.ExPartner &&
      newRelation === Relations.Partner
    ) {
      const newPartner = familyMember.exFamilies[mother].partner;
      if (!hasPartner(familyMember)) {
        newPartner.children = familyMember.exFamilies[mother].children;
        familyMember.exFamilies = familyMember.exFamilies.filter(
          (exFamily) => exFamily.partner.id !== newPartner.id
        );
        familyMember.exFamilies = familyMember.exFamilies.filter(
          (exFamily) => exFamily.partner.id !== newPartner.id
        );
        familyMember.partner = newPartner;
        familyMember.children = newPartner.children;
        newPartner.id = `${familyMember.id}-partner`;
      } else {
        alert("this member already has a partner");
      }
    }
    refresh();
  }
  function setAge(familyMember: FamilyMember, age: number) {
    familyMember.age = age;
    if (hasParents(familyMember)) {
      const { parents } = familyMember;
      if (isExChild(familyMember)) {
        const { exFamilies } = parents[0];
        parents[0].exFamilies = exFamilies.map((exFamily) => ({
          ...exFamily,
          children: exFamily.children.map((child) =>
            child.id === familyMember.id ? { ...child, age } : child
          ),
        }));
      }
      if (isChild(familyMember)) {
        const { children } = parents[0];
        parents[0].children = children.map((child) =>
          child.id === familyMember.id ? { ...child, age } : child
        );
      }
    }
    refresh();
  }
  function getBaseParent() {
    let currentFamilyMember = familyMember;

    let stop = false;
    do {
      if (hasParents(currentFamilyMember)) {
        currentFamilyMember = currentFamilyMember.parents[0];
      } else {
        stop = true;
      }
    } while (!stop);
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
    hasExChildren,
    hasMoreThanOneChild,
    hasMoreThanOneExChild,
    hasPartner,
    hasExPartner,
    isFemale,
    isChild,
    isFirstChild,
    isExChild,
    isFirstExChild,
    isHeadFamilyMember,
    changeGender,
    setAge,
    changeRelationType,
    getPreviousSibling,
    getPreviousExSibling,
    getPreviousUncle,
    getBaseParent,
    deleteMember,
    deleteRelation,
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
    exFamilies: [],
    siblings: [],
    gender: Gender.Female,
    age: 0,
    id: !partner ? id.toString() : partnerId,
  };
}
