import { useNavigate } from "@tanstack/react-router";
import { Menu, type MenuProps } from "antd";
import type { FC } from "react";

import { routerActions, useRouterStoreState } from "@/store/router";
import { useThemeState } from "@/store/theme";

import { HorizontalMenuMode } from "../types";

interface Props {
	mode: HorizontalMenuMode;
}

function isHasChildren(menus: Router.AntdMenuItem[], key: string): boolean {
	return menus.some((item) => {
		if (item === null || typeof item !== "object" || !("key" in item)) {
			return false;
		}
		return (
			item.key === key &&
			"children" in item &&
			Array.isArray(item.children) &&
			item.children.length > 0
		);
	});
}

const AntdHorizontalMenu: FC<Props> = ({ mode }) => {
	const navigate = useNavigate();
	const themeStore = useThemeState();
	const routerStore = useRouterStoreState();

	const allMenus = routerStore.allMenus;
	const childLevelMenus = routerStore.childLevelMenus;
	const firstLevelMenu = routerStore.firstLevelMenu;
	const selectKey = routerStore.selectKey;

	const selectedKeys =
		mode === HorizontalMenuMode.FirstLevel
			? selectKey?.[0]
				? [`/${selectKey[0].split("/")[1]}`]
				: []
			: selectKey || [];

	function getMenus(): Router.AntdMenuItem[] | undefined {
		if (mode === HorizontalMenuMode.All) {
			return allMenus;
		} else if (mode === HorizontalMenuMode.Child) {
			return childLevelMenus;
		}
		return firstLevelMenu as Router.AntdMenuItem[];
	}
	const handleClickMenu: MenuProps["onSelect"] = (info) => {
		if (mode === HorizontalMenuMode.FirstLevel && isHasChildren(allMenus, info.key)) {
			routerActions.setActiveFirstLevelMenuKey(info.key);
		} else {
			navigate({ to: info.key });
		}
	};
	return (
		<Menu
			className="size-full transition-400 border-0!"
			inlineIndent={18}
			items={getMenus()}
			mode="horizontal"
			selectedKeys={selectedKeys}
			style={{ lineHeight: `${themeStore.themeSettings.header.height}px` }}
			onSelect={handleClickMenu}
		/>
	);
};
export default AntdHorizontalMenu;
