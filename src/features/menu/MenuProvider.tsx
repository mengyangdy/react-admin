import { useStore } from "@tanstack/react-store";
import type { PropsWithChildren } from "react";
import { useEffect, useMemo } from "react";

import { useCurrentRoute } from "@/hooks/router/useCurrentRoute";
import { useTanstackRouter } from "@/hooks/router/useTanstackRouter";
import { routerStore } from "@/store/router";
import { getLayoutChildrenRoutes } from "@/store/router/shared";

const MenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const { routeTree } = useTanstackRouter();
  const { route } = useCurrentRoute();
  const activeFirstLevelMenuKey = useStore(
    routerStore,
    (s) => s.activeFirstLevelMenuKey
  );

  // 计算并设置所有菜单
  const allMenus = useMemo(
    () => getLayoutChildrenRoutes(routeTree as Router.RouteTree),
    [routeTree]
  );

  useEffect(() => {
    routerStore.setState((prev) => ({
      ...prev,
      allMenus,
    }));
  }, [allMenus]);

  // 设置第一级菜单
  useEffect(() => {
    const firstLevel = allMenus
      .filter(
        (
          menu
        ): menu is Router.AntdMenuItem & { children?: Router.AntdMenuItem[] } =>
          menu !== null
      )
      .map((menu) => {
        const { children: _, ...rest } = menu;
        return rest;
      });
    routerStore.setState((prev) => ({
      ...prev,
      firstLevelMenu: firstLevel,
    }));
  }, [allMenus]);

  // 设置子级菜单
  useEffect(() => {
    const menu = allMenus.find(
      (m): m is Router.AntdMenuItem & { children?: Router.AntdMenuItem[] } =>
        m !== null && m.key === activeFirstLevelMenuKey
    );
    const childrenLevel = menu?.children;
    routerStore.setState((prev) => ({
      ...prev,
      childLevelMenus: childrenLevel,
    }));
  }, [allMenus, activeFirstLevelMenuKey]);

  // 设置选中的 key
  useEffect(() => {
    if (!route) return;

    const staticData = route.staticData as
      | {
          activeMenu?: string;
          hideInMenu?: boolean;
        }
      | undefined;

    const { activeMenu, hideInMenu } = staticData || {};

    const name = route.pathname as string;

    const routeName = (hideInMenu ? activeMenu : name) || name;
    routerStore.setState((prev) => ({
      ...prev,
      selectKey: [routeName],
    }));
  }, [route]);

  return <>{children}</>;
};

export default MenuProvider;
