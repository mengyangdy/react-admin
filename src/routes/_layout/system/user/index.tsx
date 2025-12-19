import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/system/user/")({
	component: RouteComponent,
	staticData: {
		title: "用户管理",
		icon: "mdi:monitor-dashboard",
		hideInMenu: false,
		order: 11,
	},
});

function RouteComponent() {
	return <div>Hello "/_layout/system/user/"!</div>;
}
