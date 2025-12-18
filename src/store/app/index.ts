import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import { produce } from "immer";

const getInitialState = () => ({
	reloadFlag: false,
});

export type AppState = ReturnType<typeof getInitialState>;

export const appStore = new Store<AppState>(getInitialState());

const selectAppState = (state: AppState) => state;

export const useAppState = () => useStore(appStore, selectAppState);

export const appActions = {
	setReloadFlag(state: boolean) {
		appStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.reloadFlag = state;
			}),
		);
	},
};
