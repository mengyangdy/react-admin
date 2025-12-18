import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import { produce } from "immer";

import { getToken } from "@/store/auth/shared.ts";

const getInitialState = () => ({
	token: getToken(),
	userInfo: null as Api.Auth.UserInfo | null,
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
			}),
		);
	},
	setUserInfo(payload: Api.Auth.UserInfo | null) {
		authStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.userInfo = payload;
			}),
		);
	},
};
