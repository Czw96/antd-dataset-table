<p align="center">
  <h1 align="center">antd-dataset-table</h1>
  <p align="center">A feature-rich data table component for Ant Design, with batch selection, column configuration, and auto-height support.</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/antd-dataset-table"><img src="https://img.shields.io/npm/v/antd-dataset-table" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/antd-dataset-table"><img src="https://img.shields.io/npm/dm/antd-dataset-table" alt="npm downloads" /></a>
  <a href="https://github.com/Czw96/antd-dataset-table/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/antd-dataset-table" alt="license" /></a>
  <a href="https://github.com/Czw96/antd-dataset-table"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome" /></a>
</p>

English | [中文](https://github.com/Czw96/antd-dataset-table/blob/master/README.md)

---

## Installation

```bash
npm install antd-dataset-table
```

## Demo

[Online demo](https://demo.29dev.cn/antd-dataset-table/)

Run locally:

```bash
npm run preview
```

## Peer Dependencies

| Package | Version |
|---------|---------|
| react | >=18.2.0 |
| react-dom | >=18.2.0 |
| antd | >=6.0.0 |
| @ant-design/icons | >=5.0.0 |

## Usage

```tsx
import { DatasetTable } from "antd-dataset-table";
import type { ColumnItem } from "antd-dataset-table";

interface User {
  id: number;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnItem<User>[] = [
  { key: "id", title: "ID", dataIndex: "id", width: 80, sorter: true },
  { key: "name", title: "Name", dataIndex: "name", width: 120 },
  { key: "age", title: "Age", dataIndex: "age", width: 80, sorter: true },
  { key: "address", title: "Address", dataIndex: "address" },
];

function App() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <DatasetTable<User>
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

### Full Example

```tsx
<DatasetTable<User>
  name="users-table"
  rowKey="id"
  columns={columns}
  dataSource={users}
  loading={false}
  size="middle"
  expandable={{
    expandedRowRender: (record) => <div>Details for {record.name}</div>,
  }}
  rowActionRender={(record) => <a>View</a>}
  selectionConfig={{
    displayColumnKeys: ["id", "name"],
    batchActionRender: (records) => <button>Batch Delete</button>,
    onChange: (records) => setSelectedItems(records),
  }}
  paginationConfig={{
    page: 1,
    pageSize: 15,
    totalCount: total,
    pageSizeOptions: [20, 50, 100],
    onChange: (page, pageSize) => fetchData(page, pageSize),
  }}
  extraActionRender={() => <button>Add</button>}
  onSortChange={(sortKey) => fetchSortedData(sortKey)}
/>
```

## API

`DatasetTableProps` extends `TableProps` (with `rowKey`, `columns`, `rowSelection`, `pagination`, `sticky`, `showSorterTooltip`, and `scroll` omitted). All standard antd Table props (`loading`, `size`, `bordered`, `expandable`, `locale`, etc.) work as usual. `scroll` is auto-calculated from container height, and `showSorterTooltip` is forced to `false`.

### DatasetTableProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Table identifier for localStorage column config persistence. Tables with the same name share column configs |
| `rowKey` | `string` | `"id"` | Unique row key field |
| `columns` | `ColumnItem<RecordType>[]` | — | Column definitions (required) |
| `dataSource` | `RecordType[]` | — | Data source (required) |
| `selectionConfig` | `SelectionConfig<RecordType>` | — | Batch selection config. When provided, a multi-select toolbar appears in the footer |
| `rowActionRender` | `(record: RecordType) => ReactNode` | — | Render function for the action column |
| `paginationConfig` | `PaginationConfig` | — | Pagination config. When provided, pagination appears in the footer |
| `extraActionRender` | `() => ReactNode` | — | Extra action rendered at the footer left, alongside the multi-select button area |
| `onSortChange` | `(sortKey?: string) => void` | — | Sort change callback. Format: `"field"` (asc), `"-field"` (desc), `undefined` (no sort) |

### ColumnItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `string` | — | Unique column identifier (required) |
| `title` | `string` | — | Column header text |
| `dataIndex` | `string \| string[]` | — | Data field path |
| `width` | `number` | — | Column width in pixels |
| `sorter` | `boolean` | — | Whether the column is sortable |
| `hidden` | `boolean` | — | Whether the column is hidden by default (can be shown via column config panel) |
| `align` | `"left" \| "right" \| "center"` | — | Text alignment |
| `fixed` | `"left" \| "right"` | — | Fixed column |
| `render` | `({ record, index }: { record: RecordType; index: number }) => ReactNode` | — | Custom render. Falls back to `dataIndex` value when not provided |

> Inherits all other antd `ColumnType` properties (except `key`, `title`, `dataIndex`, `render`), such as `filters`, `onFilter`, `ellipsis`, etc.

### SelectionConfig

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `displayColumnKeys` | `string[]` | — | Column keys to display in the selection panel (required) |
| `batchActionRender` | `(records: RecordType[]) => ReactNode` | — | Batch action button render |
| `onChange` | `(records: RecordType[]) => void` | — | Selection change callback |

### PaginationConfig

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number \| string` | `1` | Current page number |
| `pageSize` | `number \| string` | `15` | Page size |
| `totalCount` | `number` | — | Total record count (required) |
| `pageSizeOptions` | `number[]` | `[10,15,20,30,50,100]` | Page size selector options |
| `onChange` | `(page: number, pageSize: number) => void` | — | Page change callback |

### Exported Types

| Export | Description |
|--------|-------------|
| `DatasetTable` | The table component |
| `DatasetTableProps` | Table props type |
| `ColumnItem` | Column definition type |
| `ColumnConfig` | Column config state type (used by ColumnSetting) |
| `SelectionConfig` | Multi-select config type |
| `PaginationConfig` | Pagination config type |

## Features

- **Auto Height**: Automatically calculates table body height via ResizeObserver to fill the remaining container space. First render runs synchronously to avoid flicker; subsequent measurements use actual DOM heights for header/footer, adapting to custom themes.
- **Column Config Persistence**: Drag-to-reorder and show/hide column preferences are saved to localStorage. Tables sharing the same `name` also share configs.
- **Batch Selection**: Built-in multi-select mode with a selection panel (remove one, remove all, batch actions).
- **Sort Integration**: Propagates sort state via `onSortChange` in `"field"` / `"-field"` / `undefined` format.

## Development

```bash
git clone https://github.com/Czw96/antd-dataset-table.git
cd antd-dataset-table
npm install

npm run dev         # watch build
npm run build       # production build
npm run preview     # start preview page
```

## License

MIT © Czw96
