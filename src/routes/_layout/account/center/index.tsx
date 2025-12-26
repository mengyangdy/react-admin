import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/account/center/")({
  component: lazyRouteComponent(() => import("@/views/account/center")),
  staticData: {
    title: "个人中心",
    icon: "mdi:monitor-dashboard",
    hideInMenu: true,
    order: 1,
  },
});
