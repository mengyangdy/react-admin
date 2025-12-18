import { transformRecordToOption } from "@/utils/common";

export const GLOBAL_HEADER_MENU_ID = "__GLOBAL_HEADER_MENU__";

export const GLOBAL_SIDER_MENU_ID = "__GLOBAL_SIDER_MENU__";

export const themeLayoutModeRecord: Record<UnionKey.ThemeLayoutMode, string> = {
	horizontal: "横向布局",
	"horizontal-mix": "横向混合",
	vertical: "纵向布局",
	"vertical-mix": "纵向混合",
};

export const themeScrollModeRecord: Record<UnionKey.ThemeScrollMode, string> = {
	content: "内容滚动",
	wrapper: "容器滚动",
};

export const themeScrollModeOptions = transformRecordToOption(themeScrollModeRecord);

export const themePageAnimationModeRecord: Record<UnionKey.ThemePageAnimateMode, string> = {
	fade: "淡入淡出",
	"fade-bottom": "自下淡入",
	"fade-scale": "缩放淡入",
	"fade-slide": "滑入淡出",
	none: "无",
	"zoom-fade": "缩放渐变",
	"zoom-out": "缩放退出",
};

export const themePageAnimationModeOptions = transformRecordToOption(themePageAnimationModeRecord);

export const themeTabModeRecord: Record<UnionKey.ThemeTabMode, string> = {
	button: "按钮",
	chrome: "Chrome",
	slider: "滑块",
};

export const themeTabModeOptions = transformRecordToOption(themeTabModeRecord);
