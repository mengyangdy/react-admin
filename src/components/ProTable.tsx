import { Icon } from "@iconify/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
// --- FIX 1: 修改引入 ---
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Table,
  type TableProps,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

// --- 类型定义保持不变 ---
export interface ProColumn<T = any> extends Omit<
  NonNullable<TableProps<T>["columns"]>[number],
  "render"
> {
  dataIndex: string;
  title: string;
  render?: (text: any, record: T, index: number) => React.ReactNode;
  hideInSearch?: boolean;
  valueType?: "text" | "select" | "date" | "dateRange" | "switch" | "digit";
  options?: { label: string; value: string | number }[];
  fieldProps?: any;
  search?: {
    transform?: (value: any) => Record<string, any>;
  };
}

interface ApiResponse<T> {
  list: T[];
  total: number;
}

interface ProTableProps<T extends object> extends Omit<
  TableProps<T>,
  "columns" | "dataSource" | "pagination"
> {
  request: (params: {
    page: number;
    pageSize: number;
    [key: string]: any;
  }) => Promise<ApiResponse<T>>;
  columns: ProColumn<T>[];
  queryKey: string | (string | number | object)[];
  headerTitle?: React.ReactNode;
  toolBarRender?: () => React.ReactNode[];
  rowSelection?: TableProps<T>["rowSelection"];
}

