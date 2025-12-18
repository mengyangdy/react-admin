import type React from "react";

interface AdminLayoutHeaderConfig {
	/**
	 * @default ''
	 */
	headerClass?: string;
	/**
	 * @default 56px
	 */
	headerHeight?: number;
	/**
	 * @default true
	 */
	headerVisible?: boolean;
}

interface AdminLayoutTabConfig {
	tabClass?: string;
	tabHeight?: number;
	tabVisible?: boolean;
	updateSiderCollapse: () => void;
}

interface AdminLayoutSiderConfig {
	mobileSiderClass?: string;
	siderClass?: string;
	siderCollapse?: boolean;
	siderCollapsedWidth?: number;
	siderVisible?: boolean;
	siderWidth?: number;
}

interface AdminLayoutContentConfig {
	contentClass?: string;
	fullContent?: boolean;
}

interface AdminLayoutFooterConfig {
	fixedFooter?: boolean;
	footerClass?: string;
	footerHeight?: number;
	footerVisible?: boolean;
	rightFooter?: boolean;
}

export type LayoutMode = "horizontal" | "vertical";

export type LayoutScrollMode = "content" | "wrapper";

export type Slots = {
	/** Main */
	children?: React.ReactNode;
	/** Footer */
	Footer?: React.ReactNode;
	/** Header */
	Header?: React.ReactNode;
	/** Sider */
	Sider?: React.ReactNode;
	/** Tab */
	Tab?: React.ReactNode;
};

export interface AdminLayoutProps
	extends AdminLayoutHeaderConfig,
		AdminLayoutTabConfig,
		AdminLayoutSiderConfig,
		AdminLayoutContentConfig,
		AdminLayoutFooterConfig,
		Slots {
	commonClass?: string;
	fixedTop?: boolean;
	isMobile?: boolean;
	maxZIndex?: number;
	mode?: LayoutMode;
	scrollElClass?: string;
	scrollElId?: string;
	scrollMode?: LayoutScrollMode;
	scrollWrapperClass?: string;
}

export type LayoutCssVarsProps = Pick<
	AdminLayoutProps,
	"footerHeight" | "headerHeight" | "siderCollapsedWidth" | "siderWidth" | "tabHeight"
> & {
	footerZIndex?: number;
	headerZIndex?: number;
	mobileSiderZIndex?: number;
	siderZIndex?: number;
	tabZIndex?: number;
};

type Prefix = "--dy-";

type KebabCase<S extends string> = S extends `${infer Start}${infer End}`
	? `${Uncapitalize<Start>}${KebabCase<Kebab<End>>}`
	: S;

export type LayoutCssVars = {
	[K in keyof LayoutCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};

type Kebab<S extends string> = S extends Uncapitalize<S> ? S : `-${Uncapitalize<S>}`;

export type PageTabMode = "button" | "chrome" | "slider";
export interface PageTabProps {
	/** Whether the tab is active */
	active?: boolean;

	/** The color of the active tab */
	activeColor?: string;
	/** The class of the button tab */
	buttonClass?: string;
	/** The class of the chrome tab */
	chromeClass?: string;
	className?: string;
	/**
	 * Whether the tab is closable
	 *
	 * Show the close icon when true
	 */
	closable?: boolean;
	/**
	 * The common class of the layout
	 *
	 * Is can be used to configure the transition animation
	 *
	 * @default 'transition-all-300'
	 */
	commonClass?: string;
	/** Whether is dark mode */
	darkMode?: boolean;
	handleClose?: () => void;
	/**
	 * The mode of the tab
	 *
	 * - {@link TabMode}
	 */
	mode?: PageTabMode;
	onClick: () => void;
	prefix: React.ReactNode;
	/** The class of the slider tab */
	sliderClass?: string;
	style?: React.CSSProperties;
	suffix?: React.ReactNode;
}
export type ButtonTabProps = PageTabProps &
	Omit<React.ComponentProps<"div">, "className" | "onClick" | "prefix" | "style">;

export type PageTabCssVarsProps = {
	primaryColor: string;
	primaryColor1: string;
	primaryColor2: string;
	primaryColorOpacity1: string;
	primaryColorOpacity2: string;
	primaryColorOpacity3: string;
};

export type PageTabCssVars = {
	[K in keyof PageTabCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};
