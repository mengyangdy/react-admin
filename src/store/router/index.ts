import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import { produce } from "immer";
import { useMemo } from "react";

import { getActiveFirstLevelMenuKey, getLayoutChildrenRoutes } from "@/store/router/shared";

const getInitialState = (): Router.RouterStoreState => ({
	routeHomePath: import.meta.env.VITE_ROUTE_HOME,
	cacheRoutes: [],
	activeFirstLevelMenuKey: "",
	activeTabId: "",
	removeCacheKey: null,
	tabs: [],
	allMenus: [],
	childLevelMenus: [],
	firstLevelMenu: [],
	isActiveFirstLevelMenuHasChildren: false,
	selectKey: undefined,
});

export type RouterState = ReturnType<typeof getInitialState>;

export const routerStore = new Store<RouterState>(getInitialState());

const selectRouterState = (state: RouterState) => state;

export const useRouterStoreState = () => useStore(routerStore, selectRouterState);

export const routerActions = {
	setAllMenus(): void {
		const { routeTree } = useTanstackRouter();
		const menus = useMemo(
			() => getLayoutChildrenRoutes(routeTree as Router.RouteTree),
			[routeTree],
		);
		routerStore.setState((prev) => ({
			...prev,
			allMenus: menus,
		}));
	},
	setFirstLevelMenu(): void {
		const firstLevel = routerStore.state.allMenus
			.filter(
				(menu): menu is Router.AntdMenuItem & { children?: Router.AntdMenuItem[] } => menu !== null,
			)
			.map((menu) => {
				const { children: _, ...rest } = menu;
				return rest;
			});
		routerStore.setState((prev) => ({
			...prev,
			firstLevelMenu: firstLevel,
		}));
	},
	setChildLevelMenus(): void {
		const menu = routerStore.state.allMenus.find(
			(m): m is Router.AntdMenuItem & { children?: Router.AntdMenuItem[] } =>
				m !== null && m.key === routerStore.state.activeFirstLevelMenuKey,
		);
		const childrenLevel = menu?.children;
		routerStore.setState((prev) => ({
			...prev,
			childLevelMenus: childrenLevel,
		}));
	},
	setSelectKey(): void {
		const { route } = useCurrentRoute();

		if (!route) return;

		const staticData = route.staticData as
			| {
					activeMenu?: string;
					hideInMenu?: boolean;
			  }
			| undefined;

		const { activeMenu, hideInMenu } = staticData || {};

		const name = route.pathname as string;

		const routeName = (hideInMenu ? activeMenu : name) || name;
		routerStore.setState((prev) => ({
			...prev,
			selectKey: [routeName],
		}));
	},
	setActiveFirstLevelMenuKey(key?: string): void {
		const { route } = useCurrentRoute();
		const routeKey = key || getActiveFirstLevelMenuKey(route);

		routerStore.setState((prev) => ({
			...prev,
			selectKey: [routeKey],
		}));
	},
	setRemoveCacheKey(key: string | null): void {
		routerStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.removeCacheKey = key;
			}),
		);
	},
};
