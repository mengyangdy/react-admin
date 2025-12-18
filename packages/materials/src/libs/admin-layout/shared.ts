import type { AdminLayoutProps, LayoutCssVars, LayoutCssVarsProps } from "../../types";

export const LAYOUT_MAX_Z_INDEX = 100;

export const LAYOUT_SCROLL_EL_ID = "__SCROLL_EL_ID__";

export function createLayoutCssVars(
	props: Required<
		Pick<
			AdminLayoutProps,
			| "footerHeight"
			| "headerHeight"
			| "maxZIndex"
			| "mode"
			| "siderCollapsedWidth"
			| "siderWidth"
			| "tabHeight"
		>
	> &
		Partial<Pick<AdminLayoutProps, "isMobile">>,
) {
	const {
		footerHeight,
		headerHeight,
		isMobile,
		maxZIndex,
		mode,
		siderCollapsedWidth,
		siderWidth,
		tabHeight,
	} = props;

	const headerZIndex = maxZIndex - 3;
	const tabZIndex = maxZIndex - 5;
	const siderZIndex = mode === "vertical" || isMobile ? maxZIndex - 1 : maxZIndex - 4;
	const mobileSiderZIndex = isMobile ? maxZIndex - 2 : 0;
	const footerZIndex = maxZIndex - 5;

	const cssProps: LayoutCssVarsProps = {
		footerHeight,
		footerZIndex,
		headerHeight,
		headerZIndex,
		mobileSiderZIndex,
		siderCollapsedWidth,
		siderWidth,
		siderZIndex,
		tabHeight,
		tabZIndex,
	};

	return createLayoutCssVarsByCssVarsProps(cssProps);
}

function createLayoutCssVarsByCssVarsProps(props: LayoutCssVarsProps) {
	const cssVars: LayoutCssVars = {
		"--dy-footer-height": `${props.footerHeight}px`,
		"--dy-footer-z-index": props.footerZIndex,
		"--dy-header-height": `${props.headerHeight}px`,
		"--dy-header-z-index": props.headerZIndex,
		"--dy-mobile-sider-z-index": props.mobileSiderZIndex,
		"--dy-sider-collapsed-width": `${props.siderCollapsedWidth}px`,
		"--dy-sider-width": `${props.siderWidth}px`,
		"--dy-sider-z-index": props.siderZIndex,
		"--dy-tab-height": `${props.tabHeight}px`,
		"--dy-tab-z-index": props.tabZIndex,
	};

	return cssVars;
}
