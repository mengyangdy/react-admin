import { getAntdMenuItems } from "./menuUtil";

export function getActiveFirstLevelMenuKey(route: App.Global.TabRoute | null): string {
	if (!route) return "";

	const staticData = route.staticData as
		| {
				activeMenu?: string;
				hideInMenu?: boolean;
		  }
		| undefined;

	const { activeMenu, hideInMenu } = staticData || {};

	const name = route.pathname;

	const routeName = (hideInMenu ? activeMenu : name) || name;

	const [, firstLevelRouteName] = routeName.split("/");

	return `/${firstLevelRouteName}`;
}

export function getLayoutChildrenRoutes(
	routes: Router.RouteTree,
): ReturnType<typeof getAntdMenuItems> {
	if (!routes.children || !Array.isArray(routes.children)) return [];
	const layoutRoute = routes.children.find((r: Router.RouteTreeNode) => r.id === "/_layout");
	if (!layoutRoute || !layoutRoute.children) return [];
	return getAntdMenuItems(layoutRoute.children);
}

export const getLevelKeys = (items1: Router.LevelKeysProps[]): Record<string, number> => {
	const key: Record<string, number> = {};
	const func = (items2: Router.LevelKeysProps[], level = 1) => {
		items2.forEach((item) => {
			if (item.key) {
				key[item.key] = level;
			}
			if (item.children) {
				func(item.children, level + 1);
			}
		});
	};

	func(items1);
	return key;
};

export const getSelectedMenuKeyPath = (matches: Array<{ pathname?: string }>): string[] => {
	const result = matches.reduce((acc: string[], match, index) => {
		if (index < matches.length - 1 && match.pathname) {
			acc.push(match.pathname);
		}
		return acc;
	}, []);

	return result;
};
