import { getPaletteColorByNumber } from "@dy/color";
import { useStore } from "@tanstack/react-store"; // 新增
import { Store } from "@tanstack/store";
import { ThemeMode, type ThemeModeType } from "ahooks/lib/useTheme";
import { produce } from "immer";
import { createSelector } from "reselect"; // 新增

import { globalConfig } from "@/config.ts";
import { DARK_CLASS } from "@/constants/common.ts";
import { initThemeSettings } from "@/store/theme/shared.ts";
import { themeSettings } from "@/theme/settings.ts";
import { localStg } from "@/utils/storage.ts";

const DARK_MODE_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getSystemDarkMode(fallback = globalConfig.defaultDarkMode) {
	if (typeof window === "undefined" || !window.matchMedia) return fallback;
	return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches;
}

function applyCssDarkMode(darkMode: boolean) {
	if (typeof document === "undefined") return;
	const htmlElementClassList = document.documentElement.classList;
	if (darkMode) htmlElementClassList.add(DARK_CLASS);
	else htmlElementClassList.remove(DARK_CLASS);
}

// 保存初始状态，用于重置
const getInitialState = () => {
	const savedScheme = localStg.get("themeScheme") || themeSettings.themeScheme;
	const scheme: ThemeModeType =
		savedScheme === "dark" || savedScheme === "light" || savedScheme === "system"
			? savedScheme
			: themeSettings.themeScheme;
	const resolvedDarkMode = scheme === "system" ? getSystemDarkMode() : scheme === "dark";
	return {
		themeSettings: initThemeSettings(),
		siderCollapse: false,
		fullContent: false,
		mixSiderFixed: false,
		darkMode: resolvedDarkMode,
		themeDrawerVisible: false,
		themeScheme: scheme,
		isMobile: false,
	};
};

export type ThemeState = ReturnType<typeof getInitialState>;

export const themeStore = new Store<ThemeState>(getInitialState());

// 基础选择器 selector

const selectThemeState = (state: ThemeState) => state;

export const useThemeState = () => useStore(themeStore, selectThemeState);

// 从 store 中获取 themeSettings
const selectThemeSettings = (state: ThemeState) => state.themeSettings;

// 非react和js中使用 不需要订阅变化
export const getThemeSettings = selectThemeSettings;

/**
 * Hook: 获取 themeSettings（订阅 store 变化）
 */
export const useThemeSettings = () => useStore(themeStore, selectThemeSettings);

const selectIsMobile=(state:ThemeState)=>state.isMobile
export const useGetIsMobile = () => useStore(themeStore, selectIsMobile);

// 主题颜色选择器：从 themeSettings 中提取并处理颜色
const themeColorsSelector = createSelector(
	[selectThemeSettings],
	({ isInfoFollowPrimary, otherColor, themeColor }) => {
		// 这里如果你的 App.Theme.ThemeColor 类型定义在全局，可以直接用
		// 如果没有，可以去掉显式类型声明，让 TS 自动推导
		return {
			primary: themeColor,
			...otherColor,
			info: isInfoFollowPrimary ? themeColor : otherColor.info,
		};
	},
);

// 主题设置 JSON 字符串选择器：将 themeSettings 转换为 JSON 字符串
// 用途：导出配置、保存到 localStorage、发送到服务器、调试等
export const settingsJson = createSelector([selectThemeSettings], (settings) => {
	return JSON.stringify(settings, null, 2); // 第三个参数 2 表示格式化缩进
});

export const useThemeColors = () => useStore(themeStore, themeColorsSelector);

/**
 * Hook: 获取主题设置的 JSON 字符串
 * @returns 格式化后的 JSON 字符串
 */
export const useThemeSettingsJson = () => useStore(themeStore, settingsJson);

