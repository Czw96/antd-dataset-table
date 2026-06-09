<p align="center">
  <h1 align="center">antd-dataset-table</h1>
  <p align="center">基于 Ant Design 的功能增强表格组件，内置批量选择、列配置、自适应高度等能力。</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/antd-dataset-table"><img src="https://img.shields.io/npm/v/antd-dataset-table" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/antd-dataset-table"><img src="https://img.shields.io/npm/dm/antd-dataset-table" alt="npm downloads" /></a>
  <a href="https://github.com/Czw96/antd-dataset-table/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/antd-dataset-table" alt="license" /></a>
  <a href="https://github.com/Czw96/antd-dataset-table"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome" /></a>
</p>

中文 | [English](https://github.com/Czw96/antd-dataset-table/blob/master/README_EN.md)

---

## 安装

```bash
npm install antd-dataset-table
```

## 在线演示

[antd-dataset-table demo](https://czw96.github.io/antd-dataset-table/)

本地启动预览：

```bash
npm run preview
```

## 依赖要求

| 依赖 | 版本 |
|------|------|
| react | >=18.2.0 |
| react-dom | >=18.2.0 |
| antd | >=6.0.0 |
| @ant-design/icons | >=5.0.0 |

## 使用示例

```tsx
import { DataTable } from "antd-dataset-table";
import type { ColumnItem } from "antd-dataset-table";

interface User {
  id: number;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnItem<User>[] = [
  { key: "id", title: "ID", dataIndex: "id", width: 80, sorter: true },
  { key: "name", title: "姓名", dataIndex: "name", width: 120 },
  { key: "age", title: "年龄", dataIndex: "age", width: 80, sorter: true },
  { key: "address", title: "地址", dataIndex: "address" },
];

function App() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <DataTable<User>
      name="users-table"
      rowKey="id"
      columns={columns}
      dataSource={users}
      paginationConfig={{
        page: 1,
        pageSize: 15,
        totalCount: users.length,
        onChange: (page, pageSize) => console.log(page, pageSize),
      }}
    />
  );
}
```

### 完整功能示例

```tsx
<DataTable<User>
  name="users-table"
  rowKey="id"
  columns={columns}
  dataSource={users}
  loading={false}
  size="middle"
  expandable={{
    expandedRowRender: (record) => <div>{record.name} 的详情</div>,
  }}
  rowActionRender={(record) => <a>查看</a>}
  selectionConfig={{
    displayColumnKeys: ["id", "name"],
    batchActionRender: (records) => <button>批量删除</button>,
    onChange: (records) => setSelectedItems(records),
  }}
  paginationConfig={{
    page: 1,
    pageSize: 15,
    totalCount: total,
    pageSizeOptions: [20, 50, 100],
    onChange: (page, pageSize) => fetchData(page, pageSize),
  }}
  extraActionRender={() => <button>新增</button>}
  onSortChange={(sortKey) => fetchSortedData(sortKey)}
/>
```

## API

`DataTableProps` 继承 `TableProps`（排除了 `rowKey`、`columns`、`rowSelection`、`pagination`、`sticky`、`showSorterTooltip`、`scroll`），因此 antd Table 的标准属性（`loading`、`size`、`bordered`、`expandable`、`locale` 等）可直接使用。`scroll` 由组件根据容器高度自动计算，`showSorterTooltip` 内部固定为 `false`。

### DataTableProps

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | — | 表格标识，用于 localStorage 列配置持久化。同名表格共享列配置 |
| `rowKey` | `string` | `"id"` | 行唯一标识字段 |
| `columns` | `ColumnItem<RecordType>[]` | — | 数据列配置（必填） |
| `dataSource` | `RecordType[]` | — | 数据源（必填） |
| `selectionConfig` | `SelectionConfig<RecordType>` | — | 多选配置，传入后表格底部显示多选操作栏 |
| `rowActionRender` | `(record: RecordType) => ReactNode` | — | 操作列渲染函数，返回操作列内容 |
| `paginationConfig` | `PaginationConfig` | — | 分页配置，传入后表格底部显示分页组件 |
| `extraActionRender` | `() => ReactNode` | — | 底部左侧额外操作渲染，位于多选按钮区域 |
| `onSortChange` | `(sortKey?: string) => void` | — | 排序变更回调，`sortKey` 格式为 `"field"`（升序）或 `"-field"`（降序），`undefined` 表示取消排序 |

### ColumnItem

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `key` | `string` | — | 列唯一标识（必填） |
| `title` | `string` | — | 列标题 |
| `dataIndex` | `string \| string[]` | — | 数据字段 |
| `width` | `number` | — | 列宽度（px） |
| `sorter` | `boolean` | — | 是否可排序 |
| `hidden` | `boolean` | — | 是否默认隐藏（可通过列配置面板显示） |
| `align` | `"left" \| "right" \| "center"` | — | 对齐方式 |
| `fixed` | `"left" \| "right"` | — | 固定列 |
| `render` | `({ record, index }: { record: RecordType; index: number }) => ReactNode` | — | 自定义渲染，不传时按 `dataIndex` 取值显示 |

> 继承 antd `ColumnType` 的所有其他属性（除 `key`、`title`、`dataIndex`、`render` 外），如 `filters`、`onFilter`、`ellipsis` 等均可使用。

### SelectionConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `displayColumnKeys` | `string[]` | — | 已选面板中展示的列 key（必填） |
| `batchActionRender` | `(records: RecordType[]) => ReactNode` | — | 批量操作按钮渲染 |
| `onChange` | `(records: RecordType[]) => void` | — | 选中项变更回调 |

### PaginationConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | `number \| string` | `1` | 当前页码 |
| `pageSize` | `number \| string` | `15` | 每页条数 |
| `totalCount` | `number` | — | 数据总数（必填） |
| `pageSizeOptions` | `number[]` | `[10,15,20,30,50,100]` | 每页条数可选项 |
| `onChange` | `(page: number, pageSize: number) => void` | — | 页码变更回调 |

### 导出类型

| 导出 | 说明 |
|------|------|
| `DataTable` | 表格组件 |
| `DataTableProps` | 表格 Props 类型 |
| `ColumnItem` | 列配置类型 |
| `ColumnConfig` | 列配置状态类型（ColumnSetting 使用） |
| `SelectionConfig` | 多选配置类型 |
| `PaginationConfig` | 分页配置类型 |

## 功能特性

- **自适应高度**：通过 ResizeObserver 自动计算表格可用高度，填充容器剩余空间。首次渲染同步计算避免闪烁，后续从 DOM 实测表头/页脚真实高度，自定义主题自动适配。
- **列配置持久化**：拖拽排序、显示/隐藏列配置自动保存到 localStorage，刷新不丢失。`name` 相同的表格共享配置。
- **批量选择**：内置多选模式，支持已选面板（逐行移除、全部移除、批量操作）。
- **排序联动**：通过 `onSortChange` 向上层传递排序状态，格式为 `"field"` / `"-field"` / `undefined`。

## 本地开发

```bash
git clone https://github.com/Czw96/antd-dataset-table.git
cd antd-dataset-table
npm install

npm run dev         # 监听构建
npm run build       # 生产构建
npm run preview     # 启动预览页面
```

## 许可证

MIT © Czw96
