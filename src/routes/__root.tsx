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
		const prevPathnameRef = useRef(pathname);
		const isInitialMountRef = useRef(true);
		const [isInitialLoading, setIsInitialLoading] = useState(true);

		// 订阅路由导航开始事件，启动进度条
		useEffect(() => {
			const unsubscribe = router.subscribe("onBeforeLoad", () => {
				window.NProgress?.start?.();
			});

			return () => {
				unsubscribe();
			};
		}, [router]);

		// 路由变化完成，完成进度条
		useEffect(() => {
			if (prevPathnameRef.current !== pathname) {
				window.NProgress?.done?.();
				prevPathnameRef.current = pathname;
			}
		});

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
