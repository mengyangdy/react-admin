import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import GlobalLoading from "@/components/Loading";
import { AppProvider } from "@/features/app";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const router = useRouter();
    const pathname = useRouterState({
      select: (state) => state.location.pathname,
    });
    const routerStatus = useRouterState({
      select: (state) => state.status,
    });
    const isInitialMountRef = useRef(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // 订阅路由导航开始事件，启动进度条
    useEffect(() => {
      const unsubscribeBeforeLoad = router.subscribe("onBeforeLoad", () => {
        window.NProgress?.start?.();
      });

      return () => {
        unsubscribeBeforeLoad();
      };
    }, [router]);

    // 监听路由状态变化，当路由加载完成时关闭进度条
    useEffect(() => {
      // 路由状态为 'idle' 表示加载完成
      if (routerStatus === "idle") {
        window.NProgress?.done?.();
      }
    }, [routerStatus]);

    // 组件挂载时，完成进度条（处理初始加载）
    useEffect(() => {
      window.NProgress?.done?.();
    }, []);

    // 首次加载完成后隐藏 Loading（只在首次进入时执行一次）
    useEffect(() => {
      if (isInitialMountRef.current && pathname) {
        // 等待页面渲染完成后再隐藏 loading
        const timer = setTimeout(() => {
          setIsInitialLoading(false);
          isInitialMountRef.current = false;
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [pathname]);

    return (
      <AppProvider>
        {isInitialLoading && <GlobalLoading />}
        <Outlet />
      </AppProvider>
    );
  },
});
