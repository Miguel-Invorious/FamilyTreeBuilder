import { Gender } from "../../types/gender";

export interface ProfileInformationForm {
  firstname: string;
  lastname: string;
  dateOfBirth: Date | undefined;
  dateOfDeath: Date | undefined;
  gender: Gender;
  deceased: boolean;
}
