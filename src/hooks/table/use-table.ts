import {
  keepPreviousData,
  type QueryKey,
  useQuery,
} from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import type { TablePaginationConfig, TableProps } from "antd";
import { Form } from "antd";
import type { Key } from "react";

import { useGetIsMobile } from "@/store/theme";

import { useURLStateSync } from "../common/urlToState";

type TableData = AntDesign.TableData;

// 定义表格筛选状态：Key 是字段名，Value 是 React.Key 数组（兼容 string/number）
type TableFilterState = Record<string, Key[]>;
// API 函数类型定义
// biome-ignore lint/suspicious/noExplicitAny: 基础hook
type ApiFn = (params: Record<string, any>) => Promise<any>;
// 类型体操：推断 API 返回数据中 records 数组里的元素类型
type ApiRecord<A extends ApiFn> =
  Awaited<ReturnType<A>> extends { records: (infer T)[] } ? T : never;
// 给数据加上 index 索引字段，方便前端展示序号
type TableRecord<A extends ApiFn> = ApiRecord<A> & { index: number };

// Hook 的配置参数接口
interface UseTableConfig<A extends ApiFn> {
  // React Query 缓存键
  queryKey: QueryKey;
  // 请求接口
  apiFn: A;
  // 默认参数（如 { type: 1 }）
  apiParams?: Partial<Parameters<A>[0]>;
  // 列配置工厂函数
  columns: () => TableProps<TableRecord<A>>["columns"];
  // 是否立即请求
  immediate?: boolean;
  // 是否开启 URL 同步
  isChangeURL?: boolean;
  // 行唯一 ID，默认 'id
  rowKey?: string;
  // 自定义分页配置
  pagination?: TablePaginationConfig | false;
  /** 排序字段发送给后端的 key @default 'sortField' */
  sortFieldKey?: string;

  /** 排序方式发送给后端的 key @default 'sortOrder' */
  sortOrderKey?: string;
}

/**
 * url解析
 * @param search
 * @param defaultApiParams
 * @returns
 */
function parseTableStateFromURL(
  search: string,
  // 接收默认 API 参数，用于在 URL 为空时兜底或合并
  // biome-ignore lint/suspicious/noExplicitAny: 基础hook
  defaultApiParams: Record<string, any> = {}
) {
  const params = new URLSearchParams(search);
  // 解析标准字段，解析失败则使用默认值
  const current = Number(params.get("current") || 1);
  const size = Number(params.get("size") || 10);
  const sortField = params.get("sortField") || undefined;
  // 强制转换为 Antd 需要的排序类型
  const sortOrder = params.get("sortOrder") as "ascend" | "descend" | null;
  // 这里的 filters 初始化包含 defaultApiParams
  // biome-ignore lint/suspicious/noExplicitAny: 基础hook
  const filters: Record<string, any> = { ...defaultApiParams };
  const tableFilters: Record<string, string[]> = {};
  // 遍历所有参数，提取以 filter_ 开头的作为表格筛选
  params.forEach((value, key) => {
    if (key.startsWith("filter_")) {
      // 从 URL 拿到的都是字符串，用逗号分割还原为数组
      tableFilters[key.replace("filter_", "")] = value.split(",");
    }
  });
  // 返回解析后的结构化状态
  return {
    pagination: { current, size },
    sorter:
      sortField && sortOrder ? { field: sortField, order: sortOrder } : {},
    filters,
    tableFilters,
  };
}

