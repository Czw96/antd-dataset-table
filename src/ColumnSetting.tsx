import { SettingOutlined } from "@ant-design/icons";
import { Button, Checkbox, Popover } from "antd";
import { DraggableTable, type ColumnItem } from "antd-draggable-table";
import { useCallback, useMemo } from "react";

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
  const handleDrag = useCallback(
    (items: ColumnConfig[]) => {
      onChange(items);
    },
    [onChange]
  );

  const tableColumns: ColumnItem<ColumnConfig>[] = useMemo(
    () => [
      { key: "field", title: "字段", dataIndex: "field", render: ({ record }) => record.title },
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
              const items = columnConfigs.map((item, itemIndex) =>
                itemIndex === index ? { ...item, visible: event.target.checked } : item
              );
              onChange(items);
            }}
          />
        ),
      },
    ],
    [columnConfigs, onChange]
  );

  const content = (
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
  );

  return (
    <Popover content={content} placement="topRight" trigger="click">
      <Button type="default" icon={<SettingOutlined />} />
    </Popover>
  );
};

export default ColumnSetting;
