import { Dropdown, type MenuProps } from "antd";
import type React from "react";

interface ContextMenuProps {
	active: boolean;
	children: React.ReactNode;
	darkMode: boolean;
	disabledKeys?: App.Global.DropdownKey[];
	excludeKeys?: App.Global.DropdownKey[];
	mode: UnionKey.ThemeTabMode;
	tabId: string;
}

interface DropdownOption {
	disabled?: boolean;
	icon: string;
	key: App.Global.DropdownKey;
	label: string;
}

function getMenu(options: DropdownOption[]) {
	const items: MenuProps["items"] = options.map((opt) => ({
		disabled: opt.disabled,
		icon: (
			<SvgIcon
				className="text-icon"
				icon={opt.icon}
			/>
		),
		key: opt.key,
		label: opt.label,
	}));
	return items;
}

const ContextMenu = ({
	children,
	disabledKeys = [],
	excludeKeys = [],
	tabId,
}: ContextMenuProps) => {
	const { clearLeftTabs, clearRightTabs, closeAllTabs, closeCurrentTab, closeOtherTabs } =
		useTabController();
	const options = () => {
		const opts: DropdownOption[] = [
			{
				icon: "ant-design:close-outlined",
				key: "closeCurrent",
				label: "关闭",
			},
			{
				icon: "ant-design:column-width-outlined",
				key: "closeOther",
				label: "关闭其他",
			},
			{
				icon: "mdi:format-horizontal-align-left",
				key: "closeLeft",
				label: "关闭左侧",
			},
			{
				icon: "mdi:format-horizontal-align-right",
				key: "closeRight",
				label: "关闭右侧",
			},
			{
				icon: "ant-design:line-outlined",
				key: "closeAll",
				label: "关闭所有",
			},
		];

		return opts
			.filter((opt) => !excludeKeys.includes(opt.key))
			.map((opt) => {
				if (disabledKeys.includes(opt.key)) {
					opt.disabled = true;
				}
				return opt;
			});
	};

	const menu = getMenu(options());

	const dropdownAction: Record<App.Global.DropdownKey, () => void> = {
		closeAll() {
			closeAllTabs();
		},
		closeCurrent() {
			closeCurrentTab(tabId);
		},
		closeLeft() {
			clearLeftTabs(tabId);
		},
		closeOther() {
			closeOtherTabs(tabId);
		},
		closeRight() {
			clearRightTabs(tabId);
		},
	};
	const handleClick: MenuProps["onClick"] = (e) => {
		dropdownAction[e.key as App.Global.DropdownKey]();
	};

	return (
		<Dropdown
			menu={{
				items: menu,
				onClick: handleClick,
			}}
			trigger={["contextMenu"]}
		>
			{children}
		</Dropdown>
	);
};

export default ContextMenu;
