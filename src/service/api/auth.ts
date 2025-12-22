import request from "../request";

export function fetchLogin(data) {
  return request.post("/login", data);
}

export function fetchGetUserInfo() {
  return request.get("/user/info");
}
