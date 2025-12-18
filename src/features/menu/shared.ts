export function getChildrenRoutes(routes: Router.RouteTree): Router.AntdMenuItem[] {
	if (!routes.children || !Array.isArray(routes.children)) return [];
	const layoutRoute = routes.children.find((r: Router.RouteTreeNode) => r.id === "/_layout");
	if (!layoutRoute || !layoutRoute.children) return [];
	return getAntdMenuItems(layoutRoute.children);
}

function getAntdMenuItems(routes: Router.RouteWithStaticData[]): Router.AntdMenuItem[] {
	return routes
		.filter((route) => {
			const staticData = route.options?.staticData;
			return staticData && !staticData.hideInMenu;
		})
		.sort((a, b) => {
			const orderA = a.options?.staticData?.order ?? 99;
			const orderB = b.options?.staticData?.order ?? 99;
			return orderA - orderB;
		})
		.map((route) => {
			const staticData = route.options?.staticData;
			const children = route.children ? getAntdMenuItems(route.children) : undefined;
			return {
				key: route.fullPath, // 使用 fullPath 作为 key
				label: staticData?.title || route.id,
				icon: staticData?.icon,
				children: children && children.length > 0 ? children : undefined,
			} as Router.AntdMenuItem;
		});
}

interface RouteForSelectKey {
	activeMenu?: string;
	hideInMenu?: boolean;
	pathname: string;
}

export function getSelectKey(route: RouteForSelectKey): string[] {
	const { activeMenu, hideInMenu } = route;
	const name = route.pathname;
	const routeName = (hideInMenu ? activeMenu : name) || name;
	return [routeName];
}
