import { CheckSquareOutlined, StopOutlined } from "@ant-design/icons";
import { useLocalStorageState, useMount } from "ahooks";
import { Button, Checkbox, Col, Pagination, Row, Table } from "antd";
import type { ColumnsType } from "antd/lib/table";
import React, { useCallback, useMemo, useState } from "react";

import { dataRemove, dataUpdate } from "../utils/functions";
import type { ColumnConfig, ColumnProps } from "../utils/table";
import { generateColumns, generateTableQueryParams, toColumnType } from "../utils/table";

import ColumnSettingButton from "./ColumnSettingButton";

interface DataTableProps<RecordType> {
  id: string;
  rowKey: keyof RecordType;
  dataColumns: ColumnProps<RecordType>[];
  actionColumn?: ColumnProps<RecordType>;
  loading?: boolean;
  dataSource: RecordType[];
  dataCount: number;
  page?: number | string;
  pageSize?: number | string;
  expandable?: {
    expandedRowRender: (record: RecordType) => React.ReactNode;
  };
  batchAction?: {
    component: React.ReactNode;
    selectedRowItems: RecordType[];
    onChange: (items: RecordType[]) => void;
  };
  onSearch?: (item: Record<string, unknown>) => void;
}

// 页面基础数据表格组件
const DataTable = <RecordType extends Record<keyof RecordType, unknown>>(props: DataTableProps<RecordType>) => {
  const {
    id,
    rowKey,
    dataColumns,
    actionColumn,
    loading = false,
    dataSource,
    dataCount,
    page = 1,
    pageSize = 15,
    expandable,
    batchAction,
    onSearch,
  } = props;
  const [openMultiSelectMode, setOpenMultiSelectMode] = useState(false); // 开启多选模式
  const selectedRowItems = useMemo<RecordType[]>(() => batchAction?.selectedRowItems ?? [], [batchAction?.selectedRowItems]);
  const [localColumnConfigs, setLocalColumnConfigs] = useLocalStorageState<ColumnConfig[]>(`${id}.column_configs`, {
    defaultValue: [],
  });
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([]);

  useMount(() => {
    try {
      const columnConfigs = [...localColumnConfigs];
      for (const dataColumn of dataColumns) {
        const columnConfig = columnConfigs.find((item) => item.key === dataColumn.key);
        if (!columnConfig) {
          throw new Error("配置项缺失");
        }

        columnConfig.title = dataColumn.title;
      }

      setColumnConfigs(columnConfigs);
    } catch {
      handleResetColumnConfig();
    }
  });

  // Table 多选框状态(全选, 部分选中, 未选中)
  const checkboxGroupStatus = useMemo(() => {
    const isAllSelected =
      dataSource.length > 0 &&
      dataSource.every((dataItem) => selectedRowItems.some((selectedItem) => selectedItem[rowKey] === dataItem[rowKey]));
    const isSomeSelected = selectedRowItems.some((selectedItem) =>
      dataSource.some((dataItem) => selectedItem[rowKey] === dataItem[rowKey])
    );
    return { isAllSelected, isSomeSelected };
  }, [dataSource, rowKey, selectedRowItems]);

  // Table 多选框全选事件
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      let dataItems = [...(batchAction?.selectedRowItems ?? [])];
      if (checked) {
        dataSource.forEach((dataItem) => (dataItems = dataUpdate(rowKey, dataItem, dataItems)));
      } else {
        dataSource.forEach((dataItem) => (dataItems = dataRemove(rowKey, dataItem, dataItems)));
      }
      batchAction?.onChange(dataItems);
    },
    [batchAction, dataSource, rowKey]
  );

  // Table 多选框选择事件
  const handleSelectRow = useCallback(
    (checked: boolean, recordItem: RecordType) => {
      if (checked) {
        batchAction?.onChange(dataUpdate(rowKey, recordItem, batchAction.selectedRowItems));
      } else {
        batchAction?.onChange(dataRemove(rowKey, recordItem, batchAction.selectedRowItems));
      }
    },
    [batchAction, rowKey]
  );

  // Table 序号列（稳定列，无回调依赖）
  const indexColumn = useMemo<ColumnsType<RecordType>[number]>(
    () => ({
      title: "序号",
      dataIndex: "index",
      width: 60,
      fixed: "left",
      render: (_, __, index) => index + 1,
    }),
    []
  );

  // Table 多选框列（独立 useMemo 减少重算）
  const checkboxColumn = useMemo<ColumnsType<RecordType>[number]>(
    () => ({
      title: (
        <Checkbox
          checked={checkboxGroupStatus.isAllSelected}
          indeterminate={!checkboxGroupStatus.isAllSelected && checkboxGroupStatus.isSomeSelected}
          onChange={(event) => handleSelectAll(event.target.checked)}
        />
      ),
      dataIndex: "checkbox",
      width: 60,
      fixed: "left",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowItems.some((item) => item[rowKey] === record[rowKey])}
          onChange={(event) => handleSelectRow(event.target.checked, record)}
        />
      ),
    }),
    [checkboxGroupStatus, handleSelectAll, selectedRowItems, rowKey, handleSelectRow]
  );

  const tableColumns = useMemo<ColumnsType<RecordType>>(() => {
    const _dataColumns: ColumnsType<RecordType> = [
      openMultiSelectMode ? checkboxColumn : indexColumn,
      ...generateColumns(dataColumns, columnConfigs),
    ];

    if (actionColumn) {
      _dataColumns.push(toColumnType(actionColumn));
    }

    return _dataColumns;
  }, [openMultiSelectMode, checkboxColumn, indexColumn, dataColumns, columnConfigs, actionColumn]);

  const dataTotal = useMemo(() => {
    const maxCount = Number(page) * Number(pageSize);
    return maxCount > dataCount ? maxCount : dataCount;
  }, [page, pageSize, dataCount]);

  // 渲染批量操作组件
  const renderBatchActionContent = useCallback(() => {
    if (!batchAction) {
      return null;
    }

    if (openMultiSelectMode) {
      return (
        <>
          <Col>
            <Button
              type="default"
              icon={<StopOutlined />}
              onClick={() => {
                setOpenMultiSelectMode(false);
                batchAction?.onChange([]);
              }}
            >
              取消多选
            </Button>
          </Col>
          <Col>{batchAction.component}</Col>
        </>
      );
    } else {
      return (
        <Col>
          <Button type="default" icon={<CheckSquareOutlined />} onClick={() => setOpenMultiSelectMode(true)}>
            开启多选
          </Button>
        </Col>
      );
    }
  }, [batchAction, openMultiSelectMode, setOpenMultiSelectMode]);

  // 重置列配置
  const handleResetColumnConfig = useCallback(() => {
    const items: ColumnConfig[] = dataColumns.map((item) => ({
      key: item.key,
      title: item.title,
      hidden: item.hidden ?? false,
    }));
    setColumnConfigs(items);
    setLocalColumnConfigs(items);
  }, [dataColumns, setColumnConfigs, setLocalColumnConfigs]);

  return (
    <Row gutter={[8, 12]}>
      <Col span={24}>
        <Table
          rowKey={rowKey}
          size="middle"
          sticky={true}
          columns={tableColumns}
          loading={loading}
          dataSource={dataSource}
          showSorterTooltip={false}
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={expandable}
          onChange={(pagination, filters, sorter, extra) =>
            onSearch?.(generateTableQueryParams(pagination, filters, sorter, extra))
          }
        />
      </Col>

      {renderBatchActionContent()}

      <Col style={{ marginLeft: "auto" }}>
        <Pagination
          current={Number(page)}
          pageSize={Number(pageSize)}
          total={dataTotal}
          showSizeChanger={true}
          pageSizeOptions={[10, 15, 20, 50, 100]}
          showTotal={() => <span style={{ fontSize: "16px", color: "#0009" }}>总共: {dataCount} 条</span>}
          style={{ textAlign: "right" }}
          onChange={(page, pageSize) => onSearch?.({ page, page_size: pageSize })}
        />
      </Col>
      <Col>
        <ColumnSettingButton
          columnConfigs={columnConfigs}
          onChange={(items) => {
            setColumnConfigs(items);
            setLocalColumnConfigs(items);
          }}
          onReset={handleResetColumnConfig}
        />
      </Col>
    </Row>
  );
};

export type { DataTableProps };
export default DataTable;
