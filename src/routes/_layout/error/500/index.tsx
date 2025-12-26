import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/error/500/")({
  component: lazyRouteComponent(() => import("@/views/error/500")),
  staticData: {
    title: "500",
    icon: "mdi:monitor-dashboard",
    hideInMenu: false,
    order: 11,
  },
});
