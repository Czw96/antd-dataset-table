import { CheckSquareOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Col, Pagination, Row, Space, Table } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import type { ColumnsType, ColumnType, TableProps } from "antd/lib/table";
import React, { useEffect, useMemo, useState } from "react";
import ColumnSetting, { ColumnConfig } from "./ColumnSetting";
import SelectedPopover from "./SelectedPopover";

interface ColumnItem<RecordType> extends Omit<ColumnType<RecordType>, "key" | "title" | "dataIndex" | "render"> {
  key: string;
  title?: string;
  dataIndex?: string | string[];
  render?: ({ record, index }: { record: RecordType; index: number }) => React.ReactNode;
}

interface SelectionConfig<RecordType> {
  fixed?: boolean;
  displayColumnKeys: string[];
  batchActionRender?: (records: RecordType[]) => React.ReactNode;
  onChange: (records: RecordType[]) => void;
}

interface PaginationConfig {
  page?: number | string;
  pageSize?: number | string;
  totalCount: number;
  onChange: (page: number, pageSize: number) => void;
}

interface DataTableProps<RecordType> extends Omit<
  TableProps<RecordType>,
  "columns" | "rowSelection" | "pagination" | "sticky" | "showSorterTooltip"
> {
  name?: string;
  columns: ColumnItem<RecordType>[];
  selectionConfig?: SelectionConfig<RecordType>;
  rowActionRender?: (record: RecordType) => React.ReactNode;
  paginationConfig?: PaginationConfig;
  extraActionRender?: () => React.ReactNode;
}