export function useTable<A extends ApiFn>({
  queryKey,
  apiFn,
  apiParams = {},
  columns: columnsFactory,
  immediate = true,
  isChangeURL = true,
  rowKey = "id",
  pagination: paginationConfig,
  sortFieldKey = "sortField", // 默认值
  sortOrderKey = "sortOrder", // 默认值
}: UseTableConfig<A>) {
  // TanStack Router 跳转
  const navigate = useNavigate();
  // 获取当前 URL
  const location = useLocation();
  // 响应式判断
  const isMobile = useGetIsMobile();
  // Antd 表单实例
  const [form] = Form.useForm();
  // 【优化】将 Router 的 search 对象转为字符串
  const searchStr = useMemo(() => {
    // biome-ignore lint/suspicious/noExplicitAny: 基础hook
    return new URLSearchParams(location.search as any).toString();
  }, [location.search]);

  // 定义一个 ref 来存放计算结果
  const initialStateRef = useRef<{
    pagination: { current: number; size: number };
    // biome-ignore lint/suspicious/noExplicitAny: 基础hook
    filters: Record<string, any>;
    // biome-ignore lint/suspicious/noExplicitAny: 基础hook
    sorter: any;
    // biome-ignore lint/suspicious/noExplicitAny: 基础hook
    tableFilters: any;
  } | null>(null);

  // 如果 ref 为空，说明是第一次渲染，执行计算
  if (initialStateRef.current === null) {
    if (isChangeURL) {
      // 开启同步：从 URL 解析初始状态
      initialStateRef.current = parseTableStateFromURL(searchStr, apiParams);
    } else {
      // 关闭同步：使用默认值
      initialStateRef.current = {
        pagination: { current: 1, size: 10 },
        filters: apiParams,
        sorter: {},
        tableFilters: {},
      };
    }
  }

  const initialState = initialStateRef.current;
  // 【定义状态】使用初始值初始化 React State
  const [pagination, setPagination] = useState(initialState.pagination);
  // biome-ignore lint/suspicious/noExplicitAny: 基础hook
  const [filters, setFilters] = useState<Record<string, any>>(
    initialState.filters
  );
  const [sorter, setSorter] = useState(initialState.sorter);
  const [tableFilters, setTableFilters] = useState<TableFilterState>(
    initialState.tableFilters
  );
  // 【表单同步逻辑】
  // 定义一个 Ref 标记：判断当前 filters 变化是否由 URL 驱动
  const isUrlDrivingRef = useRef(false);
  useEffect(() => {
    form.setFieldsValue(initialState.filters);
  }, [form, initialState]);
  // 2. 监听 filters 变化，同步给 Form
  useEffect(() => {
    // 只有当 flag 为 true 时才回填
    // 防止用户在输入时被打断，或发生循环更新
    if (isUrlDrivingRef.current) {
      form.setFieldsValue(filters);
      // 消费完标记，重置
      isUrlDrivingRef.current = false;
    }
  }, [filters, form]);

  useURLStateSync({
    enabled: isChangeURL,
    // 传入处理好的字符串
    locationSearch: searchStr,
    navigate: (opts) => {
      navigate({
        to: ".", // 显式指定留在当前路由 (TanStack Router 推荐)
        search: opts.search,
        replace: opts.replace,
        // biome-ignore lint/suspicious/noExplicitAny: 基础hook
      } as any); // 👈 这里的 as any 是必须的，告诉 TS "我知道我在做什么"
    },
    // 要同步的四个核心状态
    state: { pagination, filters, sorter, tableFilters },
    // 反序列化：字符串 -> State
    fromURL: (search) => parseTableStateFromURL(search, apiParams),
    // 序列化：State -> 对象
    toURL: (state) => {
      // biome-ignore lint/suspicious/noExplicitAny: 基础hook
      const params: Record<string, any> = {
        ...state.filters, // 放入表单搜索项
        current: state.pagination.current,
        size: state.pagination.size,
      };

      // 2. 处理排序
      if (state.sorter.field) {
        params[sortFieldKey] = state.sorter.field;
        params[sortOrderKey] = state.sorter.order;
      }

      // 3. 处理表格多选 (数组转逗号分隔字符串)
      Object.entries(state.tableFilters).forEach(([key, values]) => {
        if (values && values.length > 0) {
          params[`filter_${key}`] = values.join(",");
        }
      });

      return params;
    },
    // 当 URL 变化时触发的回调
    onURLChange(next) {
      isUrlDrivingRef.current = true;
      setPagination(next.pagination);
      setFilters(next.filters);
      setSorter(next.sorter);
      setTableFilters(next.tableFilters);
    },
  });
  // 构造请求参数
  const fetchParams = {
    ...apiParams,
    ...filters,
    ...(paginationConfig !== false && {
      current: pagination.current,
      size: pagination.size,
    }),
    ...(sorter.field && { sortField: sorter.field, sortOrder: sorter.order }),
    ...tableFilters,
  };

  const { data, isFetching, refetch } = useQuery({
    // 依赖包含 fetchParams，参数变自动请求
    queryKey: [queryKey, fetchParams],
    queryFn: () => apiFn(fetchParams),
    enabled: immediate,
    placeholderData: keepPreviousData,
  });
  // 数据加工
  const tableData = useMemo(() => {
    const records = data?.data?.records ?? [];
    const total = data?.data?.total ?? 0;
    return {
      // 给每条数据加上 index 字段
      // biome-ignore lint/suspicious/noExplicitAny: 基础hook
      list: records.map((r: any, i: number) => ({
        ...r,
        // 计算全局序号：(当前页-1)*页大小 + 当前索引 + 1
        index: (pagination.current - 1) * pagination.size + i + 1,
      })),
      total,
    };
  }, [data, pagination]);
  // Memo Columns防止 Table 频繁重渲染
  const finalColumns = useMemo(() => columnsFactory(), [columnsFactory]);
  // Antd Table onChange 回调
  const handleTableChange: TableProps<TableRecord<A>>["onChange"] = (
    pg,
    tf,
    s
  ) => {
    // 1. 更新分页
    setPagination({ current: pg.current || 1, size: pg.pageSize || 10 });
    // 2. 更新表格筛选 (清洗 null 值，并强制转换为 Key[])
    const nextFilters: TableFilterState = {};
    Object.entries(tf).forEach(([key, value]) => {
      if (value) {
        nextFilters[key] = value as Key[];
      }
    });

    setTableFilters(nextFilters);
    // 3. 更新排序 (兼容单列排序)
    const sorterResult = Array.isArray(s) ? s[0] : s;
    if (sorterResult.field) {
      setSorter({
        field: sorterResult.field as string,
        // biome-ignore lint/suspicious/noExplicitAny: 基础hook
        order: sorterResult.order as any,
      });
    } else {
      setSorter({});
    }
  };
  // 搜索按钮
  const search = async () => {
    try {
      const values = await form.validateFields();
      setFilters({ ...apiParams, ...values });
      setPagination((p) => ({ ...p, current: 1 }));
    } catch {}
  };
  // 重置按钮
  const reset = () => {
    // 清空表单 UI
    form.resetFields();
    // 重置 filters 为默认参数
    setFilters(apiParams);
    // 重置分页
    setPagination({ current: 1, size: 10 });
    // 重置排序
    setSorter({});
    // 重置表格筛选
    setTableFilters({});
  };

  // 返回值
  return {
    form,
    search,
    reset,
    refetch,
    searchProps: {
      form,
      search,
      reset,
      fetchParams: fetchParams,
    },
    tableProps: {
      rowKey,
      loading: isFetching,
      columns: finalColumns,
      dataSource: tableData.list,
      onChange: handleTableChange,
      pagination:
        paginationConfig === false
          ? false
          : {
              current: pagination.current,
              pageSize: pagination.size,
              total: tableData.total,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              simple: isMobile,
              ...paginationConfig,
            },
    },
  };
}

