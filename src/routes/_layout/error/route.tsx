import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/error")({
  component: ErrorPage,
  staticData: {
    title: "异常页",
    icon: "mdi:monitor-dashboard",
    hideInMenu: false,
    order: 11,
  },
});

function ErrorPage() {
  return <Outlet />;
}
