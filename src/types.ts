import type { ColumnType } from "antd/es/table";

// 数据列配置，扩展 antd ColumnType，覆盖 key/title/dataIndex/render 的类型签名
export interface ColumnItem<RecordType> extends Omit<ColumnType<RecordType>, "key" | "title" | "dataIndex" | "render"> {
  key: string;
  title?: string;
  dataIndex?: string | string[];
  render?: ({ record, index }: { record: RecordType; index: number }) => React.ReactNode;
}

// 多选配置
export interface SelectionConfig<RecordType> {
  displayColumnKeys: string[];
  batchActionRender?: (records: RecordType[]) => React.ReactNode;
  onChange?: (records: RecordType[]) => void;
}

// 分页配置
export interface PaginationConfig {
  page?: number | string;
  pageSize?: number | string;
  totalCount: number;
  onChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
}
