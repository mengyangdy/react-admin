import { Switch } from "antd";
import clsx from "clsx";
import type { ReactNode } from "react";
import { memo } from "react";

import { themeActions, useThemeSettings } from "@/store/theme";

import LayoutModeCard from "../components/LayoutModeCard";
import SettingItem from "../components/SettingItem";
import style from "./layoutMode.module.scss";

const LAYOUTS_COMPONENTS: Record<UnionKey.ThemeLayoutMode, ReactNode> = {
  horizontal: (
    <>
      <div className={style["layout-header"]} />
      <div className={style["horizontal-wrapper"]}>
        <div className={style["layout-main"]} />
      </div>
    </>
  ),
  "horizontal-mix": (
    <>
      <div className={style["layout-header"]} />
      <div className={style["horizontal-wrapper"]}>
        <div className={clsx("w-18px", style["layout-sider"])} />
        <div className={style["layout-main"]} />
      </div>
    </>
  ),
  vertical: (
    <>
      <div className={clsx("h-full w-18px", style["layout-sider"])} />
      <div className={style["vertical-wrapper"]}>
        <div className={style["layout-header"]} />
        <div className={style["layout-main"]} />
      </div>
    </>
  ),
  "vertical-mix": (
    <>
      <div className={clsx("h-full w-8px", style["layout-sider"])} />
      <div className={clsx("h-full w-16px", style["layout-sider"])} />
      <div className={style["vertical-wrapper"]}>
        <div className={style["layout-header"]} />
        <div className={style["layout-main"]} />
      </div>
    </>
  ),
};

const LayoutMode = memo(() => {
  const themeSettings = useThemeSettings();
  function toggleReverseHorizontalMix(checked: boolean) {
    themeActions.changeReverseHorizontalMix(checked);
  }

  return (
    <>
      <LayoutModeCard
        mode={themeSettings.layout.mode}
        {...LAYOUTS_COMPONENTS}
      />
      <SettingItem
        className="mt-16px"
        label="一级菜单与子级菜单位置反转"
        show={themeSettings.layout.mode === "horizontal-mix"}
      >
        <Switch
          checked={themeSettings.layout.reverseHorizontalMix}
          onChange={toggleReverseHorizontalMix}
        />
      </SettingItem>
    </>
  );
});

export default LayoutMode;
