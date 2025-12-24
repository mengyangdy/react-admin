declare namespace App {
	namespace Theme {
		type ColorPaletteNumber = import("@dylanjs/utils").ColorPaletteNumber;
		interface ThemeSetting {
			colourWeakness: boolean;
			fixedHeaderAndTab: boolean;
			footer: {
				fixed: boolean;
				height: number;
				right: boolean;
				visible: boolean;
			};
			grayscale: boolean;
			header: {
				/** 头部面包屑 */
				breadcrumb: {
					/** 是否显示面包屑图标 */
					showIcon: boolean;
					/** 是否显示面包屑 */
					visible: boolean;
				};
				/** 头部高度 */
				height: number;
			};
			/** 信息色是否跟随主色 */
			isInfoFollowPrimary: boolean;
			/** 布局为 vertical-mix / horizontal-mix 时仅展开当前父级菜单 */
			isOnlyExpandCurrentParentMenu: boolean;
			/** 布局 */
			layout: {
				/** 布局模式 */
				mode: UnionKey.ThemeLayoutMode;
				/**
				 * 是否反转横向混合布局
				 *
				 * 为 true 时：左侧显示垂直子级菜单，顶部显示横向一级菜单
				 */
				reverseHorizontalMix: boolean;
				/** 滚动模式 */
				scrollMode: UnionKey.ThemeScrollMode;
			};
			/** 其他颜色 */
			otherColor: OtherColor;
			page: {
				/** 是否启用页面过渡动画 */
				animate: boolean;
				/** 页面过渡动画模式 */
				animateMode: UnionKey.ThemePageAnimateMode;
			};
			/** 是否开启推荐色 */
			recommendColor: boolean;
			/** 侧边栏 */
			sider: {
				/** 侧边栏折叠宽度 */
				collapsedWidth: number;
				/** 侧边栏反色 */
				inverted: boolean;
				/** vertical-mix / horizontal-mix 时子菜单宽度 */
				mixChildMenuWidth: number;
				/** vertical-mix / horizontal-mix 时折叠宽度 */
				mixCollapsedWidth: number;
				/** vertical-mix / horizontal-mix 时侧边栏宽度 */
				mixWidth: number;
				/** 侧边栏宽度 */
				width: number;
			};
			tab: {
				/**
				 * 是否缓存标签页
				 *
				 * 如果启用缓存 当页面刷新时,标签页将从本地存储中恢复
				 */
				cache: boolean;
				/** 标签页高度 */
				height: number;
				/** 标签页模式 */
				mode: UnionKey.ThemeTabMode;
				/** 是否显示标签页 */
				visible: boolean;
			};
			/** 主题色 */
			themeColor: string;
			/** 主题模式 */
			themeScheme: UnionKey.ThemeScheme;
			/** 主题 Token 配置（会转换为 CSS 变量） */
			tokens: {
				dark?: {
					[K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>;
				};
				light: ThemeSettingToken;
			};
			/** 水印 */
			watermark: {
				/** 水印文本 */
				text: string;
				/** 是否显示水印 */
				visible: boolean;
			};
		}

		interface OtherColor {
			error: string;
			info: string;
			success: string;
			warning: string;
		}
		interface ThemeColor extends OtherColor {
			primary: string;
		}
		type ThemeColorKey = keyof ThemeColor;
		type ThemePaletteColor = {
			[key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
		};
		type BaseToken = Record<string, Record<string, string>>;
		interface ThemeSettingTokenColor {
			"base-text": string;
			container: string;
			inverted: string;
			layout: string;
			/** the progress bar color, if not set, will use the primary color */
			nprogress?: string;
		}

		interface ThemeSettingTokenBoxShadow {
			header: string;
			sider: string;
			tab: string;
		}

		interface ThemeSettingToken {
			boxShadow: ThemeSettingTokenBoxShadow;
			colors: ThemeSettingTokenColor;
		}

		type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor;

		/** 主题 Token 生成的 CSS 变量 */
		type ThemeTokenCSSVars = {
			boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string };
			colors: ThemeTokenColor & { [key: string]: string };
		};
	}

	namespace Global {
		interface HeaderProps {
			/** 是否显示 Logo */
			showLogo?: boolean;
			/** 是否显示菜单 */
			showMenu?: boolean;
			/** 是否显示菜单折叠按钮 */
			showMenuToggler?: boolean;
		}

		interface IconProps {
			className?: string;
			/** Iconify 图标名 */
			icon?: string;
			/** 本地图标名 */
			localIcon?: string;
			style?: React.CSSProperties;
		}

		/** 全局菜单 */
		interface Menu {
			/** 子菜单 */
			children?: Menu[];
			/** 菜单图标 */
			icon?: React.ReactElement;
			/**
			 * 菜单 key
			 *
			 * 等于路由 key
			 */
			key: string;
			/** 菜单名称 */
			label: React.ReactNode;
			/** Tooltip 文本 */
			title?: string;
		}

		type Breadcrumb = Omit<Menu, "children"> & {
			options?: Breadcrumb[];
		};

		/** 标签页对应的路由 */
		type TabRoute = Router.Route;

		/** 全局标签页 */
		type Tab = {
			/** 标签页固定索引 */
			fixedIndex?: number | null;
			/** 标签页的完整路径 */
			fullPath: string;
			/**
			 * 标签页图标
			 *
			 * Iconify 图标
			 */
			icon?: string;
			/** 标签页 id */
			id: string;
			/** 是否 keepAlive */
			keepAlive: boolean;
			/** 标签页标题 */
			label: string;
			/**
			 * 标签页本地图标
			 *
			 * Local icon
			 */
			localIcon?: string;
			/**
			 * 替换后的标签名
			 *
			 * 如果设置，显示为新标签名
			 */
			newLabel?: string;
			/**
			 * 原始标签名
			 *
			 * 重置时会回退到该值
			 */
			oldLabel?: string | null;
			/** 标签页对应的路由 key */
			routeKey: LastLevelRouteKey;
			/** 标签页对应的路由路径 */
			routePath: RouteMap[LastLevelRouteKey];
		};

		/** 表单校验规则 */
		type FormRule = import("antd").FormRule;

		/** 全局下拉枚举 */
		type DropdownKey = "closeAll" | "closeCurrent" | "closeLeft" | "closeOther" | "closeRight";
	}

	namespace Service {
    /** Other baseURL key */
    type OtherBaseURLKey = 'demo';

    interface ServiceConfigItem {
      /** The backend service base url */
      baseURL: string;
      /** The proxy pattern of the backend service base url */
      proxyPattern: string;
    }

    interface OtherServiceConfigItem extends ServiceConfigItem {
      key: OtherBaseURLKey;
    }

    /** The backend service config */
    interface ServiceConfig extends ServiceConfigItem {
      /** Other backend service config */
      other: OtherServiceConfigItem[];
    }

    interface SimpleServiceConfig extends Pick<ServiceConfigItem, 'baseURL'> {
      other: Record<OtherBaseURLKey, string>;
    }

    /** The backend service response data */
    type Response<T = unknown> = {
      /** The backend service response code */
      code: string;
      /** The backend service response data */
      data: T;
      /** The backend service response message */
      msg: string;
    };

    /** The demo backend service response data */
    type DemoResponse<T = unknown> = {
      /** The backend service response message */
      message: string;
      /** The backend service response data */
      result: T;
      /** The backend service response code */
      status: string;
    };
  }
}
