import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import { produce } from "immer";

type TabState = {
	// 当前一级菜单
	activeFirstLevelMenuKey: string;
	// 当前标签页
	activeTabId: string;
	// 需要删除的标签页
	removeCacheKey: string | null;
	// 标签页
	tabs: App.Global.Tab[];
};

const getInitialState = (): TabState => ({
	activeFirstLevelMenuKey: "",
	activeTabId: "",
	removeCacheKey: null,
	tabs: [],
});

export type { TabState };

export const tabStore = new Store<TabState>(getInitialState());

const selectTabState = (state: TabState) => state;

export const useTabState = () => useStore(tabStore, selectTabState);

export const tabActions = {
	addTab(tab: App.Global.Tab) {
		const { fixedIndex } = tab;
		const hasFixedIndex = fixedIndex === 0 || Boolean(fixedIndex);

		if (hasFixedIndex) {
			tabStore.setState((prev) =>
				produce(prev, (draft) => {
					const nextTabs = [...prev.tabs];
					nextTabs.splice(fixedIndex as number, 0, tab);
					draft.tabs = nextTabs;
				}),
			);
		} else {
			tabStore.setState((prev) =>
				produce(prev, (draft) => {
					draft.tabs = [...prev.tabs, tab];
				}),
			);
		}
	},
	setTabs(payload: App.Global.Tab[]) {
		tabStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.tabs = payload;
			}),
		);
	},
	setActiveTabId(payload: string) {
		tabStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.activeTabId = payload;
			}),
		);
	},
	updateTab(payload: { index: number; tab: App.Global.Tab }) {
		const { index, tab } = payload;
		tabStore.setState((prev) =>
			produce(prev, (draft) => {
				const currentTabs = [...prev.tabs];
				currentTabs[index] = tab;
				draft.tabs = currentTabs;
			}),
		);
	},
	setActiveFirstLevelMenuKey(payload: string) {
		tabStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.activeFirstLevelMenuKey = payload;
			}),
		);
	},
};