export function useTableOperate<T extends TableData = TableData>(
  data: T[],
  getData: (isResetCurrent?: boolean) => Promise<void>,
  executeResActions: (res: T, operateType: AntDesign.TableOperateType) => void
) {
  const [drawerVisible, { setFalse: closeDrawer, setTrue: openDrawer }] =
    useBoolean();
  const [operateType, setOperateType] =
    useState<AntDesign.TableOperateType>("add");
  const [form] = Form.useForm<T>();
  function handleAdd() {
    setOperateType("add");
    openDrawer();
  }
  const [editingData, setEditingData] = useState<T>();
  function handleEdit(idOrData: T["id"] | T) {
    if (typeof idOrData === "object") {
      form.setFieldsValue(idOrData);
      setEditingData(idOrData);
    } else {
      const findItem = data.find((item) => item.id === idOrData);
      if (findItem) {
        form.setFieldsValue(findItem);
        setEditingData(findItem);
      }
    }
    setOperateType("edit");
    openDrawer();
  }

  const [checkedRowKeys, setCheckedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (keys: React.Key[]) => {
    setCheckedRowKeys(keys);
  };
  // biome-ignore lint/suspicious/noExplicitAny: 基础hook
  const rowSelection: TableProps<any>["rowSelection"] = {
    columnWidth: 48,
    fixed: true,
    onChange: onSelectChange,
    selectedRowKeys: checkedRowKeys,
    type: "checkbox",
  };
  function onClose() {
    closeDrawer();
    form.resetFields();
  }
  async function onBatchDeleted() {
    window?.$message?.success("删除成功");
    setCheckedRowKeys([]);
    await getData(false);
  }
  async function onDeleted() {
    window?.$message?.success("删除成功");
    await getData(false);
  }
  async function handleSubmit() {
    const res = await form.validateFields();
    await executeResActions(res, operateType);
    window?.$message?.success("更新成功");
    onClose();
    getData();
  }
  return {
    checkedRowKeys,
    closeDrawer,
    drawerVisible,
    editingData,
    generalPopupOperation: {
      form,
      handleSubmit,
      onClose,
      open: drawerVisible,
      operateType,
    },
    handleAdd,
    handleEdit,
    onBatchDeleted,
    onDeleted,
    onSelectChange,
    openDrawer,
    operateType,
    rowSelection,
  };
}

export function useTableScroll(scrollX: number = 702) {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const size = useSize(tableWrapperRef);
  function getTableScrollY() {
    const height = size?.height;
    if (!height) return undefined;
    return height - 160;
  }
  const scrollConfig = {
    x: scrollX,
    y: getTableScrollY(),
  };
  return {
    scrollConfig,
    tableWrapperRef,
  };
}
