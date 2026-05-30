import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Table } from "antd";
import type { ColumnsType } from "antd/lib/table";
import { useCallback, useMemo } from "react";

import { DragHandle, SortableRow } from "./SortableRow";

interface SortableTableProps<RecordType> {
  rowKey: keyof RecordType;
  columns: ColumnsType;
  dataSource: RecordType[];
  size?: "small" | "middle" | "large";
  bordered?: boolean;
  scroll?: { x?: number | true | string; y?: number | string };
  onDrag: (items: RecordType[]) => void;
}

// 可拖拽排序表格组件
const SortableTable = <RecordType extends Record<keyof RecordType, unknown>>(props: SortableTableProps<RecordType>) => {
  const { rowKey, columns, dataSource, size = "small", bordered, scroll, onDrag } = props;

  const tableColumns = useMemo<ColumnsType<RecordType>>(() => {
    const dragColumn: ColumnsType<RecordType>[number] = {
      key: "sort",
      align: "center",
      width: 40,
      render: () => <DragHandle />,
    };

    return [dragColumn, ...columns];
  }, [columns]);

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (active.id !== over?.id) {
        const activeIndex = dataSource.findIndex((item) => item[rowKey] === active.id);
        const overIndex = dataSource.findIndex((item) => item[rowKey] === over?.id);
        onDrag(arrayMove(dataSource, activeIndex, overIndex));
      }
    },
    [rowKey, dataSource, onDrag]
  );

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext items={dataSource.map((item) => item[rowKey] as string)} strategy={verticalListSortingStrategy}>
        <Table
          rowKey={rowKey}
          components={{ body: { row: SortableRow } }}
          columns={tableColumns}
          dataSource={dataSource}
          size={size}
          pagination={false}
          bordered={bordered}
          scroll={scroll}
        />
      </SortableContext>
    </DndContext>
  );
};

export default SortableTable;
