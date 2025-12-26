import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/error/403/")({
  component: lazyRouteComponent(() => import("@/views/error/403")),
  staticData: {
    title: "403",
    icon: "mdi:monitor-dashboard",
    hideInMenu: false,
    order: 11,
  },
});
