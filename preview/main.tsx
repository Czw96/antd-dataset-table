import { Button, Card, Divider, Space, Switch, Tag, Typography, message } from "antd";
import "antd/dist/reset.css";
import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { DataTable } from "../src";
import type { ColumnItem } from "../src/DataTable";

interface DemoItem {
  id: number;
  name: string;
  age: number;
  address: string;
}

const total = 15;

const baseColumns: ColumnItem<DemoItem>[] = [
  { key: "id", title: "ID", dataIndex: "id", width: 80 },
  { key: "name", title: "姓名", dataIndex: "name", width: 120, sorter: true },
  { key: "age", title: "年龄", dataIndex: "age", width: 80, sorter: true },
  { key: "address", title: "地址", dataIndex: "address" },
];

const App: React.FC = () => {
  const [hasData, setHasData] = useState(true);
  const [showSelection, setShowSelection] = useState(true);
  const [selectionFixed, setSelectionFixed] = useState(false);
  const [showExpandable, setShowExpandable] = useState(true);
  const [showRowAction, setShowRowAction] = useState(true);
  const [showPagination, setShowPagination] = useState(true);
  const [showExtraAction, setShowExtraAction] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const dataSource = useMemo<DemoItem[]>(
    () =>
      Array.from({ length: total }, (_, i) => ({
        id: i + 1,
        name: `用户 ${i + 1}`,
        age: 20 + (i % 30),
        address: `地址 ${i + 1}`,
      })),
    []
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f5f5f5" }}>
      {/* ─── 左侧配置面板 ─── */}
      <div
        style={{
          width: 280,
          padding: "20px 16px",
          background: "#fff",
          borderRight: "1px solid #e8e8e8",
          overflow: "auto",
          flexShrink: 0,
        }}
      >
        <Typography.Title level={5} style={{ margin: "0 0 20px", color: "#1a1a1a" }}>
          DataTable Props
        </Typography.Title>

        <ConfigItem
          label="dataSource"
          desc={hasData ? `${total} 条数据` : "空数组"}
          checked={hasData}
          onChange={setHasData}
          color={hasData ? "#52c41a" : "#ff4d4f"}
        />

        <Divider style={{ margin: "12px 0" }} />

        <ConfigItem
          label="selectionConfig"
          desc={showSelection ? (selectionFixed ? "始终多选" : "手动开启") : "禁用"}
          checked={showSelection}
          onChange={setShowSelection}
          color={showSelection ? "#1677ff" : undefined}
        />
        {showSelection && (
          <div style={{ paddingLeft: 16, marginTop: 4, marginBottom: 8 }}>
            <ConfigItem label="始终多选" checked={selectionFixed} onChange={setSelectionFixed} compact />
          </div>
        )}

        <Divider style={{ margin: "12px 0" }} />

        <ConfigItem
          label="expandable"
          desc="行展开详情"
          checked={showExpandable}
          onChange={setShowExpandable}
          color={showExpandable ? "#1677ff" : undefined}
        />
        <ConfigItem
          label="rowActionRender"
          desc="操作列"
          checked={showRowAction}
          onChange={setShowRowAction}
          color={showRowAction ? "#1677ff" : undefined}
        />
        <ConfigItem
          label="paginationConfig"
          desc="底部分页"
          checked={showPagination}
          onChange={setShowPagination}
          color={showPagination ? "#1677ff" : undefined}
        />
        <ConfigItem
          label="extraActionRender"
          desc="自定义按钮"
          checked={showExtraAction}
          onChange={setShowExtraAction}
          color={showExtraAction ? "#1677ff" : undefined}
        />
      </div>

      {/* ─── 右侧预览区 ─── */}
      <div style={{ flex: 1, padding: 8, height: "100vh", overflow: "auto" }}>
        <Card
          title={
            <Space>
              <span>预览</span>
              <Tag color="blue">DemoItem</Tag>
            </Space>
          }
          style={{ height: "100%" }}
        >
          <DataTable<DemoItem>
            name="demo-table"
            rowKey="id"
            columns={baseColumns}
            dataSource={hasData ? dataSource : []}
            expandable={
              showExpandable
                ? {
                    expandedRowRender: (record) => (
                      <p style={{ margin: 0, color: "#666" }}>
                        {record.name} 住在 {record.address}，年龄 {record.age} 岁。
                      </p>
                    ),
                  }
                : undefined
            }
            selectionConfig={
              showSelection
                ? {
                    fixed: selectionFixed,
                    displayColumnKeys: ["id", "name", "age"],
                    onChange: (records) => message.info(`已选 ${records.length} 项`),
                    batchActionRender: (records) => (
                      <Button type="primary" onClick={() => message.info(`批量操作 ${records.length} 条`)}>
                        批量操作
                      </Button>
                    ),
                  }
                : undefined
            }
            rowActionRender={
              showRowAction
                ? (record) => (
                    <Button type="link" size="small" onClick={() => message.info(`查看: ${record.name}`)}>
                      查看
                    </Button>
                  )
                : undefined
            }
            paginationConfig={
              showPagination
                ? {
                    page,
                    pageSize,
                    totalCount: hasData ? total : 0,
                    onChange: (p, ps) => {
                      setPage(p);
                      setPageSize(ps);
                    },
                  }
                : undefined
            }
            extraActionRender={
              showExtraAction ? () => <Button onClick={() => message.info("自定义操作")}>自定义</Button> : undefined
            }
          />
        </Card>
      </div>
    </div>
  );
};

// ─── 配置项组件 ───
const ConfigItem: React.FC<{
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
  compact?: boolean;
}> = ({ label, desc, checked, onChange, color, compact }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: compact ? "4px 0" : "8px 0",
    }}
  >
    <div>
      <code style={{ fontSize: 13, color: "#1a1a1a" }}>{label}</code>
      {desc && (
        <span style={{ fontSize: 12, marginLeft: 8 }}>
          <Tag color={color} style={{ margin: 0 }}>
            {desc}
          </Tag>
        </span>
      )}
    </div>
    <Switch size="small" checked={checked} onChange={onChange} />
  </div>
);

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