export function ProTable<T extends object = any>(props: ProTableProps<T>) {
  const {
    request,
    columns,
    queryKey,
    headerTitle,
    toolBarRender,
    rowSelection,
    ...tableProps
  } = props;

  const [form] = Form.useForm();

  // --- FIX 2: 使用 TanStack Router 的 Hook ---
  // strict: false 表示我们在一个通用组件里，不绑定具体的 Route 类型
  const location = useLocation();
  const searchParams = location.search as Record<string, any>;
  const navigate = useNavigate();

  // 初始化分页：直接从 searchParams 对象中读取
  const [pagination, setPagination] = useState({
    page: Number(searchParams.page) || 1,
    pageSize: Number(searchParams.pageSize) || 10,
  });

  const [isExpanded, setIsExpanded] = useState(true);

  // 过滤出搜索列
  const searchColumns = useMemo(
    () => columns.filter((col) => !col.hideInSearch),
    [columns]
  );

  // --- 初始化：将 URL 参数回填到表单 ---
  useEffect(() => {
    const initValues: Record<string, any> = {};
    searchColumns.forEach((col) => {
      // TanStack Router 的 searchParams 直接就是对象，不需要 .get()
      const val = searchParams[col.dataIndex];
      if (val) {
        if (col.valueType === "date") {
          initValues[col.dataIndex] = dayjs(val);
        } else if (col.valueType === "dateRange") {
          // 复杂情况：如果 URL 里存的是 array 格式，这里可能需要反序列化
          // 简单处理：假设不回填 Range 或者你自己定义解析逻辑
        } else {
          initValues[col.dataIndex] = val; // Select, Text, Digit 直接回填
        }
      }
    });
    form.setFieldsValue(initValues);
  }, []); // 只在组件挂载时执行一次

  // --- 数据获取逻辑 ---
  const fetchData = async () => {
    const formValues = form.getFieldsValue();
    const requestParams: Record<string, any> = { ...formValues };

    // 数据清洗 (Transform)
    searchColumns.forEach((col) => {
      const value = requestParams[col.dataIndex];
      if (col.search?.transform) {
        Object.assign(requestParams, col.search.transform(value));
        delete requestParams[col.dataIndex];
      } else if (col.valueType === "dateRange" && Array.isArray(value)) {
        delete requestParams[col.dataIndex];
        requestParams[`${col.dataIndex}Start`] = value[0]?.format(
          "YYYY-MM-DD HH:mm:ss"
        );
        requestParams[`${col.dataIndex}End`] = value[1]?.format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else if (col.valueType === "date" && value) {
        requestParams[col.dataIndex] = value.format("YYYY-MM-DD");
      }
    });

    // 过滤空值
    const cleanParams = Object.fromEntries(
      Object.entries({ ...requestParams, ...pagination })
        // 加上 (v as any) 绕过类型检查
        .filter(([_, v]) => v !== undefined && v !== null && (v as any) !== "")
    );

    // --- FIX 3: (可选) 简单的 URL 同步 ---
    // 注意：这里不要把 dayjs 对象推到 URL 里，简单演示同步分页和文本
    // 实际项目中建议只同步关键筛选条件
    /*
    navigate({
      search: (old) => ({
        ...old,
        ...cleanParams, // 注意：这里需要确保 cleanParams 里都是基本类型(string/number)
      }),
      replace: true, // 使用 replace 防止浏览器历史记录爆炸
    });
    */

    return request(cleanParams as any);
  };

  const { data, isFetching, refetch } = useQuery({
    queryKey: [
      ...(Array.isArray(queryKey) ? queryKey : [queryKey]),
      pagination,
      form.getFieldsValue(),
    ],
    queryFn: fetchData,
    placeholderData: keepPreviousData,
  });

  const handleSearch = () => {
    setPagination((p) => ({ ...p, page: 1 }));
    refetch();
  };

  const handleReset = () => {
    form.resetFields();
    setPagination((p) => ({ ...p, page: 1 }));
    // 重置 URL
    navigate({
      to: ".", // 显式指定留在当前路径
      search: () => ({}), // 返回空对象，意味着清空所有参数
      replace: true, // 建议使用 replace，避免重置操作污染浏览器历史记录
    });
  };

  // --- 渲染逻辑不变 ---
  const renderSearchItem = (col: ProColumn<T>) => {
    // ... 代码与之前一致 ...
    const { valueType = "text", dataIndex, title, options, fieldProps } = col;
    const commonProps = {
      placeholder: `请输入${title}`,
      allowClear: true,
      style: { width: "100%" },
      ...fieldProps,
    };
    let content;
    switch (valueType) {
      case "select":
        content = (
          <Select
            options={options}
            placeholder={`请选择${title}`}
            {...commonProps}
          />
        );
        break;
      case "date":
        content = <DatePicker {...commonProps} />;
        break;
      case "dateRange":
        content = <DatePicker.RangePicker {...commonProps} />;
        break;
      case "digit":
        content = <InputNumber {...commonProps} />;
        break;
      case "switch":
        return (
          <Form.Item name={dataIndex} label={title} valuePropName="checked">
            <Switch {...fieldProps} />
          </Form.Item>
        );
      default:
        content = <Input {...commonProps} />;
    }
    return (
      <Form.Item name={dataIndex} label={title}>
        {content}
      </Form.Item>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 搜索栏 */}
      {searchColumns.length > 0 && (
        <Card
          bordered={false}
          className="shadow-sm rounded-lg"
          styles={{ body: { paddingBottom: 0 } }}
        >
          <div
            className="flex justify-between items-start mb-4 cursor-pointer select-none"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="font-bold flex items-center gap-1">
              <Icon icon="mdi:filter-outline" /> 搜索筛选
            </div>
            <Icon
              icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
              className="text-gray-400"
            />
          </div>

          <Form
            form={form}
            layout="inline"
            className={`w-full transition-all ${isExpanded ? "block" : "hidden"}`}
          >
            <div className="flex flex-wrap w-full gap-y-4">
              <div className="flex-1 flex flex-wrap gap-x-6 gap-y-4 items-center">
                {searchColumns.map((col) => (
                  <div key={col.dataIndex} className="min-w-[240px]">
                    {renderSearchItem(col)}
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 ml-auto pl-4 border-l border-gray-100">
                <Button onClick={handleReset}>重置</Button>
                <Button
                  type="primary"
                  onClick={handleSearch}
                  icon={<Icon icon="mdi:magnify" />}
                >
                  搜索
                </Button>
              </div>
            </div>
          </Form>
        </Card>
      )}

      {/* 表格主体 */}
      <Card bordered={false} className="shadow-sm rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold text-gray-800">{headerTitle}</div>
          <div className="flex items-center gap-3">
            {toolBarRender?.()}
            <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
            <Tooltip title="刷新">
              <Button
                type="text"
                shape="circle"
                icon={<Icon icon="mdi:refresh" className="text-lg" />}
                onClick={() => refetch()}
              />
            </Tooltip>
            <Tooltip title="列设置">
              <Button
                type="text"
                shape="circle"
                icon={<Icon icon="mdi:cog-outline" className="text-lg" />}
              />
            </Tooltip>
          </div>
        </div>

        <Table<T>
          rowKey="id"
          loading={isFetching}
          dataSource={data?.list || []}
          columns={columns as any}
          rowSelection={rowSelection}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: data?.total || 0,
            onChange: (p, s) => setPagination({ page: p, pageSize: s }),
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            position: ["bottomRight"],
          }}
          scroll={{ x: "max-content" }}
          size="middle"
          {...tableProps}
        />
      </Card>
    </div>
  );
}
