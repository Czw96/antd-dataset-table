import { Button, Popover, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";

import type { ColumnItem } from "./DataTable";

interface SelectedPopoverProps<RecordType> {
  rowKey: string;
  dataColumns: ColumnItem<RecordType>[];
  dataSource: RecordType[];
  onChange?: (items: RecordType[]) => void;
  size?: "middle" | "small";
  maxHeight?: number;
  width?: number;
}

// 已选项弹出面板：显示已选数量按钮，点击展开 Popover，内含可逐行移除的 Table
const SelectedPopover = <RecordType extends Record<string, unknown>>({
  rowKey,
  dataColumns,
  dataSource,
  onChange,
  size = "small",
  maxHeight = 320,
  width = 400,
}: SelectedPopoverProps<RecordType>) => {
  const tableColumns = useMemo<ColumnsType<RecordType>>(() => {
    const actionColumn: ColumnsType<RecordType>[number] = {
      key: "action",
      title: "操作",
      dataIndex: "action",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          danger
          onClick={() => onChange?.(dataSource.filter((item) => item[rowKey] !== record[rowKey]))}
        >
          移除
        </Button>
      ),
    };

    return [...(dataColumns as ColumnsType<RecordType>), actionColumn];
  }, [dataColumns, dataSource, onChange, rowKey]);

  return (
    <Popover
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>已选择项</span>
          <Button type="link" size="small" danger onClick={() => onChange?.([])}>
            全部移除
          </Button>
        </div>
      }
      content={
        <div style={{ width, minHeight: 160 }}>
          <Table<RecordType>
            rowKey={rowKey as string}
            size={size}
            sticky
            columns={tableColumns}
            dataSource={dataSource}
            scroll={{ x: "max-content", y: maxHeight }}
            showSorterTooltip={false}
            pagination={false}
          />
        </div>
      }
      trigger="click"
    >
      <Button type="default" style={{ width: 160 }}>
        已选择 {dataSource.length} 项
      </Button>
    </Popover>
  );
};

export default SelectedPopover;