export const themeActions = {
	toggleSiderCollapse() {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.siderCollapse = !draft.siderCollapse;
			}),
		);
	},
	closeThemeDrawer() {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeDrawerVisible = false;
			}),
		);
	},
	openThemeDrawer() {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeDrawerVisible = true;
			}),
		);
	},
	toggleThemeScheme() {
		const themeModes = Object.values(ThemeMode) as ThemeModeType[];
		const currentScheme = themeStore.state.themeScheme as ThemeModeType;
		const index = themeModes.indexOf(currentScheme);
		const nextIndex = index === themeModes.length - 1 ? 0 : index + 1;
		themeActions.setThemeScheme(themeModes[nextIndex]);
	},
	setThemeScheme(mode: ThemeModeType) {
		const resolvedDarkMode = mode === "system" ? getSystemDarkMode() : mode === "dark";
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeScheme = mode;
				draft.darkMode = resolvedDarkMode;
			}),
		);
		localStg.set("themeScheme", mode);
		applyCssDarkMode(resolvedDarkMode);
		localStg.set("darkMode", resolvedDarkMode);
	},
	/** 只更新暗黑开关（不改变 themeScheme），给 system 模式监听用 */
	setDarkMode(darkMode: boolean) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.darkMode = darkMode;
			}),
		);
		applyCssDarkMode(darkMode);
		localStg.set("darkMode", darkMode);
	},
	toggleCssDarkMode(darkMode = false) {
		applyCssDarkMode(darkMode);
	},
	setLayoutMode(modeType: UnionKey.ThemeLayoutMode) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.layout.mode = modeType;
			}),
		);
	},
	changeReverseHorizontalMix(payload: boolean) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.layout.reverseHorizontalMix = payload;
			}),
		);
	},
	setFullContent() {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.fullContent = !draft.fullContent;
			}),
		);
	},
	setIsMobile(payload: boolean) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.isMobile = payload;
			}),
		);
	},
	setGrayscale(payload: boolean) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.grayscale = payload;
			}),
		);
	},
	setColourWeakness(payload: boolean) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.colourWeakness = payload;
			}),
		);
	},
	updateThemeColors({ color, key }: { color: string; key: App.Theme.ThemeColorKey }) {
		let colorValue = color;

		if (themeStore.state.themeSettings.recommendColor) {
			colorValue = getPaletteColorByNumber(color, 500, true);
		}

		if (key === "primary") {
			themeStore.setState((prev) =>
				produce(prev, (draft) => {
					draft.themeSettings.themeColor = colorValue;
				}),
			);
		} else {
			themeStore.setState((prev) =>
				produce(prev, (draft) => {
					draft.themeSettings.otherColor[key] = colorValue;
				}),
			);
		}
	},

	setLayoutScrollMode(payload: UnionKey.ThemeScrollMode) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.layout.scrollMode = payload;
			}),
		);
	},
	setPage(payload: Partial<App.Theme.ThemeSetting["page"]>) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.page = Object.assign(draft.themeSettings.page, payload);
			}),
		);
	},
	setIsInfoFollowPrimary(payload: boolean) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.isInfoFollowPrimary = payload;
			}),
		);
	},
	setIsOnlyExpandCurrentParentMenu(payload: boolean) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.isOnlyExpandCurrentParentMenu = payload;
			}),
		);
	},
	setRecommendColor(payload: boolean) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.recommendColor = payload;
			}),
		);
	},
	setFixedHeaderAndTab(payload: boolean) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.fixedHeaderAndTab = payload;
			}),
		);
	},
	setHeader(payload: Partial<App.Theme.ThemeSetting["header"]>) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.header = Object.assign(draft.themeSettings.header, payload);
			}),
		);
	},
	setTab(payload: Partial<App.Theme.ThemeSetting["tab"]>) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.tab = Object.assign(draft.themeSettings.tab, payload);
			}),
		);
	},
	setSider(payload: Partial<App.Theme.ThemeSetting["sider"]>) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.sider = Object.assign(draft.themeSettings.sider, payload);
			}),
		);
	},
	setFooter(payload: Partial<App.Theme.ThemeSetting["footer"]>) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.footer = Object.assign(draft.themeSettings.footer, payload);
			}),
		);
	},
	setWatermark(payload: Partial<NonNullable<App.Theme.ThemeSetting["watermark"]>>) {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.themeSettings.watermark = Object.assign(draft.themeSettings.watermark, payload);
			}),
		);
	},
	/**
	 * 重置 themeStore 到初始状态
	 */
	resetThemeStore() {
		themeStore.setState(() => getInitialState());
	},
	/**
	 * 缓存主题设置到 localStorage
	 * 仅在非开发环境下执行，开发环境下不缓存
	 */
	cacheThemeSettings() {
		if (globalConfig.isDev) return;
		// 获取当前主题设置并保存到 localStorage
		const currentSettings = getThemeSettings(themeStore.state);
		localStg.set("themeSettings", currentSettings);
	},
	toggleMixSiderFixed() {
		themeStore.setState((prev) =>
			produce(prev, (draft) => {
				draft.mixSiderFixed = !draft.mixSiderFixed;
			}),
		);
	},
};

// 初始化时同步一次 html dark class，避免首屏闪烁
applyCssDarkMode(themeStore.state.darkMode);
