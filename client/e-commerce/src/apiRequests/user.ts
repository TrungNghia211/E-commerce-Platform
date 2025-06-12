import http from "@/lib/http";
import { LoginValues, RegisterValues } from "@/types/types";

const userApiRequest = {
  createUser: (values: RegisterValues) => http.post<Response>("/users", values),

  login: (values: LoginValues) => http.post<any>("/auth/token", values),

  auth: (body: { sessionToken: string }) =>
    http.post("/api/auth", body, { baseUrl: "" }),

  getMe: () => http.get<any>("/users/me"),

  logout: async () => {
    const res = await http.post<{ message: string }>(
      "/api/logout",
      {},
      { baseUrl: "" }
    );
    return res;
  },
};

export default userApiRequest;
