import { Button, Flex, Popover, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useMemo, useRef } from "react";

import type { ColumnItem } from "./DataTable";

interface SelectedPopoverProps<RecordType> {
  rowKey: string;
  dataColumns: ColumnItem<RecordType>[];
  displayColumnKeys: string[];
  dataSource: RecordType[];
  onChange?: (items: RecordType[]) => void;
}

// 已选项弹出面板：显示已选数量按钮，点击展开 Popover，内含可逐行移除的 Table
const SelectedPopover = <RecordType extends Record<string, unknown>>({
  rowKey,
  dataColumns,
  displayColumnKeys,
  dataSource,
  onChange,
}: SelectedPopoverProps<RecordType>) => {
  const dataSourceRef = useRef(dataSource);
  const onChangeRef = useRef(onChange);
  dataSourceRef.current = dataSource;
  onChangeRef.current = onChange;

  const handleRemoveItem = useCallback(
    (itemKey: unknown) => {
      onChangeRef.current?.(dataSourceRef.current.filter((item) => item[rowKey] !== itemKey));
    },
    [rowKey]
  );

  const handleRemoveAll = useCallback(() => {
    onChangeRef.current?.([]);
  }, []);

  const indexColumn = useMemo<ColumnsType<RecordType>[number]>(
    () => ({
      title: "序号",
      dataIndex: "index",
      width: 60,
      align: "center",
      fixed: "left",
      render: (_value, _record, index) => index + 1,
    }),
    []
  );

  const tableColumns = useMemo<ColumnsType<RecordType>>(() => {
    // 根据 displayColumnKeys 过滤要显示的列
    const filteredColumns = dataColumns
      .filter((col) => displayColumnKeys.includes(col.key))
      .map((column) => ({ key: column.key, title: column.title ?? "", dataIndex: column.dataIndex }));

    const actionColumn: ColumnsType<RecordType>[number] = {
      key: "action",
      title: "操作",
      dataIndex: "action",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Button type="link" size="small" danger onClick={() => handleRemoveItem(record[rowKey])}>
          移除
        </Button>
      ),
    };

    return [indexColumn, ...filteredColumns, actionColumn];
  }, [dataColumns, indexColumn, displayColumnKeys, handleRemoveItem, rowKey]);

  return (
    <Popover
      content={
        <Flex vertical gap={8} style={{ width: 480, minHeight: 160 }}>
          <Flex flex={1} style={{ overflow: "auto" }}>
            <Table<RecordType>
              rowKey={rowKey}
              size="small"
              sticky={true}
              columns={tableColumns}
              dataSource={dataSource}
              scroll={{ x: "max-content", y: 320 }}
              showSorterTooltip={false}
              pagination={false}
              style={{ width: "100%" }}
            />
          </Flex>
          <Button type="primary" danger block onClick={handleRemoveAll}>
            全部移除
          </Button>
        </Flex>
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
