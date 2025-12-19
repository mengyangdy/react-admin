import { Switch } from "antd";

import SettingItem from "@/layouts/base-layout/modules/theme-drawer/components/SettingItem.tsx";
import ThemeSchemaSegmented from "@/layouts/base-layout/modules/theme-drawer/components/ThemeSchemaSegmented.tsx";
import { themeActions, useThemeSettings } from "@/store/theme";

const DarkMode = () => {
	const themeSettings = useThemeSettings();

	function handleGrayscaleChange(payload: boolean) {
		themeActions.setGrayscale(payload);
	}
	function handleAuxiliaryColorChange(value: boolean) {
		themeActions.setColourWeakness(value);
	}

	function handleIsOnlyExpandCurrentParentMenuChange(value: boolean) {
		themeActions.setIsOnlyExpandCurrentParentMenu(value);
	}

	return (
		<div className="flex-col-stretch gap-16px">
			<div className="i-flex-center">
				<ThemeSchemaSegmented />
			</div>
			<SettingItem label="灰度模式">
				<Switch
					checked={themeSettings.grayscale}
					onChange={handleGrayscaleChange}
				/>
			</SettingItem>
			<SettingItem label="色弱模式">
				<Switch
					checked={themeSettings.colourWeakness}
					onChange={handleAuxiliaryColorChange}
				/>
			</SettingItem>
			<SettingItem label="仅展开当前父级菜单">
				<Switch
					checked={themeSettings.isOnlyExpandCurrentParentMenu}
					onChange={handleIsOnlyExpandCurrentParentMenuChange}
				/>
			</SettingItem>
		</div>
	);
};

export default DarkMode;
