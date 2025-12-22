import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/system/role/")({
  component: RoleList,
  staticData: {
    title: "角色管理",
    icon: "mdi:monitor-dashboard",
    hideInMenu: false,
    order: 10,
  },
});

function RoleList() {
  return <div>111</div>;
}
