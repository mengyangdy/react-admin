import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod"; // 推荐使用 zod 做参数验证

// 1. 定义参数结构
const loginSearchSchema = z.object({
  redirect: z.string().optional(), // redirect 是可选的字符串
});

export const Route = createFileRoute("/login/")({
  // 2. 绑定参数验证
  validateSearch: (search) => loginSearchSchema.parse(search),
  component: lazyRouteComponent(() => import("@/views/login")),
  staticData: {
    title: "登录",
    icon: null,
    hideInMenu: true,
    order: 1,
  },
});
