import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/error/404/")({
  component: lazyRouteComponent(() => import("@/views/error/404")),
  staticData: {
    title: "404",
    icon: "mdi:monitor-dashboard",
    hideInMenu: false,
    order: 11,
  },
});
