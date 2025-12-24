import { useMutation, useQuery } from "@tanstack/react-query";

import { localStg } from "@/utils/storage";

import { fetchGetUserInfo, fetchLogin } from "../api/auth";
import { QUERY_KEYS } from "../keys";

export function useLogin() {
  return useMutation<Api.Auth.LoginToken, Error, Api.Auth.LoginParams>({
    mutationFn: (params) => fetchLogin(params),
    retry: false,
  });
}

export function useUserInfo() {
  const hasToken = Boolean(localStg.get("token"));
  return useQuery({
    enabled: hasToken,
    gcTime: Infinity,
    placeholderData: () =>
      ({
        avatar: "",
        buttons: [],
        name: "",
        roles: [],
        userId: "",
        userName: "",
      }),
    queryFn: fetchGetUserInfo,
    queryKey: QUERY_KEYS.AUTH.USER_INFO,
    retry: false,
    staleTime: Infinity,
  });
}
