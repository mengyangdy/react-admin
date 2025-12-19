import { transformColorWithOpacity } from "@dy/color";
import { SimpleScrollbar } from "@dy/materials";
import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import React, { cloneElement, type FC, memo } from "react";

import MenuToggler from "@/components/MenuToggler";
import { routerActions, useRouterStoreState } from "@/store/router";
import { useThemeState } from "@/store/theme";

interface Props {
	children?: React.ReactNode;
	inverted?: boolean;
	onSelect?: () => void;
}

interface MixMenuItemProps {
	/** Active menu item */
	active: boolean;
	inverted?: boolean;
	/** Menu item label */
	menu: App.Global.Menu;
	onClick?: () => void;
	setActiveFirstLevelMenuKey: (key: string) => void;
}

function MixMenuItem(Props: MixMenuItemProps) {
	const {
		active,
		inverted,
		menu: { children, icon, key, label },
		onClick,
		setActiveFirstLevelMenuKey,
	} = Props;

	const themeStore = useThemeState();

	const navigate = useNavigate();

	const siderCollapse = themeStore.siderCollapse;

	const selectedBgColor = getSelectedBgColor();

	function getSelectedBgColor() {
		const light = transformColorWithOpacity(themeStore.themeSettings.themeColor, 0.1, "#ffffff");
		const dark = transformColorWithOpacity(themeStore.themeSettings.themeColor, 0.3, "#000000");

		return themeStore.darkMode ? dark : light;
	}

	function handleSelectMixMenu() {
		setActiveFirstLevelMenuKey(key);

		if (children?.length) {
			if (onClick) onClick();
		} else {
			navigate({ to: key });
		}
	}

	return (
		<div
			style={{ backgroundColor: active ? selectedBgColor : "" }}
			className={clsx(
				"mx-4px mb-6px flex-col-center cursor-pointer rounded-8px bg-transparent px-4px py-8px  transition-300 hover:bg-[rgb(0,0,0,0.08)] ",
				{ "text-primary selected-mix-menu": active },
				{ "text-white:65 hover:text-white": inverted },
				{ "!text-white !bg-primary": active && inverted },
			)}
			onClick={handleSelectMixMenu}
		>
			{icon &&
				React.isValidElement(icon) &&
				cloneElement(icon, {
					className: siderCollapse ? "text-icon-small" : "text-icon-large",
				} as Record<string, unknown>)}

			<p
				className={clsx(
					"w-full ellipsis-text text-12px text-center  transition-height-300",
					siderCollapse ? "h-0 pt-0" : "h-24px pt-4px",
				)}
			>
				{label}
			</p>
		</div>
	);
}

const FirstLevelMenu: FC<Props> = memo(({ children, inverted, onSelect }) => {
	const routerStore = useRouterStoreState();
	const allMenus = routerStore.allMenus;
	const activeFirstLevelMenuKey = routerStore.activeFirstLevelMenuKey;

	return (
		<div className="h-full flex-col-stretch flex-1-hidden">
			{children}
			<SimpleScrollbar>
				{allMenus
					.filter(
						(
							item,
						): item is Router.AntdMenuItem & {
							children?: Router.AntdMenuItem[];
						} => item !== null,
					)
					.map((item) => (
						<MixMenuItem
							active={item.key === activeFirstLevelMenuKey}
							inverted={inverted}
							key={item.key}
							menu={item as App.Global.Menu}
							setActiveFirstLevelMenuKey={routerActions.setActiveFirstLevelMenuKey}
							onClick={onSelect}
						/>
					))}
			</SimpleScrollbar>
			<MenuToggler
				arrowIcon
				className={clsx({ "text-white:88 !hover:text-white": inverted })}
			/>
		</div>
	);
});

export default FirstLevelMenu;
