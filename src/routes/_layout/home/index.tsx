import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/home/")({
  component: lazyRouteComponent(() => import("@/views/home")),
  staticData: {
    title: "首页",
    icon: "mdi:monitor-dashboard",
    hideInMenu: false,
    order: 1,
  },
});
