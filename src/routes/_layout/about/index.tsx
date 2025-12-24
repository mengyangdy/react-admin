import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/about/")({
  component: lazyRouteComponent(() => import("@/views/about")),
  staticData: {
    title: "关于",
    icon: "fluent:book-information-24-regular",
    hideInMenu: false,
    order: 100,
  },
});
