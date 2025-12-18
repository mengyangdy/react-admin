import { useStore } from "@tanstack/react-store";
import type { TooltipProps } from "antd";
import { Tooltip } from "antd";
import clsx from "clsx";
import type { FC, ReactNode } from "react";

import { themeLayoutModeRecord } from "@/constants/app";
import { themeActions, themeStore } from "@/store/theme";

type LayoutConfig = Record<
  UnionKey.ThemeLayoutMode,
  {
    headerClass: string;
    mainClass: string;
    menuClass: string;
    placement: TooltipProps["placement"];
  }
>;

const LAYOUT_CONFIG: LayoutConfig = {
  horizontal: {
    headerClass: "",
    mainClass: "w-full h-3/4",
    menuClass: "w-full h-1/4",
    placement: "bottom",
  },
  "horizontal-mix": {
    headerClass: "",
    mainClass: "w-2/3 h-3/4",
    menuClass: "w-full h-1/4",
    placement: "bottom",
  },
  vertical: {
    headerClass: "",
    mainClass: "w-2/3 h-3/4",
    menuClass: "w-1/3 h-full",
    placement: "bottom",
  },
  "vertical-mix": {
    headerClass: "",
    mainClass: "w-2/3 h-3/4",
    menuClass: "w-1/4 h-full",
    placement: "bottom",
  },
};

interface Props extends Record<UnionKey.ThemeLayoutMode, ReactNode> {
  mode: UnionKey.ThemeLayoutMode;
}

const LayoutModeCard: FC<Props> = ({ mode, ...rest }) => {
  const isMobile = useStore(themeStore, (s) => s.isMobile);
  function handleChangeMode(modeType: UnionKey.ThemeLayoutMode) {
    if (isMobile) return;
    themeActions.setLayoutMode(modeType);
  }

  return (
    <div className="flex-center flex-wrap gap-x-32px gap-y-16px">
      {Object.entries(LAYOUT_CONFIG).map(([key, item]) => (
        <div
          key={key}
          className={clsx(
            "flex cursor-pointer border-2px rounded-6px hover:border-primary",
            mode === key ? "border-primary" : "border-transparent"
          )}
          onClick={() => handleChangeMode(key as UnionKey.ThemeLayoutMode)}
        >
          <Tooltip
            placement={item.placement}
            title={themeLayoutModeRecord[key as UnionKey.ThemeLayoutMode]}
          >
            <div
              className={clsx(
                "h-64px w-96px gap-6px rd-4px p-6px shadow dark:shadow-coolGray-5",
                key.includes("vertical") ? "flex" : "flex-col"
              )}
            >
              {rest[key as UnionKey.ThemeLayoutMode]}
            </div>
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

export default LayoutModeCard;
