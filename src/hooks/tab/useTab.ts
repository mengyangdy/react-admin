import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";

import { routerActions } from "@/store/router";
import { getActiveFirstLevelMenuKey } from "@/store/router/shared";
import { tabActions, tabStore } from "@/store/tab";
import { useThemeSettings } from "@/store/theme";
import { localStg } from "@/utils/storage.ts";

import { getFixedTabs, getTabByRoute, isTabInTabs } from "./shared";
import { TabEvent } from "./tabEnum";

export function initTab(cache: boolean) {
	const storageTabs = localStg.get("globalTabs");
	if (cache && storageTabs) {
		tabActions.setTabs(storageTabs);
		return storageTabs;
	}
	return [];
}

export function useTabController() {
	const emit = useEmit();
	function _operateTab(eventName: TabEvent, id?: string) {
		emit(TabEvent.UPDATE_TABS, eventName, id);
	}
	function clearLeftTabs(id: string) {
		_operateTab(TabEvent.CLEAR_LEFT_TABS, id);
	}
	function clearRightTabs(id: string) {
		_operateTab(TabEvent.CLEAR_RIGHT_TABS, id);
	}
	function closeCurrentTab(id: string) {
		_operateTab(TabEvent.CLOSE_CURRENT, id);
	}
	function closeOtherTabs(id: string) {
		_operateTab(TabEvent.CLOSE_OTHER, id);
	}
	function closeAllTabs() {
		_operateTab(TabEvent.CLOSE_ALL);
	}
	return {
		clearLeftTabs,
		clearRightTabs,
		closeAllTabs,
		closeCurrentTab,
		closeOtherTabs,
	};
}

export function useTabActions() {
	const tabState = useStore(tabStore, (s) => s);
	const tabs = tabState.tabs as App.Global.Tab[];
	const activeTabId = tabState.activeTabId as string;
	const navigate = useNavigate();
	const _fixedTabs: App.Global.Tab[] = getFixedTabs(tabs);
	const _tabIds = tabs.map((tab: App.Global.Tab) => tab.id);
	function changeActivetabId(tabId: string) {
		tabActions.setActiveTabId(tabId);
	}
	async function switchRouteByTab(tab: App.Global.Tab) {
		navigate({
			to: tab.id,
		});
		changeActivetabId(tab.id);
	}

	function _clearTabs(excludes: string[] = []) {
		const remainTabIds = [..._fixedTabs.map((tab) => tab.id), ...excludes];
		const removeKeepKeys: string[] = [];
		const updatedTabs: App.Global.Tab[] = [];
		for (const tab of tabs as App.Global.Tab[]) {
			if (remainTabIds.includes(tab.id)) {
				updatedTabs.push(tab);
			} else if (tab.keepAlive) {
				removeKeepKeys.push(tab.routePath);
			}
		}
		if (updatedTabs.length === tabs.length) return;
		if (!remainTabIds.includes(activeTabId)) {
			const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId);
			const newActive = tabs[currentIndex + 1] || tabs[currentIndex - 1] || updatedTabs.at(-1);
			if (newActive) switchRouteByTab(newActive);
		}
		tabActions.setTabs(updatedTabs);
		if (removeKeepKeys.length > 0) {
			routerActions.setRemoveCacheKey(removeKeepKeys[0]);
		}
	}

	function _clearLeftTabs(tabId: string) {
		const index = _tabIds.indexOf(tabId);
		if (index === -1) return;
		const excludes = _tabIds.slice(index);
		_clearTabs(excludes);
	}

	function _clearRightTabs(tabId: string) {
		const index = _tabIds.indexOf(tabId);
		if (index === 0) {
			_clearTabs();
			return;
		}
		if (index === -1) return;
		const excludes = _tabIds.slice(0, index + 1);
		_clearTabs(excludes);
	}

	function removeTabById(tabId: string) {
		const excludes = _tabIds.filter((t) => t !== tabId);
		_clearTabs(excludes);
	}
	function removeActiveTab() {
		removeTabById(activeTabId);
	}
	function isTabRetain(tabId: string) {
		return _fixedTabs.some((tab) => tab.id === tabId);
	}
	useOn(TabEvent.UPDATE_TABS, (eventName: TabEvent, id: string) => {
		// 清除左侧标签页
		if (eventName === TabEvent.CLEAR_LEFT_TABS) return _clearLeftTabs(id);

		// 清除右侧标签页
		if (eventName === TabEvent.CLEAR_RIGHT_TABS) return _clearRightTabs(id);

		// 关闭当前标签页
		if (eventName === TabEvent.CLOSE_CURRENT) return removeTabById(id);

		// 关闭其他标签页
		if (eventName === TabEvent.CLOSE_OTHER) return _clearTabs([id]);

		// 清除所有标签页
		return _clearTabs();
	});
	return {
		activeTabId,
		isTabRetain,
		navigate,
		removeActiveTab,
		removeTabById,
		tabs,
	};
}

export function useCacheTabs() {
	const themeSettings = useThemeSettings();
	const tabs = useStore(tabStore, (s) => s.tabs);
	function cacheTabs() {
		if (!themeSettings.tab.cache) return;
		localStg.set("globalTabs", tabs);
	}
	return cacheTabs;
}

export function useTabManage() {
	const isInit = useRef(false);
	const themeSettings = useThemeSettings();
	const cacheTabs = useCacheTabs();
	const tabState = useStore(tabStore, (s) => s);
	const tabs = tabState.tabs as App.Global.Tab[];
	const { route, matched } = useCurrentRoute();
	const fullPath = route?.fullPath;
	function _addTab(route?: Router.Route, matched?: Router.RouteMatch[]) {
		const tab = getTabByRoute(route, matched);
		if (!tab) return;

		if (!isInit.current) {
			isInit.current = true;
			const initTabs = initTab(themeSettings.tab.cache);
			const existsInInit =
				Array.isArray(initTabs) && initTabs.length > 0 && isTabInTabs(tab.id, initTabs);
			const existsInStore = isTabInTabs(tab.id, tabs);
			if (!existsInInit && !existsInStore) {
				tabActions.addTab(tab);
			}
		} else if (!isTabInTabs(tab.id, tabs)) {
			tabActions.addTab(tab);
		} else {
			const index = tabs.findIndex((item) => item.id === tab.id);
			tabActions.updateTab({ index, tab });
		}
		tabActions.setActiveTabId(tab.id);
		const firstLevelRouteName = getActiveFirstLevelMenuKey(route);
		tabActions.setActiveFirstLevelMenuKey(firstLevelRouteName);
	}

	useEffect(() => {
		_addTab(route, matched);
	}, [fullPath]);
	useEventListener(
		"beforeunload",
		() => {
			cacheTabs();
		},
		{
			target: window,
		},
	);
}
