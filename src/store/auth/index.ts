import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import { produce } from "immer";

import { globalConfig } from "@/config";
import { useLogin, useUserInfo } from "@/service/hooks";
import { QUERY_KEYS } from "@/service/keys";
import { queryClient } from "@/service/queryClient";
import {
  clearAuthStorage,
  getToken,
  getUserInfo,
} from "@/store/auth/shared.ts";
import { localStg } from "@/utils/storage";

import { routerActions } from "../router";
import { tabActions, useTabState } from "../tab";
import { useThemeSettings } from "../theme";

const getInitialState = () => ({
  token: getToken(),
});

export type AuthState = ReturnType<typeof getInitialState>;

export const authStore = new Store<AuthState>(getInitialState());

const selectAuthState = (state: AuthState) => state;

export const useAuthState = () => useStore(authStore, selectAuthState);

export const authActions = {
  setToken(payload: string) {
    authStore.setState((prev) =>
      produce(prev, (draft) => {
        draft.token = payload;
      })
    );
  },
  useInitAuth() {
    const { endLoading, loading, startLoading } = useLoading();
    const { mutate: login } = useLogin();
    const { refetch: refetchUserInfo } = useUserInfo();

    const replace = useNavigate();
    const search = useSearch({ from: "/login/" });
    const redirectUrl = (search as { redirect?: string }).redirect;
    async function toLogin(
      params: Api.Auth.LoginParams,
      redirect = true
    ): Promise<void> {
      if (loading) return;
      startLoading();
      login(params, {
        onSuccess: async (data: Api.Auth.LoginToken) => {
          localStg.set("token", data.data.token);
          localStg.set("refreshToken", data.data.refreshToken);
          const { data: info, error } = await refetchUserInfo();
          console.log("🚀 ~ :60 ~ toLogin ~ error:", error);
          console.log("🚀 ~ :60 ~ toLogin ~ info:", info);
          if (!error && info) {
            const previousUserId = localStg.get("previousUserId");
            localStg.set("userInfo", info);
            authActions.setToken(data.data.token);
            if (previousUserId !== info.userId || !previousUserId) {
              localStg.remove("globalTabs");
              replace({
                to: globalConfig.homePath,
              });
            } else if (redirect) {
              replace({
                to: redirectUrl || globalConfig.homePath,
              });
            }
            window.$notification?.success({
              description: `欢迎回来，${info.userName}`,
              title: "登录成功",
            });
          } else {
            endLoading();
          }
        },
      });
    }
    return { toLogin, loading };
  },
  resetAuth() {
    const router = useRouter();
    const navigate = useNavigate();
    clearAuthStorage();
    authStore.setState(() => getInitialState());
    tabActions.resetTabStore();
    routerActions.resetRouterStore();
    const userInfo =
      queryClient.getQueryData(QUERY_KEYS.AUTH.USER_INFO) || getUserInfo();

    localStg.set("previousUserId", userInfo?.userId || "");
    const themeSettings = useThemeSettings();
    const tabStore = useTabState();
    if (themeSettings.tab.cache) {
      localStg.set("globalTabs", tabStore.tabs);
    }
    queryClient.clear();

    const location = router.state.location;

    const fullPath = location.pathname + location.search + location.hash;

    const currentPath = location.pathname + location.search;

    const isLoginPage = currentPath.includes("/login");

    if (!isLoginPage) {
      navigate({
        to: "/login",
        search: {
          redirect: fullPath,
        },
        replace: true,
      });
    } else {
      navigate({
        to: "/login",
        replace: true,
      });
    }
  },
};
