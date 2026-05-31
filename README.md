# antd-data-table

[![npm version](https://img.shields.io/npm/v/antd-data-table.svg)](https://www.npmjs.com/package/antd-data-table)
[![npm downloads](https://img.shields.io/npm/dm/antd-data-table.svg)](https://www.npmjs.com/package/antd-data-table)
[![license](https://img.shields.io/npm/l/antd-data-table.svg)](https://github.com/Czw96/antd-data-table/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Czw96/antd-data-table/pulls)

基于 antd Table 的功能增强表格组件，内置批量选择、列配置、拖拽排序等能力。

## 安装

```bash
npm install antd-data-table
```

## 在线演示

[https://czw96.github.io/antd-data-table/](https://czw96.github.io/antd-data-table/)

## 用法示例

### 基本用法

```tsx
import { DataTable } from "antd-data-table";
import type { ColumnProps } from "antd-data-table";

interface User {
  id: number;
  name: string;
  age: number;
  address: string;
}

const dataColumns: ColumnProps<User>[] = [
  { key: "id", title: "ID", dataIndex: "id", width: 80, sorter: true },
  { key: "name", title: "姓名", dataIndex: "name", width: 120 },
  { key: "age", title: "年龄", dataIndex: "age", width: 80, sorter: true },
  { key: "address", title: "地址", dataIndex: "address" },
];

const actionColumn: ColumnProps<User> = {
  key: "action",
  title: "操作",
  dataIndex: "action",
  width: 120,
  render: ({ record }) => <a>查看</a>,
};

<DataTable
  id="users-table"
  rowKey="id"
  dataColumns={dataColumns}
  actionColumn={actionColumn}
  dataSource={users}
  dataCount={users.length}
/>;
```

### 完整 Props

```tsx
<DataTable<User>
  id="users-table"
  rowKey="id"
  dataColumns={dataColumns}
  actionColumn={actionColumn}
  loading={false}
  dataSource={users}
  dataCount={total}
  page={1}
  pageSize={15}
  expandable={{
    expandedRowRender: (record) => <div>{record.name} 的详情</div>,
  }}
  batchAction={{
    component: <button>批量删除</button>,
    selectedRowItems: selectedItems,
    onChange: setSelectedItems,
  }}
  onSearch={(params) => fetchData(params)}
/>
```

## API

### DataTableProps

| 参数         | 说明         | 类型                                            | 必填 | 默认值 |
| ------------ | ------------ | ----------------------------------------------- | ---- | ------ |
| id           | 表格唯一标识 | `string`                                        | 是   | -      |
| rowKey       | 行唯一键     | `keyof RecordType`                              | 是   | -      |
| dataColumns  | 数据列配置   | `ColumnProps<RecordType>[]`                     | 是   | -      |
| actionColumn | 操作列配置   | `ColumnProps<RecordType>`                       | 否   | -      |
| loading      | 加载状态     | `boolean`                                       | 否   | `false`|
| dataSource   | 数据源       | `RecordType[]`                                  | 是   | -      |
| dataCount    | 数据总数     | `number`                                        | 是   | -      |
| page         | 当前页码     | `number \| string`                              | 否   | `1`    |
| pageSize     | 每页条数     | `number \| string`                              | 否   | `15`   |
| expandable   | 展开行配置   | `{ expandedRowRender: (record) => ReactNode }`  | 否   | -      |
| batchAction  | 批量操作     | `BatchActionProps<RecordType>`                  | 否   | -      |
| onSearch     | 搜索回调     | `(item: Record<string, unknown>) => void`       | 否   | -      |

### ColumnProps

| 参数      | 说明       | 类型                                                          | 必填 | 默认值  |
| --------- | ---------- | ------------------------------------------------------------- | ---- | ------- |
| key       | 列唯一标识 | `string`                                                      | 是   | -       |
| title     | 列标题     | `string`                                                      | 是   | -       |
| dataIndex | 数据字段   | `string \| string[]`                                          | 是   | -       |
| sorter    | 是否可排序 | `boolean`                                                     | 否   | -       |
| width     | 列宽度     | `number`                                                      | 否   | `120`   |
| hidden    | 是否隐藏   | `boolean`                                                     | 否   | `false` |
| align     | 对齐方式   | `"left" \| "right" \| "center"`                               | 否   | -       |
| fixed     | 固定列     | `"left" \| "right"`                                           | 否   | -       |
| render    | 自定义渲染 | `({ record, index }: { record: RecordItem; index: number }) => ReactNode` | 否   | -       |

## License

MIT