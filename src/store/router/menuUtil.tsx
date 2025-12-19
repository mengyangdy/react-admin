import SvgIcon from "@/components/SvgIcon";

export function getAntdMenuItems(routes: Router.RouteWithStaticData[]): Router.AntdMenuItem[] {
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
				icon:
					typeof staticData?.icon === "string" ? (
						<SvgIcon
							icon={staticData.icon}
							style={{ fontSize: "20px" }}
						/>
					) : (
						staticData?.icon
					),
				children: children && children.length > 0 ? children : undefined,
			} as Router.AntdMenuItem;
		});
}
