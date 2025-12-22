import type { QueryKey } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useSize } from "ahooks";
import type { TablePaginationConfig, TableProps } from "antd";
import { Form } from "antd";
import { useRef, useState } from "react";

import useBoolean from "@/hooks/common/use-boolean";
import { useHookTable } from "@/hooks/common/use-table";
import { useGetIsMobile } from "@/store/theme";

type TableData = AntDesign.TableData;
type GetTableData<A extends AntDesign.TableApiFn> = A extends (
  ...args: unknown[]
) => Promise<infer R>
  ? R extends { records: (infer T)[] }
    ? T
    : never
  : never;

type TableColumn<T> = NonNullable<TableProps<T>["columns"]>[number];

// 关键修改：扩展 Config 类型，增加 queryKey
type Config<A extends AntDesign.TableApiFn> = Omit<
  AntDesign.AntDesignTableConfig<A, GetTableData<A>>,
  "columns"
> & {
  queryKey: QueryKey; // 必传，用于 React Query 缓存
  columns: (
    data: unknown
  ) => TableColumn<AntDesign.TableDataWithIndex & GetTableData<A>>[];
};

type CustomTableProps<A extends AntDesign.TableApiFn> = Omit<
  TableProps<AntDesign.TableDataWithIndex & GetTableData<A>>,
  "loading"
> & {
  loading: boolean;
};

// 解析查询字符串的辅助函数
function parseQuery(queryString: string): Record<string, unknown> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, unknown> = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}

export function useTable<A extends AntDesign.TableApiFn>(config: Config<A>) {
  const isMobile = useGetIsMobile();

  const {
    queryKey,
    apiFn,
    apiParams,
    columns: columnsFactory,
    immediate,
    isChangeURL = true,
    onChange: onChangeCallback,
    pagination: paginationConfig,
    rowKey = "id",
    transformParams,
    ...rest
  } = config;

  const [form] = Form.useForm<AntDesign.AntDesignTableConfig<A>["apiParams"]>();

  const location = useLocation();
  const searchString =
    typeof location.search === "string" ? location.search : "";
  const query = parseQuery(searchString);

  const {
    columnChecks,
    columns,
    data,
    empty,
    loading,
    pageNum,
    pageSize,
    resetSearchParams,
    searchParams,
    setColumnChecks,
    total,
    updateSearchParams,
    getData: refetch,
  } = useHookTable<
    A,
    GetTableData<A>,
    TableColumn<AntDesign.TableDataWithIndex & GetTableData<A>>
  >({
    queryKey,
    apiFn,
    apiParams: { ...apiParams, ...query } as Parameters<A>[0],
    columns: () => columnsFactory({}),
    getColumnChecks: (cols) => {
      const checks: AntDesign.TableColumnCheck[] = [];
      cols.forEach((column) => {
        if (column.key) {
          checks.push({
            checked: true,
            key: column.key as string,
            title: column.title as string,
          });
        }
      });
      return checks;
    },
    getColumns: (cols, checks) => {
      const columnMap = new Map<
        string,
        TableColumn<AntDesign.TableDataWithIndex & GetTableData<A>>
      >();

      cols.forEach((column) => {
        if (column.key) {
          columnMap.set(column.key as string, column);
        }
      });

      const filteredColumns = checks
        .filter((item) => item.checked)
        .map((check) => columnMap.get(check.key))
        .filter(
          (
            col
          ): col is TableColumn<
            AntDesign.TableDataWithIndex & GetTableData<A>
          > => !!col
        );

      return filteredColumns;
    },
    immediate,
    isChangeURL,
    transformer: (res) => {
      const response = res as
        | {
            current?: number;
            records?: GetTableData<A>[];
            size?: number;
            total?: number;
          }
        | null
        | undefined;
      const {
        current = 1,
        records = [],
        size = 10,
        total: totalNum = 0,
      } = response || {};

      const recordsWithIndex: (AntDesign.TableDataWithIndex &
        GetTableData<A>)[] = records.map((item, index) => {
        return {
          ...(item as Record<string, unknown>),
          index: (current - 1) * size + index + 1,
        } as AntDesign.TableDataWithIndex & GetTableData<A>;
      });

      return {
        data: recordsWithIndex,
        pageNum: current,
        pageSize: size,
        total: totalNum,
      };
    },
    transformParams,
  });

  const pagination: TablePaginationConfig = {
    current: pageNum,
    pageSize,
    pageSizeOptions: ["10", "15", "20", "25", "30"],
    showSizeChanger: true,
    simple: isMobile,
    total,
    ...paginationConfig,
  };

  function reset() {
    form.setFieldsValue(apiParams as NonNullable<Parameters<A>[0]>);
    resetSearchParams();
  }

  async function run(isResetCurrent: boolean = true) {
    try {
      const res = await form.validateFields();

      if (res) {
        if (isResetCurrent) {
          const params = res as Record<string, unknown>;
          const { current = 1, ...other } = params;
          updateSearchParams({ current, ...other } as Parameters<A>[0]);
        } else {
          updateSearchParams(res as Parameters<A>[0]);
        }
      }
    } catch (error) {
      // Validation failed, silently ignore
      void error;
    }
  }

  function handleChange(...args: AntDesign.TableOnChange) {
    const [paginationContext, ...otherParams] = args;

    let other: Partial<Parameters<A>[0]> = {
      current: paginationContext.current,
      size: paginationContext.pageSize,
    } as Partial<Parameters<A>[0]>;

    if (onChangeCallback) {
      const params = onChangeCallback(paginationContext, ...otherParams);
      if (params) {
        other = params as Partial<Parameters<A>[0]>;
      }
    }

    updateSearchParams(other as Parameters<A>[0]);
  }

  return {
    columnChecks,
    data,
    empty,
    form,
    run,
    refetch,
    searchParams,
    searchProps: {
      form,
      reset,
      search: () => run(true),
      searchParams: searchParams as NonNullable<Parameters<A>[0]>,
    },
    setColumnChecks,
    tableProps: {
      columns,
      dataSource: data,
      loading,
      onChange: handleChange,
      pagination,
      rowKey,
      ...rest,
    } as CustomTableProps<A>,
  };
}

