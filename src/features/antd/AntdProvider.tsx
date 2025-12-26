import { useStore } from "@tanstack/react-store";
import { ConfigProvider, Watermark } from "antd";
import zhCN from "antd/locale/zh_CN";
import type { PropsWithChildren } from "react";

import AppContextHolder from "@/features/antd/AntdContextHolder.tsx";
import { getAntdTheme } from "@/features/antd/shared.ts";
import { themeStore, useThemeColors, useThemeSettings } from "@/store/theme";
import {
  setupThemeVarsToHtml,
  toggleAuxiliaryColorModes,
  toggleGrayscaleMode,
} from "@/store/theme/shared.ts";
import { localStg } from "@/utils/storage.ts";

function AntdProvider({ children }: PropsWithChildren) {
  const themeSettings = useThemeSettings();
  const colors = useThemeColors();
  const darkMode = useStore(themeStore, (s) => s.darkMode);
  const antdTheme = getAntdTheme(colors, darkMode, themeSettings.tokens);
  useEffect(() => {
    setupThemeVarsToHtml(
      colors,
      themeSettings.tokens,
      themeSettings.recommendColor
    );
    localStg.set("themeColor", colors.primary);
    toggleAuxiliaryColorModes(themeSettings.colourWeakness);
    toggleGrayscaleMode(themeSettings.grayscale);
  }, [colors, themeSettings]);

  return (
    <ConfigProvider
      button={{ classNames: { icon: "align-1px text-icon" } }}
      card={{
        styles: {
          body: {
            flex: 1,
            overflow: "hidden",
            padding: "12px 16px",
          },
        },
      }}
      theme={antdTheme}
      locale={zhCN}
    >
      <Watermark
        className="h-full"
        content={
          themeSettings.watermark.visible ? themeSettings.watermark.text : ""
        }
      >
        <AppContextHolder>{children}</AppContextHolder>
      </Watermark>
    </ConfigProvider>
  );
}

export default AntdProvider;
