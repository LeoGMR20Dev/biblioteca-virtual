export interface IUserResponse {
  users: IUser[];
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  role: Role;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
