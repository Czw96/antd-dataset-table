import type { TablePaginationConfig } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { FilterValue, SorterResult, TableCurrentDataSource } from "antd/es/table/interface";
import React from "react";

export interface ColumnProps<RecordItem> {
  key: string;
  title: string;
  dataIndex: string | string[];
  sorter?: boolean;
  width?: number;
  hidden?: boolean;
  align?: "left" | "right" | "center";
  fixed?: "left" | "right";
  render?: ({ record, index }: { record: RecordItem; index: number }) => React.ReactNode;
}

export interface ColumnConfig {
  key: string;
  title: string;
  hidden: boolean;
}

// 生成 Table 查询参数
export function generateTableQueryParams<RecordType>(
  pagination: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
  extra: TableCurrentDataSource<RecordType>
) {
  const queryFields: Record<string, unknown> = { page: 1 };

  if (extra.action === "paginate") {
    queryFields.page = pagination?.current?.toString() ?? undefined;
  } else if (extra.action === "filter") {
    for (const [key, value] of Object.entries(filters)) {
      queryFields[key] = Array.isArray(value) ? value : (value ?? undefined);
    }
  } else if (extra.action === "sort") {
    const [firstSorter = {}] = Array.isArray(sorter) ? sorter : [sorter];
    if (firstSorter.order === "ascend") {
      queryFields.ordering = `${firstSorter.field}`;
    } else if (firstSorter.order === "descend") {
      queryFields.ordering = `-${firstSorter.field}`;
    } else {
      queryFields.ordering = undefined;
    }
  }

  return queryFields;
}

// 将 ColumnProps 类型转换为 ColumnsType 类型
export function toColumnType<RecordType>(dataColumn: ColumnProps<RecordType>): ColumnsType<RecordType>[number] {
  return {
    ...dataColumn,
    render: (value, record, index) => (dataColumn.render ? dataColumn.render({ record, index }) : value),
  };
}

// 根据列配置生成 Table 列
export function generateColumns<RecordType>(
  dataColumns: ColumnProps<RecordType>[],
  columnConfigs: ColumnConfig[]
): ColumnsType<RecordType> {
  const _dataColumns: ColumnsType<RecordType> = [];
  columnConfigs.forEach((columnConfig) => {
    const dataColumn = dataColumns.find((dataColumn) => dataColumn.key === columnConfig.key);
    if (dataColumn) {
      _dataColumns.push(toColumnType({ width: 120, ...dataColumn, ...columnConfig }));
    }
  });

  return _dataColumns;
}
