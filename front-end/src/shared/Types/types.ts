export interface BaseUser {
  email: string;
  type: "basic" | "company";
}

export interface BasicUser extends BaseUser {
  type: "basic";
  firstName: string;
  lastName: string;
}

export interface CompanyUser extends BaseUser {
  type: "company";
  BIP: string;
}

export type User = BasicUser | CompanyUser;