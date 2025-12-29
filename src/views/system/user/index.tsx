import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Collapse, Popconfirm, Table, Tag } from "antd";

import { enableStatusRecord, userGenderRecord } from "@/constants/business";
import { ATG_MAP } from "@/constants/common";
import { useTable, useTableScroll } from "@/hooks/table/use-table";
import { fetchGetUserListByDemo } from "@/service/api/example-other-service";
import { QUERY_KEYS } from "@/service/keys";
import { useGetIsMobile } from "@/store/theme";

import UserSearch from "./components/UserSearch";

const tagUserGenderMap: Record<Api.SystemManage.UserGender, string> = {
  1: "processing",
  2: "error",
};

function User() {
  const navigate = useNavigate();
  const isMobile = useGetIsMobile();
  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const {
    searchProps,
    getData,
    tableProps,
    loading,
    columnChecks,
    setColumnChecks,
  } = useTable({
    queryKey: QUERY_KEYS.SYSTEM_MANAGE.USER.LIST,
    apiFn: fetchGetUserListByDemo,
    apiParams: {
      current: 1,
      size: 10,
      username: null,
      nickname: null,
      status: null,
      email: null,
      gender: null,
      phone: null,
    },
    columns: () => {
      return [
        {
          align: "center",
          dataIndex: "index",
          title: "序号",
          width: 64,
        },
        {
          align: "center",
          dataIndex: "userName",
          title: "用户名",
          width: 150,
        },
        {
          align: "center",
          dataIndex: "userGender",
          title: "性别",
          width: 100,
          render: (gender) => {
            if (!gender) return null;
            const label = userGenderRecord[gender];
            return <Tag color={tagUserGenderMap[gender]}>{label}</Tag>;
          },
        },
        {
          align: "center",
          dataIndex: "nickName",
          minWidth: 100,
          title: "昵称",
        },
        {
          align: "center",
          dataIndex: "userPhone",
          title: "手机号",
          width: 120,
        },
        {
          align: "center",
          dataIndex: "userEmail",
          title: "邮箱",
          minWidth: 200,
        },
        {
          align: "center",
          dataIndex: "status",
          title: "用户状态",
          width: 100,
          render: (status) => {
            if (status === null) return null;
            const label = enableStatusRecord[status];
            return <Tag color={ATG_MAP[status]}>{label}</Tag>;
          },
        },
        {
          align: "center",
          dataIndex: "operate",
          title: "操作",
          width: 195,
          render: (_, record) => (
            <div className="flex-center gap-8px">
              <Button
                ghost
                size="small"
                type="primary"
                onClick={() => edit(record.id)}
              >
                编辑
              </Button>
              <Button
                size="small"
                onClick={() =>
                  navigate({
                    to: `/manage/user/${record.id}`,
                  })
                }
              >
                详情
              </Button>
              <Popconfirm
                title="确认删除吗？"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button danger size="small">
                  删除
                </Button>
              </Popconfirm>
            </div>
          ),
        },
      ];
    },
    pagination: {
      showQuickJumper: true,
    },
  });

  const {
    checkedRowKeys,
    handleAdd,
    handleEdit,
    onBatchDeleted,
    onDeleted,
    rowSelection,
  } = useTableOperate(
    tableProps.dataSource || [],
    getData,
    async (res, type) => {
      if (type === "add") {
        // add request 调用新增的接口
        console.log(res);
      } else {
        // edit request 调用编辑的接口
        console.log(res);
      }
    }
  );

  async function handleBatchDelete() {
    // request
    console.log(checkedRowKeys);
    onBatchDeleted();
  }

  function handleDelete(id: number) {
    // request
    console.log(id);

    onDeleted();
  }

  function edit(id: number) {
    handleEdit(id);
  }

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : "1"}
        items={[
          {
            key: "1",
            label: "搜索",
            children: <UserSearch {...searchProps} />,
          },
        ]}
      />

      <Card
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title="用户列表"
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            columns={columnChecks}
            disabledDelete={checkedRowKeys.length === 0}
            loading={loading}
            refresh={getData}
            setColumnChecks={setColumnChecks}
            onDelete={handleBatchDelete}
          />
        }
      >
        <Table
          rowSelection={rowSelection}
          scroll={scrollConfig}
          size="small"
          {...tableProps}
        />
      </Card>
    </div>
  );
}

export default User;
