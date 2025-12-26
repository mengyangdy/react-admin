export enum UserGender {
  /** Male */
  MALE = "1",
  /** Female */
  FEMALE = "2",
}

export type UserGenderValue = `${UserGender}`;

export enum UserStatus {
  ENABLE = "1",
  DISABLE = "2",
}

export type UserStatusValue = `${UserStatus}`;
