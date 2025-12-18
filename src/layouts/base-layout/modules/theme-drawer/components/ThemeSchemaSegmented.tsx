import { useStore } from "@tanstack/react-store";
import { ThemeMode, type ThemeModeType } from "ahooks/lib/useTheme";
import { Segmented } from "antd";

import { icons } from "@/layouts/base-layout/modules/global-header/components/ThemeSchemaSwitch";
import { themeActions, themeStore } from "@/store/theme";

const OPTIONS = Object.values(ThemeMode).map((item) => {
  const key = item as ThemeModeType;
  return {
    label: (
      <div className="w-[70px] flex justify-center">
        <SvgIcon className="h-28px text-icon-small" icon={icons[key]} />
      </div>
    ),
    value: item,
  };
});

const ThemeSchemaSegmented = () => {
  const themeScheme = useStore(themeStore, (s) => s.themeScheme);
  return (
    <Segmented
      className="bg-layout"
      options={OPTIONS}
      value={themeScheme}
      onChange={themeActions.setThemeScheme}
    />
  );
};
export default ThemeSchemaSegmented;
