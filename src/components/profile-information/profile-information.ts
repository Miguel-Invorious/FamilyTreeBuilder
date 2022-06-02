import { Gender } from "../../types/gender";

export interface ProfileInformationForm {
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  dateOfDeath: string | null;
  gender: Gender | null;
  deceased: boolean;
  age: number | null;
}
