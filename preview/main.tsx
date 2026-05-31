import "antd/dist/reset.css";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { DataTable } from "../src";
import type { ColumnProps } from "../src/utils/table";

interface DemoItem {
  id: number;
  name: string;
  age: number;
  address: string;
}

const mockData: DemoItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  age: 20 + (i % 30),
  address: `地址 ${i + 1}`,
}));

const dataColumns: ColumnProps<DemoItem>[] = [
  { key: "id", title: "ID", dataIndex: "id", width: 80, sorter: true },
  { key: "name", title: "姓名", dataIndex: "name", width: 120 },
  { key: "age", title: "年龄", dataIndex: "age", width: 80, sorter: true },
  { key: "address", title: "地址", dataIndex: "address" },
];

const actionColumn: ColumnProps<DemoItem> = {
  key: "action",
  title: "操作",
  dataIndex: "action",
  width: 120,
  render: ({ record }) => <a onClick={() => alert(`查看: ${record.name}`)}>查看</a>,
};

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<DemoItem[]>([]);

  return (
    <div style={{ padding: 24 }}>
      <h2>antd-data-table Preview</h2>
      <DataTable<DemoItem>
        id="demo-table"
        rowKey="id"
        dataColumns={dataColumns}
        actionColumn={actionColumn}
        dataSource={mockData}
        dataCount={mockData.length}
        batchAction={{
          component: (
            <button onClick={() => alert(`已选 ${selectedItems.length} 项`)} style={{ padding: "4px 16px" }}>
              批量操作
            </button>
          ),
          selectedRowItems: selectedItems,
          onChange: setSelectedItems,
        }}
      />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
