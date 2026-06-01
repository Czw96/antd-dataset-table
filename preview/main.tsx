import "antd/dist/reset.css";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { DataTable } from "../src";
import type { ColumnItem } from "../src/DataTable";

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

const columns: ColumnItem<DemoItem>[] = [
  { key: "id", title: "ID", dataIndex: "id", width: 80, sorter: true },
  { key: "name", title: "姓名", dataIndex: "name", width: 120 },
  { key: "age", title: "年龄", dataIndex: "age", width: 80, sorter: true },
  { key: "address", title: "地址", dataIndex: "address" },
];

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<DemoItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  return (
    <div style={{ padding: 24 }}>
      <h2>antd-data-table Preview</h2>
      <DataTable<DemoItem>
        rowKey="id"
        columns={columns}
        dataSource={mockData}
        rowActionRender={(record) => (
          <a onClick={() => alert(`查看: ${record.name}`)}>查看</a>
        )}
        rowSelection={{
          onChange: setSelectedItems,
          batchActionRender: (records) => (
            <button onClick={() => alert(`已选 ${records.length} 项`)} style={{ padding: "4px 16px" }}>
              批量操作
            </button>
          ),
        }}
        pagination={{
          page,
          pageSize,
          totalCount: mockData.length,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
