import { useMatchRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Breadcrumb, type BreadcrumbProps } from "antd";

import { getBreadcrumbsByRoute } from "@/layouts/base-layout/modules/global-header/components/breadcrumbShared.tsx";
import { routerStore } from "@/store/router";

const GlobalBreadcrumb: FC<Omit<BreadcrumbProps, "items">> = (props) => {
	const allMenus = useStore(routerStore, (s) => s.allMenus);
	const route = useCurrentRoute();
	const matchRoute = useMatchRoute(); // Hook 必须在组件里调用
	const breadcrumb = useMemo(() => {
		return getBreadcrumbsByRoute(route, allMenus, matchRoute);
	}, [route, allMenus]);
	return (
		<Breadcrumb
			{...props}
			items={breadcrumb}
		/>
	);
};

export default GlobalBreadcrumb;
