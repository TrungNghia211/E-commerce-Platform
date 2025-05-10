import http from "@/lib/http";
import { LoginValues, RegisterValues } from "@/types/types";

const userApiRequest = {
  createUser: (values: RegisterValues) => http.post<Response>("/users", values),
  login: (values: LoginValues) => http.post<Response>("/auth/token", values),
};

export default userApiRequest;
