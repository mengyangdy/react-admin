import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/account")({
  component: SystemLayout,
  staticData: {
    title: "个人中心",
    icon: "mdi:monitor-dashboard",
    hideInMenu: true,
    order: 11,
  },
});

function SystemLayout() {
  return <Outlet />;
}
