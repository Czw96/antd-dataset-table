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
import type { ColumnItem } from "antd-data-table";

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

<DataTable
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
/>;
```

### 完整 Props

```tsx
<DataTable<User>
    name="users-table"
    rowKey="id"
    columns={columns}
    dataSource={users}
    loading={false}
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
      onChange: (page, pageSize) => fetchData(page, pageSize),
    }}
    extraActionRender={() => <button>新增</button>}
  />
```

## API

### DataTableProps

| 参数             | 说明             | 类型                                                                 | 必填 | 默认值 |
| ---------------- | ---------------- | -------------------------------------------------------------------- | ---- | ------ |
| name             | 表格标识（用于列配置存储） | `string`                                                           | 否   | -      |
| rowKey           | 行唯一键         | `string`                                                           | 是   | -      |
| columns          | 数据列配置       | `ColumnItem<RecordType>[]`                                          | 是   | -      |
| dataSource       | 数据源           | `RecordType[]`                                                       | 是   | -      |
| loading          | 加载状态         | `boolean`                                                            | 否   | `false`|
| expandable       | 展开行配置       | `TableProps['expandable']`                                           | 否   | -      |
| rowActionRender  | 操作列渲染函数   | `(record: RecordType) => ReactNode`                                 | 否   | -      |
| selectionConfig  | 选择配置         | `SelectionConfig<RecordType>`                                        | 否   | -      |
| paginationConfig | 分页配置         | `PaginationConfig`                                                   | 否   | -      |
| extraActionRender| 额外操作渲染函数 | `() => ReactNode`                                                    | 否   | -      |

### ColumnItem

| 参数      | 说明       | 类型                                                          | 必填 | 默认值  |
| --------- | ---------- | ------------------------------------------------------------- | ---- | ------- |
| key       | 列唯一标识 | `string`                                                      | 是   | -       |
| title     | 列标题     | `string`                                                      | 是   | -       |
| dataIndex | 数据字段   | `string \| string[]`                                          | 是   | -       |
| sorter    | 是否可排序 | `boolean`                                                     | 否   | -       |
| width     | 列宽度     | `number`                                                      | 否   | `120`   |
| hidden    | 是否默认隐藏 | `boolean`                                                    | 否   | `false` |
| align     | 对齐方式   | `"left" \| "right" \| "center"`                               | 否   | -       |
| fixed     | 固定列     | `"left" \| "right"`                                           | 否   | -       |
| render    | 自定义渲染 | `({ record, index }: { record: RecordItem; index: number }) => ReactNode` | 否   | -       |

### SelectionConfig

| 参数               | 说明           | 类型                                        | 必填 | 默认值  |
| ------------------ | -------------- | ------------------------------------------- | ---- | ------- |
| displayColumnKeys  | 在已选面板中显示的列 | `string[]`                              | 否   | -       |
| batchActionRender  | 批量操作渲染   | `(records: RecordType[]) => ReactNode`     | 否   | -       |
| onChange           | 选择变更回调   | `(records: RecordType[]) => void`          | 是   | -       |

### PaginationConfig

| 参数        | 说明         | 类型                                   | 必填 | 默认值 |
| ----------- | ------------ | -------------------------------------- | ---- | ------ |
| page        | 当前页码     | `number \| string`                     | 否   | `1`    |
| pageSize    | 每页条数     | `number \| string`                     | 否   | `15`   |
| totalCount  | 数据总数     | `number`                               | 是   | -      |
| onChange    | 页码变更回调 | `(page: number, pageSize: number) => void` | 是   | -      |

## License

MIT
