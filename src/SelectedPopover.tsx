import { Button, Popover, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface SelectedPopoverProps<RecordType> {
  selectedItems: RecordType[];
}

// 已选项弹出面板：显示已选数量按钮，点击展开 Popover，内含可移除已选项的 Table
const SelectedPopover = <RecordType extends Record<string, unknown>>({ selectedItems }: SelectedPopoverProps<RecordType>) => {
  if (count === 0) return null;

  const actionColumn: ColumnsType<RecordType>[number] = {
    title: "操作",
    key: "_selected_popover_action",
    width: 60,
    render: (_, record) => (
      <Button type="link" size="small" onClick={() => onDeselect([record])}>
        移除
      </Button>
    ),
  };

  return (
    <Popover
      title="已选择项"
      content={
        <div style={{ width: 500, maxHeight: 400, overflow: "auto" }}>
          <Table<RecordType>
            rowKey={rowKey}
            columns={[...columns, actionColumn]}
            dataSource={selectedItems}
            size="small"
            pagination={false}
          />
        </div>
      }
      trigger="click"
    >
      <Button type="default" style={{ width: 160 }}>
        已选择 {count} 项
      </Button>
    </Popover>
  );
};

export default SelectedPopover;
