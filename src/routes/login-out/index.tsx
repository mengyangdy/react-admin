import { createFileRoute, redirect } from "@tanstack/react-router";

import { authActions } from "@/store/auth";

export const Route = createFileRoute("/login-out/")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  // 1. 在路由加载前执行清理逻辑
  beforeLoad: async ({ search }) => {
    // 执行你现有的重置逻辑
    // 注意：如果是 TanStack Router，你可能需要微调 resetAuth
    // 让它只处理状态清理，而不处理跳转，或者在这里直接处理
    await authActions.resetAuth();
    // 2. 抛出重置指令跳转到登录页
    // search.redirect 可以获取从 UserAvatar 传过来的当前路径
    throw redirect({
      to: "/login",
      search: {
        redirect: search.redirect || "/",
      },
    });
  },
  // 3. 这个组件永远不会被渲染，因为 beforeLoad 已经 throw redirect 了
  component: () => null,
});
