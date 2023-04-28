import { User } from "src/user/entities/user.entity";

export interface ISignUpResponse {
  token: string;
  refreshToken: string;
  user: User;
}
