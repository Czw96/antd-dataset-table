import { CheckSquareOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Flex, Pagination, Space, Table } from "antd";
import type { TableProps } from "antd/es/table";
import type {
  ColumnsType,
  ColumnType,
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig,
  TableRowSelection,
} from "antd/es/table/interface";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ColumnConfig } from "./ColumnSetting";
import ColumnSetting from "./ColumnSetting";
import SelectedPopover from "./SelectedPopover";
import { useTableHeight } from "./useTableHeight";

interface ColumnItem<RecordType> extends Omit<ColumnType<RecordType>, "key" | "title" | "dataIndex" | "render"> {
  key: string;
  title?: string;
  dataIndex?: string | string[];
  render?: ({ record, index }: { record: RecordType; index: number }) => React.ReactNode;
}

interface SelectionConfig<RecordType> {
  displayColumnKeys: string[];
  batchActionRender?: (records: RecordType[]) => React.ReactNode;
  onChange?: (records: RecordType[]) => void;
}

interface PaginationConfig {
  page?: number | string;
  pageSize?: number | string;
  totalCount: number;
  onChange?: (page: number, pageSize: number) => void;
}

interface DataTableProps<RecordType> extends Omit<
  TableProps<RecordType>,
  "rowKey" | "columns" | "rowSelection" | "pagination" | "sticky" | "showSorterTooltip" | "scroll"
> {
  name?: string;
  rowKey?: string;
  columns: ColumnItem<RecordType>[];
  selectionConfig?: SelectionConfig<RecordType>;
  rowActionRender?: (record: RecordType) => React.ReactNode;
  paginationConfig?: PaginationConfig;
  extraActionRender?: () => React.ReactNode;
  onSortChange?: (sortKey?: string) => void;
}

const TABLE_STYLES = { footer: { width: "100%", padding: 12, background: "#fff" } };

const SIZE_HEIGHT_MAP: Record<string, { headerHeight: number; footerHeight: number }> = {
  small: { headerHeight: 39, footerHeight: 56 },
  middle: { headerHeight: 47, footerHeight: 56 },
  large: { headerHeight: 55, footerHeight: 56 },
};

