type TabRoute = {
	fullPath?: string;
	id: string;
	pathname: string;
	staticData: {
		fixedIndexInTab?: number;
		keepAlive?: boolean;
		multiTab?: boolean;
		title: string;
		icon?: string;
		localIcon?: string;
	};
};
type MatchedRoutes = Array<{
	id: string;
	staticData?: { icon?: string; localIcon?: string };
}>;

export function getFixedTabs(tabs: App.Global.Tab[]) {
	return tabs.filter(
		(tab) =>
			tab.fixedIndex || tab.fixedIndex === 0 || tab.routePath === import.meta.env.VITE_ROUTE_HOME,
	);
}

export function getTabByRoute(route?: TabRoute, matched?: MatchedRoutes) {
	if (!route) return null;
	const { fullPath, staticData, id, pathname } = route;
	const { fixedIndexInTab, keepAlive = false, title } = staticData;
	let fixedIndex = fixedIndexInTab;
	if (pathname === import.meta.env.VITE_ROUTE_HOME) {
		fixedIndex = 0;
	}
	const { icon, localIcon } = getRouteIcons(route, matched);
	const tab: App.Global.Tab = {
		fixedIndex,
		fullPath: fullPath || pathname,
		icon,
		id: staticData.multiTab ? fullPath || pathname : pathname,
		keepAlive,
		label: title,
		localIcon,
		newLabel: "",
		oldLabel: title,
		routeKey: id,
		routePath: pathname,
	};

	return tab;
}

export function getRouteIcons(route?: TabRoute, matched?: MatchedRoutes) {
	// 优先使用路由静态数据中的图标，保证与菜单一致
	const staticIcon = route?.staticData?.icon as string | undefined;
	const staticLocalIcon = route?.staticData?.localIcon as string | undefined;

	let icon: string = staticIcon || import.meta.env.VITE_MENU_ICON;
	let localIcon: string | undefined = staticLocalIcon;
	if (route && matched) {
		const currentRoute = matched.find((r) => r.id === route.id);
		icon = (currentRoute?.staticData as { icon?: string } | undefined)?.icon || icon;
		localIcon =
			(currentRoute?.staticData as { localIcon?: string } | undefined)?.localIcon || localIcon;
	}
	return {
		icon,
		localIcon,
	};
}

export function isTabInTabs(tabId: string, tabs: App.Global.Tab[]) {
	return tabs.some((tab) => tab.id === tabId);
}
