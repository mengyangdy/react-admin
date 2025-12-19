import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/system")({
	component: SystemLayout,
	staticData: {
		title: "系统管理",
		icon: "mdi:monitor-dashboard",
		hideInMenu: false,
		order: 11,
	},
});

function SystemLayout() {
	return <Outlet />;
}