const DataTable = <RecordType extends Record<keyof RecordType, unknown>>(props: DataTableProps<RecordType>) => {
  const {
    name,
    rowKey = "id",
    columns,
    dataSource,
    selectionConfig,
    expandable,
    rowActionRender,
    paginationConfig,
    extraActionRender,
    onSortChange,
    size = "middle",
    ...restProps
  } = props;
  const storageKey = name ? `table-column-${name}` : null;
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowItems, setSelectedRowItems] = useState<RecordType[]>([]);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  // 缓存 props, 避免 footerRender 因 props 引用变化而重建
  const columnsRef = useRef(columns);
  const selectionConfigRef = useRef(selectionConfig);
  const paginationConfigRef = useRef(paginationConfig);
  const extraActionRenderRef = useRef(extraActionRender);
  columnsRef.current = columns;
  selectionConfigRef.current = selectionConfig;
  paginationConfigRef.current = paginationConfig;
  extraActionRenderRef.current = extraActionRender;

  const sizeHeights = SIZE_HEIGHT_MAP[size] || SIZE_HEIGHT_MAP.middle;

  // 自动计算表格可用高度
  const tableHeight = useTableHeight(tableContainerRef, {
    headerHeight: sizeHeights.headerHeight,
    footerHeight: sizeHeights.footerHeight,
  });

  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>(() => {
    const defaultConfigs = columns.map((column) => ({
      key: String(column.key),
      title: String(column.title ?? ""),
      visible: !column.hidden,
    }));

    if (!storageKey) return defaultConfigs;

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return defaultConfigs;

      const parsed: ColumnConfig[] = JSON.parse(stored);
      const keySet = new Set(columns.map((column) => String(column.key)));
      const valid = parsed.filter((column) => keySet.has(column.key));

      return valid.length > 0 ? valid : defaultConfigs;
    } catch {
      return defaultConfigs;
    }
  });

  // 同步 columns prop 变化(新增/移除列)
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

  // 持久化列配置到 localStorage
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(columnConfigs));
    }
  }, [columnConfigs, storageKey]);

  // 重置列为默认配置
  const handleResetColumnConfig = useCallback(() => {
    const items = columns.map((column) => ({
      key: String(column.key),
      title: String(column.title ?? ""),
      visible: !column.hidden,
    }));
    setColumnConfigs(items);
  }, [columns]);

  // 更新列配置
  const handleColumnConfigChange = useCallback((newConfigs: ColumnConfig[]) => {
    setColumnConfigs(newConfigs);
  }, []);

  // 固定序号列
  const indexColumn = useMemo<ColumnsType<RecordType>[number]>(
    () => ({
      title: "序号",
      dataIndex: "index",
      width: 60,
      align: "center",
      fixed: "left",
      render: (_value, _record, index) => index + 1,
    }),
    []
  );

  // 操作列(可选)
  const actionColumn = useMemo<ColumnType<RecordType> | null>(() => {
    if (!rowActionRender) return null;
    return {
      key: "action",
      title: "操作",
      dataIndex: "action",
      align: "center",
      width: 160,
      fixed: "right",
      render: (_value, record) => rowActionRender(record),
    };
  }, [rowActionRender]);

  // 数据列(保留 dataIndex 默认渲染,有 render 时才自定义)
  const dataColumns = useMemo<ColumnsType<RecordType>>(() => {
    return columns.map((column) => {
      if (!column.render) {
        return { ...column, key: String(column.key), dataIndex: column.dataIndex };
      }
      return {
        ...column,
        render: (_value, record, index) => column.render!({ record, index }),
      };
    });
  }, [columns]);

  // 构建表格列(按 columnConfigs 顺序排列,隐藏列设置 hidden=true)
  const tableColumns = useMemo<ColumnsType<RecordType>>(() => {
    const columnMap = new Map(dataColumns.map((col) => [String(col.key), col]));

    const orderedColumns = columnConfigs
      .filter((config) => config.visible)
      .map((config) => {
        const column = columnMap.get(config.key);
        if (!column) return null;
        return { ...column, hidden: false };
      })
      .filter(Boolean) as ColumnsType<RecordType>;

    const allColumns: ColumnsType<RecordType> = [indexColumn, ...orderedColumns];
    if (actionColumn) allColumns.push(actionColumn);

    return allColumns;
  }, [dataColumns, columnConfigs, indexColumn, actionColumn]);

  // 行选择配置: 开启多选时返回配置,关闭时返回 undefined(antd 会移除选择列)
  const rowSelection: TableRowSelection<RecordType> | undefined = useMemo(() => {
    if (!isSelectMode) return undefined;
    return {
      selectedRowKeys,
      columnWidth: 60,
      onChange: (newKeys: React.Key[], newItems: RecordType[]) => {
        setSelectedRowKeys(newKeys);
        setSelectedRowItems(newItems);
        selectionConfig?.onChange?.(newItems);
      },
    };
  }, [isSelectMode, selectedRowKeys, selectionConfig]);

  // SelectedPopover 数据变更处理(同步 selectedRowKeys)
  const handleSelectedItemsChange = useCallback(
    (newItems: RecordType[]) => {
      setSelectedRowItems(newItems);
      setSelectedRowKeys(newItems.map((item) => item[rowKey as keyof RecordType] as React.Key));
    },
    [rowKey]
  );

  // 表格滚动配置(自动计算 y 轴高度,bordered 时扣除 wrapper 边框 2px)
  const scrollConfig = useMemo(
    () => ({
      x: "max-content",
      y: restProps.bordered ? tableHeight - 2 : tableHeight,
    }),
    [tableHeight, restProps.bordered]
  );

  // 展开行配置
  const expandableConfig = useMemo(() => {
    if (!expandable) return { columnWidth: 60 };
    return { ...expandable, columnWidth: 60 };
  }, [expandable]);

  // 渲染 footer
  const footerRender = useCallback(
    () => (
      <Flex justify="space-between" align="center" style={{ width: "100%" }}>
        <Flex flex="50%" gap={8} justify="flex-start">
          {selectionConfigRef.current ? (
            isSelectMode ? (
              <>
                <Space.Compact>
                  <Button type="default" icon={<StopOutlined />} onClick={() => setIsSelectMode(false)}>
                    关闭多选
                  </Button>
                  <SelectedPopover
                    rowKey={rowKey}
                    dataColumns={columnsRef.current}
                    displayColumnKeys={selectionConfigRef.current?.displayColumnKeys}
                    dataSource={selectedRowItems}
                    onChange={handleSelectedItemsChange}
                  />
                </Space.Compact>
                {selectionConfigRef.current.batchActionRender?.(selectedRowItems)}
              </>
            ) : (
              <>
                <Button type="default" icon={<CheckSquareOutlined />} onClick={() => setIsSelectMode(true)}>
                  开启多选
                </Button>
                {extraActionRenderRef.current?.()}
              </>
            )
          ) : (
            extraActionRenderRef.current?.()
          )}
        </Flex>

        <Flex flex="50%" gap={8} justify="flex-end">
          {paginationConfigRef.current && (
            <Pagination
              current={Number(paginationConfigRef.current.page ?? 1)}
              pageSize={Number(paginationConfigRef.current.pageSize ?? 15)}
              total={paginationConfigRef.current.totalCount}
              showSizeChanger={true}
              pageSizeOptions={[10, 15, 20, 30, 50, 100]}
              onChange={paginationConfigRef.current.onChange}
            />
          )}
          <ColumnSetting columnConfigs={columnConfigs} onChange={handleColumnConfigChange} onReset={handleResetColumnConfig} />
        </Flex>
      </Flex>
    ),
    [
      isSelectMode,
      selectedRowItems,
      rowKey,
      columnConfigs,
      handleColumnConfigChange,
      handleResetColumnConfig,
      handleSelectedItemsChange,
    ]
  );

  // Table 变化处理
  const handleTableChange = useCallback(
    (
      _pagination: TablePaginationConfig,
      _filters: Record<string, FilterValue | null>,
      sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
      extra: TableCurrentDataSource<RecordType>
    ) => {
      if (extra.action === "sort") {
        const [firstSorter = {}] = Array.isArray(sorter) ? sorter : [sorter];
        if (firstSorter.order === "ascend") {
          onSortChange?.(`${firstSorter.field}`);
        } else if (firstSorter.order === "descend") {
          onSortChange?.(`-${firstSorter.field}`);
        } else {
          onSortChange?.(undefined);
        }
      }
    },
    [onSortChange]
  );

  return (
    <div ref={tableContainerRef} style={{ width: "100%", height: "100%" }}>
      <Table<RecordType>
        {...restProps}
        size={size}
        rowKey={rowKey}
        columns={tableColumns}
        dataSource={dataSource}
        showSorterTooltip={false}
        rowSelection={rowSelection}
        pagination={false}
        scroll={scrollConfig}
        expandable={expandableConfig}
        footer={footerRender}
        styles={TABLE_STYLES}
        onChange={handleTableChange}
      />
    </div>
  );
};

export type { ColumnItem, DataTableProps, PaginationConfig, SelectionConfig };
export default DataTable;
