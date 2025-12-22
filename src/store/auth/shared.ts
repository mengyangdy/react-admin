import { useMutation, useQuery } from "@tanstack/react-query";

import { fetchGetUserInfo, fetchLogin } from "@/service/api/auth";
import { localStg } from "@/utils/storage.ts";

import { QUERY_KEYS } from "./key";

export function getToken() {
  return localStg.get("token") || "";
}

export function useLogin() {
  return useMutation({
    mutationFn: (params) => fetchLogin(params),
    retry: false,
  });
}

export function useUserInfo() {
  const hasToken = Boolean(localStg.get("token"));
  return useQuery({
    enabled: hasToken,
    gcTime: Infinity,
    placeholderData: () => ({
      name: "",
      avatar: "",
      buttons: [],
      roles: [],
    }),
    queryFn: fetchGetUserInfo,
    queryKey: QUERY_KEYS.AUTH.USER_INFO,
    retry: false,
    staleTime: Infinity,
  });
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
