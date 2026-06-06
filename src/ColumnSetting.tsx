import { SettingOutlined } from "@ant-design/icons";
import { Button, Checkbox, Popover } from "antd";
import type { ColumnItem } from "antd-draggable-table";
import { DraggableTable } from "antd-draggable-table";
import React, { useMemo, useRef } from "react";

export interface ColumnConfig {
  key: string;
  title: string;
  visible: boolean;
}

interface ColumnSettingProps {
  columnConfigs: ColumnConfig[];
  onChange: (items: ColumnConfig[]) => void;
  onReset: () => void;
}

const ColumnSetting: React.FC<ColumnSettingProps> = ({ columnConfigs, onChange, onReset }) => {
  // 通过 ref 确保拖拽/切换回调始终读取最新数据, 避免闭包陷阱
  const columnConfigsRef = useRef(columnConfigs);
  columnConfigsRef.current = columnConfigs;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const tableColumns = useMemo<ColumnItem<ColumnConfig>[]>(
    () => [
      {
        key: "title",
        title: "字段",
        dataIndex: "title",
        render: ({ record }) => record.title,
      },
      {
        key: "visible",
        title: "显示",
        dataIndex: "visible",
        width: 60,
        align: "center",
        render: ({ record, index }) => (
          <Checkbox
            checked={record.visible}
            onChange={(event) => {
              const newConfigs = [...columnConfigsRef.current];
              newConfigs[index] = { ...newConfigs[index], visible: event.target.checked };
              onChangeRef.current(newConfigs);
            }}
          />
        ),
      },
    ],
    []
  );

  const handleDrag = useMemo(
    () => (items: ColumnConfig[]) => {
      onChange(items);
    },
    [onChange]
  );

  const content = useMemo(
    () => (
      <div style={{ width: 240 }}>
        <DraggableTable<ColumnConfig>
          rowKey="key"
          columns={tableColumns}
          dataSource={columnConfigs}
          size="small"
          scroll={{ x: "max-content", y: 360 }}
          onDrag={handleDrag}
        />
        <Button type="primary" block style={{ marginTop: 12 }} onClick={onReset}>
          重置
        </Button>
      </div>
    ),
    [tableColumns, columnConfigs, handleDrag, onReset]
  );

  return (
    <Popover content={content} placement="topRight" trigger="click">
      <Button type="default" icon={<SettingOutlined />} />
    </Popover>
  );
};

export default ColumnSetting;
