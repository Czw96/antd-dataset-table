import { Button, Card, ConfigProvider, Divider, Select, Space, Switch, Tag, Typography, message } from "antd";
import "antd/dist/reset.css";
import zhCN from "antd/locale/zh_CN";
import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { DataTable } from "../src";
import type { ColumnItem } from "../src/DataTable";

interface DemoItem {
  id: number;
  name: string;
  age: number;
  address: string;
  email: string;
  status: "active" | "inactive";
}

const DATA_COUNT_OPTIONS = [
  { value: 0, label: "0 (空)" },
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const baseColumns: ColumnItem<DemoItem>[] = [
  { key: "id", title: "ID", dataIndex: "id", width: 60, align: "center" },
  { key: "name", title: "姓名", dataIndex: "name", sorter: true, ellipsis: true },
  { key: "age", title: "年龄", dataIndex: "age", sorter: true, width: 80, align: "center" },
  { key: "address", title: "地址", dataIndex: "address", ellipsis: true },
  { key: "email", title: "邮箱", dataIndex: "email", ellipsis: true },
  { key: "status", title: "状态", dataIndex: "status", width: 80, align: "center" },
];

const App: React.FC = () => {
  // 数据源
  const [dataCount, setDataCount] = useState(25);
  // 功能开关
  const [showSelection, setShowSelection] = useState(true);
  const [showExpandable, setShowExpandable] = useState(true);
  const [showRowAction, setShowRowAction] = useState(true);
  const [showPagination, setShowPagination] = useState(true);
  const [showExtraAction, setShowExtraAction] = useState(true);
  // 表格属性
  const [tableSize, setTableSize] = useState<"small" | "middle" | "large">("small");
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  // 分页
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // 状态展示
  const [sortKey, setSortKey] = useState<string>();
  const [selectedCount, setSelectedCount] = useState(0);

  const dataSource = useMemo<DemoItem[]>(() => {
    if (dataCount === 0) return [];
    return Array.from({ length: dataCount }, (_, i) => ({
      id: i + 1,
      name: `用户 ${i + 1}`,
      age: 20 + (i % 30),
      address: `地址 ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: (i % 3 === 0 ? "inactive" : "active") as "active" | "inactive",
    }));
  }, [dataCount]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f5f5f5" }}>
      {/* ─── 左侧配置面板 ─── */}
      <Sidebar>
        <Typography.Title level={5} style={{ margin: "0 0 16px" }}>
          DataTable Props
        </Typography.Title>

        {/* 数据源 */}
        <Section title="数据源">
          <Row>
            <Label style={{ margin: 0 }}>dataSource</Label>
            <Select
              size="small"
              value={dataCount}
              onChange={setDataCount}
              style={{ width: 100 }}
              options={DATA_COUNT_OPTIONS}
            />
          </Row>
        </Section>

        {/* 表格属性 */}
        <Section title="表格属性">
          <Row>
            <Label style={{ margin: 0 }}>size</Label>
            <Select
              size="small"
              value={tableSize}
              onChange={setTableSize}
              style={{ width: 100 }}
              options={[
                { value: "small", label: "small" },
                { value: "middle", label: "middle" },
                { value: "large", label: "large" },
              ]}
            />
          </Row>
          <SwitchItem label="bordered" checked={bordered} onChange={setBordered} />
          <SwitchItem label="loading" checked={loading} onChange={setLoading} />
        </Section>

        {/* 功能模块 */}
        <Section title="功能模块">
          <SwitchItem
            label="selectionConfig"
            desc={showSelection ? "手动开启" : "禁用"}
            checked={showSelection}
            onChange={setShowSelection}
          />
          <SwitchItem label="expandable" desc="行展开" checked={showExpandable} onChange={setShowExpandable} />
          <SwitchItem label="rowActionRender" desc="操作列" checked={showRowAction} onChange={setShowRowAction} />
          <SwitchItem label="paginationConfig" desc="分页" checked={showPagination} onChange={setShowPagination} />
          <SwitchItem label="extraActionRender" desc="额外按钮" checked={showExtraAction} onChange={setShowExtraAction} />
        </Section>

        {/* 实时状态 */}
        <Section title="实时状态">
          <StatusItem label="当前排序" value={sortKey ?? "无"} color={sortKey ? "#1677ff" : undefined} />
          <StatusItem label="已选中" value={`${selectedCount} 项`} color={selectedCount > 0 ? "#1677ff" : undefined} />
        </Section>
      </Sidebar>

      {/* ─── 右侧预览区 ─── */}
      <div style={{ flex: 1, padding: 8, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Card
          title={
            <Space>
              <span>预览</span>
              <Tag color="blue">Demo</Tag>
            </Space>
          }
          style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}
          styles={{ body: { flex: 1, padding: 0, overflow: "clip", display: "flex", flexDirection: "column", minHeight: 0 } }}
        >
          <DataTable<DemoItem>
            name="demo-table"
            rowKey="id"
            size={tableSize}
            columns={baseColumns}
            dataSource={dataSource}
            bordered={bordered}
            loading={loading}
            expandable={
              showExpandable
                ? {
                    expandedRowRender: (record) => (
                      <p style={{ margin: 0, color: "#666" }}>
                        {record.name} &mdash; {record.email} &mdash; {record.address}
                      </p>
                    ),
                  }
                : undefined
            }
            selectionConfig={
              showSelection
                ? {
                    displayColumnKeys: ["name", "age", "status"],
                    batchActionRender: (records) => (
                      <Button type="primary" onClick={() => message.info(`批量操作 ${records.length} 条`)}>
                        批量操作
                      </Button>
                    ),
                    onChange: (records) => setSelectedCount(records.length),
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
                    totalCount: dataCount,
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
            onSortChange={setSortKey}
          />
        </Card>
      </div>
    </div>
  );
};

// ─── 辅助组件 ───

/** 左侧面板容器 */
const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 320,
      padding: "20px 16px",
      background: "#fff",
      borderRight: "1px solid #e8e8e8",
      overflow: "auto",
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

/** 配置分区(带分隔线标题) */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 16 }}>
    <Divider
      titlePlacement="left"
      styles={{ content: { margin: 0 } }}
      style={{ margin: "0 0 8px", fontSize: 12, color: "#999" }}
    >
      {title}
    </Divider>
    {children}
  </div>
);

/** 开关组件(含标签和可选描述) */
const SwitchItem: React.FC<{
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}> = ({ label, desc, checked, onChange, color }) => (
  <Row>
    <div>
      <code style={{ fontSize: 13 }}>{label}</code>
      {desc && (
        <Tag color={color} style={{ marginLeft: 8 }}>
          {desc}
        </Tag>
      )}
    </div>
    <Switch size="small" checked={checked} onChange={onChange} />
  </Row>
);

/** Flex 行(space-between 对齐) */
const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>{children}</div>
);

/** 等宽字体标签 */
const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <code style={{ fontSize: 13, ...style }}>{children}</code>
);

/** 只读状态展示行 */
const StatusItem: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
    <span style={{ fontSize: 13, color: "#666" }}>{label}</span>
    <Tag color={color} style={{ margin: 0 }}>
      {value}
    </Tag>
  </div>
);

// ─── Entry ───

interface RootContainer extends HTMLElement {
  __reactRoot?: ReturnType<typeof createRoot>;
}

const container = document.getElementById("root") as RootContainer;
if (!container) throw new Error("Failed to find the root element");

let root = container.__reactRoot;
if (!root) {
  root = createRoot(container);
  container.__reactRoot = root;
}

root.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
);
