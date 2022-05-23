import { Gender } from "../../types/gender";

export interface ProfileInformationForm {
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  dateOfDeath: string | undefined;
  gender: Gender;
  deceased: boolean;
}
