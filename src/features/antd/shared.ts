import { transformColorWithOpacity } from "@dy/color";
import type { ConfigProviderProps } from "antd";
import { theme as antdTheme } from "antd";

/**
 * Get antd theme
 *
 * @param colors Theme colors
 * @param darkMode Is dark mode
 */
export function getAntdTheme(
	colors: App.Theme.ThemeColor,
	darkMode: boolean,
	tokens: App.Theme.ThemeSetting["tokens"],
) {
	const { darkAlgorithm, defaultAlgorithm } = antdTheme;

	const { error, info, primary, success, warning } = colors;

	const bgColor = transformColorWithOpacity(
		primary,
		darkMode ? 0.3 : 0.1,
		darkMode ? "#000000" : "#fff",
	);
	const containerBgColor = darkMode
		? tokens.dark?.colors?.container
		: tokens.light?.colors.container;

	const theme: ConfigProviderProps["theme"] = {
		algorithm: [darkMode ? darkAlgorithm : defaultAlgorithm],
		components: {
			Button: {
				controlHeightSM: 28,
			},
			Collapse: {
				contentPadding: "16px 16px 24px 16px",
				headerBg: containerBgColor,
			},
			Menu: {
				darkItemBg: "transparent",
				darkSubMenuItemBg: "transparent",
				itemMarginInline: 8,
				itemSelectedBg: bgColor,
				subMenuItemBg: "transparent",
			},
		},
		// cssVar: true,
		token: {
			colorBgContainer: containerBgColor,
			colorError: error,
			colorInfo: info,
			colorPrimary: primary,
			colorSuccess: success,
			colorWarning: warning,
		},
	};

	return theme;
}
