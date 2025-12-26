import { localStg } from "@/utils/storage.ts";

export function getToken() {
  return localStg.get("token") || "";
}

export function clearAuthStorage() {
  localStg.remove("token");
  localStg.remove("refreshToken");
  localStg.remove("userInfo");
}

export function getUserInfo() {
  const emptyInfo = {
    buttons: [],
    roles: [],
    userId: "",
    userName: "",
  };
  const userInfo = localStg.get("userInfo") || emptyInfo;
  if (!userInfo.buttons) {
    userInfo.buttons = [];
  }
  return userInfo;
}
