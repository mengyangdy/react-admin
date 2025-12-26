1. 主题切换的icons现在是在ThemeSchemaSwitch.tsx中配置的 需要抽取出来吗
2. import clsx from 'clsx' 在子包里面叫classNames需要统一吗
3. axios和tanstack/query结合使用
4. 引入mock
5. 完成auth的store
6. 权限设计

# useTable 系列 Hook 使用规范

## 1. Hook 介绍

### 1.1 useTable
- **功能**：
  - 分页、排序、多列筛选
  - 搜索表单状态同步
  - URL 状态同步（可选）
  - 数据请求与缓存（基于 `@tanstack/react-query`）
- **返回值**：
  - `form`：Antd 表单实例
  - `search`、`reset`：搜索/重置操作
  - `refetch`：手动刷新数据
  - `searchProps`：搜索组件可直接使用
  - `tableProps`：Antd Table 可直接绑定

### 1.2 useTableOperate
- **功能**：
  - 管理表格增删改操作
  - Drawer 弹窗管理
  - 单条/批量删除
  - 选中行状态 (`rowSelection`)
- **返回值**：
  - `checkedRowKeys`、`rowSelection`：表格多选
  - `generalPopupOperation`：表单弹窗操作集合
  - `handleAdd`、`handleEdit`、`onDeleted`、`onBatchDeleted`：操作函数

### 1.3 useTableScroll
- **功能**：
  - 根据父容器高度计算 Table 滚动高度
  - 提供 `scrollConfig` 与 `tableWrapperRef` 直接绑定 Antd Table

---

## 2. 使用示例

```ts
const { tableProps, search, reset, form } = useTable({
  queryKey: ['users'],
  apiFn: getUserList,
  apiParams: { type: 1 },
  columns: () => columns,
  isChangeURL: true,
});

<Table {...tableProps} />
<Form form={form}>
  <Button onClick={search}>搜索</Button>
  <Button onClick={reset}>重置</Button>
</Form>
```

以下是整理好的 Markdown 格式文档：

# React Query Table Hooks 文档

## 3. 参数说明

| 参数 | 类型 | 说明 | 默认值 |
| :--- | :--- | :--- | :--- |
| `queryKey` | `QueryKey` | React Query 缓存 key | **必填** |
| `apiFn` | `ApiFn` | 数据请求函数 | **必填** |
| `apiParams` | `Partial<Parameters<A>[0]>` | 默认请求参数 | `{}` |
| `columns` | `() => TableProps<TableRecord<A>>['columns']` | 表格列定义工厂函数 | **必填** |
| `immediate` | `boolean` | 是否组件挂载时立即请求 | `true` |
| `isChangeURL` | `boolean` | 是否启用 URL ↔ State 同步 | `true` |
| `rowKey` | `string` | 表格行唯一键 | `'id'` |
| `pagination` | `TablePaginationConfig` | 自定义分页配置 | 默认 Antd 分页 |
| `sortFieldKey` | `string` | 排序字段 key | `'sortField'` |
| `sortOrderKey` | `string` | 排序方式 key | `'sortOrder'` |

---

## 4. 最佳实践

### 表格列配置
- **函数式返回**：使用函数式返回 (`columnsFactory`) 防止 Table 重渲染。
- **权限控制**：权限列建议使用 `render` 或 `hidden` 属性进行控制。

### URL 同步
- **开启同步**：打开 `isChangeURL` 可保持分页、筛选、排序在浏览器前进/后退时状态一致。
- **关闭同步**：不需要共享 URL 状态时，可关闭同步以提高性能。

### State 与 Form 同步
- **自动处理**：使用 `useURLStateSync` 自动处理 URL ↔ State 的双向绑定。
- **避免跳过**：避免直接通过 `setFilters` 等操作跳过 URL 更新，应保持单向流。

### 分页/筛选/排序
- **标准处理**：使用 Hook 内置的 `handleTableChange`。
- **重置页码**：执行搜索操作后，建议将 `current` 重置为 `1`。

### 数据类型
- **类型定义**：推荐给 API 函数详细定义返回类型。
- **Lint 处理**：Biome 报 `noExplicitAny` 时，可使用 `biome-ignore` 或完善类型定义。

### 性能优化
- **Columns 缓存**：`columns` 定义建议使用 `useMemo` 缓存。
- **数据加工**：数据二次加工逻辑建议使用 `useMemo`，避免重复渲染。

---

## 5. 禁用/忽略规范

### Biome 忽略

```typescript
// biome-ignore lint/suspicious/noExplicitAny: 基础hook
type ApiFn = (params: Record<string, any>) => Promise<any>;
```

### 整文件忽略

```typescript
// biome-ignore-file lint/suspicious/noExplicitAny
```

### 单行忽略

```typescript
const data: any = await apiFn(); // biome-ignore-line lint/suspicious/noExplicitAny
```

---

## 6. 注意事项

### 搜索/重置操作
- **search()**：会自动带上默认的 `apiParams`。
- **reset()**：会清空 `filters`、分页、排序以及表格筛选状态。

### 表格多选/操作
- **状态管理**：建议使用 `useTableOperate` 管理选中行与弹窗状态。
- **属性绑定**：`rowSelection` 可直接绑定到 `TableProps.rowSelection`。

### 表格滚动高度
- **获取配置**：使用 `useTableScroll` 获取滚动配置。
- **自适应**：结合 `ahooks.useSize` 可自动响应容器高度变化。

### 类型安全
- **避免 Any**：尽量避免使用 `any`，仅在基础 Hook 封装或兼容 legacy 系统时使用 `biome-ignore`。

### 状态驱动单向流
- **更新机制**：不要直接修改 `pagination` 或 `filters`，应通过 Hook 方法或 URL 变更来驱动更新。
- **浏览器导航**：遵循此原则可保证浏览器前进/后退按钮工作正常。

---

## 7. 总结

*   **useTable**：负责表格状态管理 + 数据请求 + URL 同步。
*   **useTableOperate**：负责增删改查及选中行管理。
*   **useTableScroll**：负责自适应滚动配置。

**Biome 规则要点：**
*   ❌ 避免显式 `any`。
*   ⚠️ 必要时规范使用 `biome-ignore`。
*   ✅ 推荐 **单向数据流 + URL 同步** 保持状态一致。
