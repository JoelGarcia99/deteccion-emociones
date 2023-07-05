import { User } from "src/user/entities/user.entity";

export interface ISignUpResponse {
  token: string;
  user: User;
}
