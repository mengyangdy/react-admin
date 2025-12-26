import request from "../request";

export function fetchLogin(data: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResponse>("/auth/login", data);
}

export function fetchGetUserInfo() {
  return request.get<Api.Auth.UserInfoResponse>("/auth/userInfo");
}