const DraggableTable = <RecordType extends Record<keyof RecordType, unknown>>(props: DataTableProps<RecordType>) => {
  const {
    name,
    columns,
    dataSource,
    selectionConfig,
    expandable,
    rowActionRender,
    paginationConfig,
    extraActionRender,
    ...restProps
  } = props;
  const storageKey = name ? `table-column-${name}` : null;
  const [openSelectMode, setOpenSelectMode] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowItems, setSelectedRowItems] = useState<RecordType[]>([]);
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>(() => {
    // 生成默认配置
    const defaultConfigs = columns.map((column) => ({
      key: String(column.key),
      title: String(column.title ?? ""),
      visible: !column.hidden,
    }));

    // 如果没有设置存储键，直接返回默认配置
    if (!storageKey) return defaultConfigs;

    try {
      // 尝试从 localStorage 读取之前保存的配置
      const stored = localStorage.getItem(storageKey);
      if (!stored) return defaultConfigs;

      // 解析存储的配置
      const parsed: ColumnConfig[] = JSON.parse(stored);

      // 过滤出有效的配置（只保留当前还存在的列）
      const keySet = new Set(columns.map((c) => String(c.key)));
      const valid = parsed.filter((c) => keySet.has(c.key));

      // 如果有有效的配置就使用，否则回退到默认配置
      return valid.length > 0 ? valid : defaultConfigs;
    } catch {
      return defaultConfigs;
    }
  });

  // 列设置状态: 根据 columns prop 初始化, columns 变化时同步新增/移除列
  useEffect(() => {
    setColumnConfigs((previous) => {
      const existingMap = new Map(previous.map((columnConfig) => [columnConfig.key, columnConfig]));
      return columns.map((column) => {
        const key = String(column.key);
        const existing = existingMap.get(key);
        return existing ?? { key, title: String(column.title ?? ""), visible: !column.hidden };
      });
    });
  }, [columns]);

  // 列配置变更时同步到 LocalStorage
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(columnConfigs));
    }
  }, [columnConfigs, storageKey]);

  // 重置列设置
  const handleResetColumnConfig = () => {
    setColumnConfigs(
      columns.map((column) => ({ key: String(column.key), title: String(column.title ?? ""), visible: !column.hidden }))
    );
  };

  // 表格列设置
  const tableColumns = useMemo<ColumnsType<RecordType>>(() => {
    // 序号列
    const indexColumn: ColumnType<RecordType> = {
      title: "序号",
      dataIndex: "index",
      width: 60,
      fixed: "left",
      render: (_, __, index) => index + 1,
    };

    // 操作列（可选）
    const actionColumn: ColumnType<RecordType> | null = rowActionRender
      ? {
          key: "action",
          title: "操作",
          dataIndex: "action",
          fixed: "right",
          render: (_, record) => rowActionRender?.(record),
        }
      : null;

    // 构建列映射表
    const keyToColumnMap = new Map(columns.map((column) => [String(column.key), column]));

    // 按配置顺序获取可见列
    const visibleDataColumns = columnConfigs
      .filter((columnConfig) => columnConfig.visible)
      .map((columnConfig) => keyToColumnMap.get(columnConfig.key))
      .filter(Boolean) as ColumnItem<RecordType>[];

    // 适配 render 函数参数
    const adaptedDataColumns: ColumnsType<RecordType> = visibleDataColumns.map((column) => {
      if (!column.render) return column;
      return {
        ...column,
        render: (_, record, index) => column.render?.({ record, index }),
      };
    });

    // 组合所有列
    const allColumns: ColumnsType<RecordType> = [indexColumn, ...adaptedDataColumns];
    if (actionColumn) {
      allColumns.push(actionColumn);
    }

    return allColumns;
  }, [columns, rowActionRender, columnConfigs]);

  // 行选择配置
  const rowSelection: TableRowSelection<RecordType> | undefined = useMemo(() => {
    if (selectionConfig?.fixed || openSelectMode) {
      return {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRowItems) => {
          setSelectedRowKeys(selectedRowKeys);
          setSelectedRowItems(selectedRowItems);
        },
      };
    }
    return undefined;
  }, [openSelectMode, selectedRowKeys, selectionConfig?.fixed]);

  return (
    <Row gutter={[8, 12]}>
      <Col span={24}>
        <Table<RecordType>
          {...restProps}
          sticky={true}
          columns={tableColumns}
          dataSource={dataSource}
          showSorterTooltip={false}
          rowSelection={rowSelection}
          pagination={false}
          scroll={{ ...restProps.scroll, x: "max-content" }}
          expandable={expandable}
          // onChange={(pagination, filters, sorter, extra) =>
          //   onSearch?.(generateTableQueryParams(pagination, filters, sorter, extra))
          // }
        />
      </Col>

      <Col>
        <Space>
          {selectionConfig &&
            !selectionConfig.fixed &&
            (openSelectMode ? (
              <>
                <Space.Compact>
                  <Button type="default" icon={<StopOutlined />} onClick={() => setOpenSelectMode(false)}>
                    关闭多选
                  </Button>
                  <SelectedPopover
                    rowKey="id"
                    dataColumns={columns}
                    dataSource={selectedRowItems}
                    onChange={setSelectedRowItems}
                  />
                </Space.Compact>
                {selectionConfig.batchActionRender?.(selectedRowItems)}
              </>
            ) : (
              <>
                <Button type="default" icon={<CheckSquareOutlined />} onClick={() => setOpenSelectMode(true)}>
                  开启多选
                </Button>
                {extraActionRender?.()}
              </>
            ))}
        </Space>
      </Col>

      <Col style={{ marginLeft: "auto" }}>
        {paginationConfig && (
          <Pagination
            current={Number(paginationConfig.page ?? 1)}
            pageSize={Number(paginationConfig.pageSize ?? 15)}
            total={paginationConfig.totalCount}
            showSizeChanger={true}
            pageSizeOptions={[10, 15, 20, 30, 50, 100]}
            showTotal={() => <span style={{ fontSize: "16px", color: "#0009" }}>总共: {paginationConfig.totalCount} 条</span>}
            style={{ textAlign: "right" }}
            onChange={paginationConfig.onChange}
          />
        )}
      </Col>
      <Col>
        <ColumnSetting columnConfigs={columnConfigs} onChange={setColumnConfigs} onReset={handleResetColumnConfig} />
      </Col>
    </Row>
  );
};

export type { ColumnItem, DataTableProps };
export default DraggableTable;
