import { Button, Switch, Tooltip } from "antd";

import { themeActions, useThemeColors, useThemeSettings } from "@/store/theme";

import CustomPicker from "../components/CustomPicker";
import SettingItem from "../components/SettingItem";

const THEME_COLOR_ITEMS: { key: App.Theme.ThemeColorKey; label: string }[] = [
	{ key: "primary", label: "主色" },
	{ key: "error", label: "错误色" },
	{ key: "info", label: "信息色" },
	{ key: "success", label: "成功色" },
	{ key: "warning", label: "警告色" },
];

const ThemeColor = () => {
	const themeSettings = useThemeSettings();
	// 使用 createSelector 创建的计算属性选择器
	const colors = useThemeColors();

	function handleRecommendColorChange(value: boolean) {
		themeActions.setRecommendColor(value);
	}

	return (
		<div className="flex-col-stretch gap-12px">
			<Tooltip
				placement="topLeft"
				title={
					<p>
						<span className="pr-12px">推荐颜色的算法参照</span>
						<br />
						<Button
							className="text-gray"
							href="https://uicolors.app/create"
							rel="noopener noreferrer"
							target="_blank"
							type="link"
						>
							https://uicolors.app/create
						</Button>
					</p>
				}
			>
				<div>
					<SettingItem
						key="recommend-color"
						label="应用推荐算法的颜色"
					>
						<Switch
							checked={themeSettings.recommendColor}
							onChange={handleRecommendColorChange}
						/>
					</SettingItem>
				</div>
			</Tooltip>
			{THEME_COLOR_ITEMS.map(({ key, label }) => (
				<CustomPicker
					colorKey={key}
					isInfoFollowPrimary={themeSettings.isInfoFollowPrimary}
					key={key}
					label={label}
					value={colors[key]}
				/>
			))}
		</div>
	);
};

export default ThemeColor;
