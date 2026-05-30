import { SettingOutlined } from "@ant-design/icons";
import { Button, Checkbox, Popover } from "antd";
import type { ColumnsType } from "antd/lib/table";
import React, { useMemo } from "react";

import SortableTable from "../SortableTable";
import type { ColumnConfig } from "../utils/table";
import { toColumnType } from "../utils/table";

interface ColumnSettingButtonProps {
  columnConfigs: ColumnConfig[];
  onChange: (value: ColumnConfig[]) => void;
  onReset: () => void;
}

const ColumnSettingButton: React.FC<ColumnSettingButtonProps> = ({ columnConfigs, onChange, onReset }) => {
  const tableColumns = useMemo<ColumnsType>(() => {
    return [
      toColumnType({
        key: "field",
        title: "字段",
        dataIndex: "field",
        render: ({ record }) => record.title,
      }),
      toColumnType({
        key: "visible",
        title: "显示",
        align: "center",
        width: 60,
        dataIndex: "visible",
        render: ({ record, index }) => (
          <Checkbox
            checked={!record.hidden}
            onChange={(event) => {
              const _columnConfigs = [...columnConfigs.map((item) => ({ ...item }))];
              _columnConfigs[index].hidden = !event.target.checked;
              onChange(_columnConfigs);
            }}
          />
        ),
      }),
    ];
  }, [columnConfigs, onChange]);

  return (
    <Popover
      content={
        <div style={{ width: "360px" }}>
          <SortableTable
            rowKey="key"
            columns={tableColumns}
            dataSource={columnConfigs}
            size="small"
            scroll={{ x: "max-content", y: 320 }}
            onDrag={(items) => onChange(items)}
          />

          <Button type="default" block={true} onClick={onReset} style={{ marginTop: "12px" }}>
            重置
          </Button>
        </div>
      }
      placement="topRight"
      trigger="click"
    >
      <Button type="default" icon={<SettingOutlined />}></Button>
    </Popover>
  );
};

export default ColumnSettingButton;
