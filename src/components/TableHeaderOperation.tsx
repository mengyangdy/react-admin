import { Button, Popconfirm, Space } from "antd";
import type { SpaceProps } from "antd";
import classNames from "classnames";
import React from "react";
import type { FC } from "react";

import DragContent from "./DragContent";

interface Props {
  add: () => void;
  children?: React.ReactNode;
  columns: AntDesign.TableColumnCheck[];
  disabledDelete?: boolean;
  itemAlign?: SpaceProps["align"];
  loading?: boolean;
  onDelete: () => void;
  prefix?: React.ReactNode;
  refresh: () => void;
  setColumnChecks: (checks: AntDesign.TableColumnCheck[]) => void;
  suffix?: React.ReactNode;
}

const TableHeaderOperation: FC<Props> = ({
  add,
  children,
  columns,
  disabledDelete,
  itemAlign,
  loading,
  onDelete,
  prefix,
  refresh,
  setColumnChecks,
  suffix,
}) => {
  return (
    <Space wrap align={itemAlign} className="lt-sm:w-200px">
      {prefix}
      {children || (
        <>
          <Button
            ghost
            icon={<IconIcRoundPlus className="text-icon" />}
            size="small"
            type="primary"
            onClick={add}
          >
            新增
          </Button>
          <Popconfirm title="确认删除吗?" onConfirm={onDelete}>
            <Button
              danger
              ghost
              disabled={disabledDelete}
              icon={<IconIcRoundDelete className="text-icon" />}
              size="small"
            >
              批量删除
            </Button>
          </Popconfirm>
        </>
      )}
      <Button
        icon={
          <IconMdiRefresh
            className={classNames("text-icon", { "animate-spin": loading })}
          />
        }
        size="small"
        onClick={refresh}
      >
        刷新
      </Button>

      <Popover
        placement="bottomRight"
        trigger="click"
        content={
          <DragContent columns={columns} setColumnChecks={setColumnChecks} />
        }
      >
        <Button icon={<IconAntDesignSettingOutlined />} size="small">
          列设置
        </Button>
      </Popover>

      {suffix}
    </Space>
  );
};

export default TableHeaderOperation;
