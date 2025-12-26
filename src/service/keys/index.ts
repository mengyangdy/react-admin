/**
 * Query Keys 统一管理
 *
 * 最佳实践：
 * 1. 使用层级结构组织：模块 -> 功能 -> 操作
 * 2. 基础 key 使用 const 断言保证类型安全
 * 3. 带参数的 key 使用工厂函数生成
 * 4. 统一管理便于维护、查找和重构
 *
 * 注意：
 * - 列表查询的 key 通常不需要参数，因为 use-table 会自动将 fetchParams 追加到 key 中
 * - 详情、单个资源查询等需要参数的 key 使用工厂函数
 */
export const QUERY_KEYS = {
  // Auth 认证模块
  AUTH: {
    USER_INFO: ["auth", "userInfo"] as const,
  },
  // System Manage 系统管理模块
  SYSTEM_MANAGE: {
    // 用户管理
    USER: {
      // 用户列表（基础 key，use-table 会自动追加 fetchParams）
      LIST: ["system-manage", "user", "list"] as const,
      // 用户详情（工厂函数，支持 id 参数）
      DETAIL: (id: number | string) =>
        ["system-manage", "user", "detail", id] as const,
      // 所有用户列表（不分页）
      ALL: ["system-manage", "user", "all"] as const,
    },
  },
} as const;
