import "@tanstack/react-router";

import type { MenuProps } from "antd";
import React, { type ReactNode } from "react";

import type { App } from "./app";

declare module "@tanstack/react-router" {
	/** 路由静态数据配置 */
	interface StaticDataRouteOption {
		/** 菜单标题 */
		title?: string;
		/** 菜单图标 */
		icon?: ReactNode;
		/**
		 * 本地图标名称
		 */
		localIcon?: string
		/** 是否在菜单隐藏 (例如 login 页或详情页) */
		hideInMenu?: boolean;
		/** 排序权重 */
		order?: number;
		/** 激活的菜单路径（用于详情页等场景） */
		activeMenu?: string;
		/** 是否是常量路由 如果为true不需要登录校验和权限校验 */
		constant?:boolean | null
		/** 固定在标签页中的顺序 */
		fixedIndexInTab?:number | null
		/**
		 * 路由的外部链接地址
		 */
		href?:string | null
		/**
		 * 相同路径不同查询是否共用一个标签页
		 */
		multiTab?:boolean | null
		/**
		 * 查询参数数组
		 */
		query?:{key:string;value:string[]}[] | null
		/**
		 * 可访问路由的角色数组
		 */
		roles?:string[]
		/**
		 * 内嵌外链地址
		 */
		url?:string | null
	}
}

declare global {
	namespace Router {
		/** 路由类型 */
		type Route<
			Q extends Record<string, string> = Record<string, string>,
			P extends Record<string, string | string[]> = Record<string, string | string[]>,
		> = import("@tanstack/react-router").RouteMatch & {
			/** 路由参数 */
			params?: P;
			/** 查询参数 */
			query?: Q;
			/** 完整路径（包含 pathname + search + hash） */
			fullPath?: string;
			/** 匹配的路由链 */
			matched?: Route[];
		};

		/** 路由匹配类型 */
		type RouteMatch = import("@tanstack/react-router").RouteMatch;

		/** Antd 菜单项类型 */
		type AntdMenuItem = Required<MenuProps>["items"][number];

		/** 路由树节点类型 */
		interface RouteTreeNode {
			id: string;
			fullPath: string;
			pathname: string;
			children?: RouteTreeNode[];
			options?: {
				staticData?: {
					title?: string;
					icon?: string | React.ReactNode;
					hideInMenu?: boolean;
					order?: number;
					activeMenu?: string;
				};
			};
		}

		/** 路由树类型 */
		interface RouteTree {
			children?: RouteTreeNode[] | Record<string, unknown>;
		}

		/** 带 staticData 的路由节点类型（用于菜单处理） */
		interface RouteWithStaticData {
			id: string;
			fullPath: string;
			children?: RouteWithStaticData[];
			options?: {
				staticData?: {
					title?: string;
					icon?: string | React.ReactNode;
					hideInMenu?: boolean;
					order?: number;
				};
			};
		}

		/** 菜单层级键值类型 */
		interface LevelKeysProps {
			key?: string;
			children?: LevelKeysProps[];
		}

		/** 路由 Store 状态类型 */
		interface RouterStoreState {
			routeHomePath: string;
			cacheRoutes: string[];
			activeFirstLevelMenuKey: string;
			activeTabId: string;
			removeCacheKey: string | null;
			tabs: App.Global.Tab[];
			allMenus: AntdMenuItem[];
			childLevelMenus: AntdMenuItem[] | undefined;
			firstLevelMenu: Omit<AntdMenuItem, "children">[];
			isActiveFirstLevelMenuHasChildren: boolean;
			selectKey: string[] | undefined;
		}
	}
}
