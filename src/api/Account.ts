import api from "./ApiConfig";
import { LoginContainer } from "../models/Login";
import { RegisterContainer } from "../models/Register";
import { User } from "../models/User";

export const Account = {
  login: (data: LoginContainer) =>
    api.post<User>("/users/login", data),

  register: (data: RegisterContainer) =>
    api.post<User>("/users/register", data)
};