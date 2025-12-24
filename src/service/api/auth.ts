import type { UserInfoResponse } from "@/store/auth/shared";

import request from "../request";

export function fetchLogin(data: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResponse>("/auth/login", data);
}

export function fetchGetUserInfo(): Promise<UserInfoResponse> {
  return request.get<Api.Auth.LoginResponse>("/user/info");
}
