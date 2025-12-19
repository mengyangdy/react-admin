import { Link, type useMatchRoute } from "@tanstack/react-router";
import type { BreadcrumbProps } from "antd";
import { cloneElement, type ReactElement } from "react";

type BreadcrumbItem = Required<BreadcrumbProps>["items"][number];

function BreadcrumbContent({
	icon,
	label,
}: {
	readonly icon: ReactElement;
	readonly label: ReactElement;
}) {
	return (
		<div className="i-flex-y-center align-middle">
			{cloneElement(icon, { className: "mr-4px text-icon" } as Record<string, unknown>)}
			{label}
		</div>
	);
}

export function getPathnameByIndex(pathname: string, index: number): string {
	const segments = pathname.split("/").filter(Boolean); //去掉空项
	const sliced = segments.slice(0, index + 1);
	return `/${sliced.join("/")}`;
}

function hasChildren(
	menu: Router.AntdMenuItem,
): menu is Router.AntdMenuItem & { children: Router.AntdMenuItem[] } {
	return menu !== null && "children" in menu && Array.isArray(menu.children);
}

function hasIconAndLabel(
	menu: Router.AntdMenuItem,
): menu is Router.AntdMenuItem & { icon?: ReactElement; label?: ReactElement } {
	return menu !== null && ("icon" in menu || "label" in menu);
}

export function getBreadcrumbsByRoute(
	routeData: ReturnType<typeof import("@/hooks/router/useCurrentRoute").useCurrentRoute>,
	menus: Router.AntdMenuItem[],
	matchRoute: ReturnType<typeof useMatchRoute>,
) {
	const breadcrumbs: BreadcrumbItem[] = [];
	const matched = routeData.matched || [];
	let currentMenus = menus;
	let selectedKeys: string[] = [];
	for (let i = 1; i < matched.length; i++) {
		const matchedRoute = matched[i];
		if (!matchedRoute) continue;
		const currentMenu = currentMenus.find((item) => item?.key === matchedRoute.pathname);
		if (!currentMenu || !hasIconAndLabel(currentMenu)) break;
		const breadcrumbItem: BreadcrumbItem = {
			title: (
				<BreadcrumbContent
					icon={(currentMenu.icon as ReactElement) || <></>}
					label={(currentMenu.label as ReactElement) || <></>}
				/>
			),
		};
		if (hasChildren(currentMenu) && currentMenu.children.length > 0) {
			const flattenedChildren = currentMenu.children
				.filter(
					(
						child,
					): child is Router.AntdMenuItem & {
						key: string;
						icon?: ReactElement;
						label?: ReactElement;
					} => child !== null && child !== undefined && typeof child.key === "string",
				)
				.map((child) => {
					const isMatch = matchRoute({ to: child.key });
					if (isMatch) {
						selectedKeys = [child.key];
					}
					return {
						icon: child.icon,
						key: child.key,
						label: isMatch ? child.label : <Link to={child.key}>{child.label}</Link>,
					};
				});
			breadcrumbItem.menu = {
				items: flattenedChildren,
				selectedKeys,
			};
		}
		breadcrumbs.push(breadcrumbItem);
		currentMenus = hasChildren(currentMenu) ? currentMenu.children : [];
	}
	return breadcrumbs;
}