export function useTableOperate<T extends TableData = TableData>(
  data: T[],
  getData: () => Promise<unknown>,
  executeResActions: (
    res: T,
    operateType: AntDesign.TableOperateType
  ) => Promise<void> | void
) {
  const {
    bool: drawerVisible,
    setFalse: closeDrawer,
    setTrue: openDrawer,
  } = useBoolean();

  const [operateType, setOperateType] =
    useState<AntDesign.TableOperateType>("add");

  const [form] = Form.useForm<T>();

  function handleAdd() {
    setOperateType("add");
    form.resetFields();
    openDrawer();
  }

  const [editingData, setEditingData] = useState<T | undefined>();

  function handleEdit(idOrData: T["id"] | T) {
    let currentItem: T | undefined;

    if (typeof idOrData === "object") {
      currentItem = idOrData;
    } else {
      currentItem = data.find((item) => item.id === idOrData);
    }

    if (currentItem) {
      form.setFieldsValue(
        currentItem as Parameters<typeof form.setFieldsValue>[0] & T
      );
      setEditingData(currentItem);
      setOperateType("edit");
      openDrawer();
    }
  }

  const [checkedRowKeys, setCheckedRowKeys] = useState<React.Key[]>([]);

  function onSelectChange(keys: React.Key[]) {
    setCheckedRowKeys(keys);
  }

  const rowSelection: TableProps<T>["rowSelection"] = {
    columnWidth: 48,
    fixed: true,
    onChange: onSelectChange,
    selectedRowKeys: checkedRowKeys,
    type: "checkbox",
  };

  function onClose() {
    closeDrawer();
    form.resetFields();
    setEditingData(undefined);
  }

  async function onBatchDeleted() {
    window.$message?.success("common.deleteSuccess");
    setCheckedRowKeys([]);
    await getData();
  }

  async function onDeleted() {
    window.$message?.success("common.deleteSuccess");
    await getData();
  }

  async function handleSubmit() {
    try {
      const res = await form.validateFields();
      await executeResActions(res, operateType);
      window.$message?.success("common.updateSuccess");
      onClose();
      getData();
    } catch (error) {
      // Error handling, silently ignore
      void error;
    }
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
    return Math.max(height - 160, 200);
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
