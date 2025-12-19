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

import { Button, Modal, message, Space, Tag } from "antd";
import type React from "react";
import { useState } from "react";

import { type ProColumn, ProTable } from "@/components/ProTable";

// 模拟后端数据结构
interface RoleItem {
  id: string;
  roleName: string;
  roleCode: string;
  description: string;
  status: 0 | 1; // 1启用 0禁用
}
function RoleList() {
  // 选中的行
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 1. 定义列
  const columns: ProColumn<RoleItem>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "text", // 其实这里不需要 valueType，因为 hideInSearch
      hideInSearch: true,
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      valueType: "text", // 搜索栏：输入框
    },
    {
      title: "角色编码",
      dataIndex: "roleCode",
      valueType: "text", // 搜索栏：输入框
    },
    {
      title: "角色描述",
      dataIndex: "description",
      hideInSearch: true, // 搜索栏不显示
    },
    {
      title: "角色状态",
      dataIndex: "status",
      valueType: "select", // 搜索栏：下拉框
      options: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 0 },
      ],
      width: 100,
      render: (status) => (
        <Tag color={status === 1 ? "success" : "warning"}>
          {status === 1 ? "启用" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "操作",
      dataIndex: "option",
      hideInSearch: true,
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<SvgIcon icon="mdi:square-edit-outline" />}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            size="small"
            icon={<SvgIcon icon="mdi:delete-outline" />}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 2. 模拟请求
  const fetchRoles = async (params: any) => {
    console.log("Search Params:", params);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 生成假数据
    const list = Array.from({ length: params.pageSize }).map((_, i) => ({
      id: `${params.page}-${i}`,
      roleName: `Role ${i}`,
      roleCode: `R_CODE_${i}`,
      description: "System administrator role description...",
      status: Math.random() > 0.5 ? 1 : (0 as 0 | 1),
    }));

    return { list, total: 200 };
  };

  // 3. 批量删除逻辑
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0)
      return message.warning("请先选择要删除的数据");
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除选中的 ${selectedRowKeys.length} 条数据吗？`,
      onOk: () => {
        message.success("删除成功");
        setSelectedRowKeys([]); // 清空选中
        // 可以在这里调用 refetch
      },
    });
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <ProTable<RoleItem>
        headerTitle="角色列表"
        queryKey="roleList"
        request={fetchRoles}
        columns={columns}
        // 多选配置
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<SvgIcon icon="mdi:plus" />}>
            新增
          </Button>,
          <Button
            key="del"
            danger
            disabled={selectedRowKeys.length === 0} // 没选中时禁用
            onClick={handleBatchDelete}
            icon={<SvgIcon icon="mdi:delete-outline" />}
          >
            批量删除
          </Button>,
        ]}
      />
    </div>
  );
}
