import { CheckSquareOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Col, Pagination, Row, Space, Table } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import type { ColumnType, TableProps } from "antd/lib/table";
import React, { useMemo, useState } from "react";

interface ColumnItem<RecordType> extends Omit<ColumnType<RecordType>, "render"> {
  render?: ({ record, index }: { record: RecordType; index: number }) => React.ReactNode;
}

interface SelectionConfig<RecordType> {
  fixed?: boolean;
  displayColumnKeys: keyof RecordType[];
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
  columns: ColumnItem<RecordType>[];
  selectionConfig?: SelectionConfig<RecordType>;
  rowActionRender?: (record: RecordType) => React.ReactNode;
  paginationConfig?: PaginationConfig;
  extraActionRender?: () => React.ReactNode;
}

const DraggableTable = <RecordType extends Record<keyof RecordType, unknown>>(props: DataTableProps<RecordType>) => {
  const { columns, dataSource, selectionConfig, paginationConfig, extraActionRender, ...restProps } = props;
  const [openSelectMode, setOpenSelectMode] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowItems, setSelectedRowItems] = useState<RecordType[]>([]);

  const rowSelection: TableRowSelection<RecordType> | undefined = useMemo(() => {
    if (selectionConfig) {
      return {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRowItems) => {
          setSelectedRowKeys(selectedRowKeys);
          setSelectedRowItems(selectedRowItems);
        },
      };
    }
    return undefined;
  }, [selectedRowKeys, selectionConfig]);

  return (
    <Row gutter={[8, 12]}>
      <Col span={24}>
        <Table<RecordType>
          {...restProps}
          sticky={true}
          columns={columns}
          dataSource={dataSource}
          showSorterTooltip={false}
          rowSelection={rowSelection}
          pagination={false}
          scroll={{ ...restProps.scroll, x: "max-content" }}
          // expandable={expandable}
          // onChange={(pagination, filters, sorter, extra) =>
          //   onSearch?.(generateTableQueryParams(pagination, filters, sorter, extra))
          // }
        />
      </Col>

      <Col>
        <Space.Compact>
          {selectionConfig &&
            !selectionConfig.fixed &&
            (openSelectMode ? (
              <>
                <Button type="default" icon={<StopOutlined />} onClick={() => setOpenSelectMode(false)}>
                  关闭多选
                </Button>
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
        </Space.Compact>
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
        {/* <ColumnSettingButton
          columnConfigs={columnConfigs}
          onChange={(items) => {
            setColumnConfigs(items);
            setLocalColumnConfigs(items);
          }}
          onReset={handleResetColumnConfig}
        /> */}
      </Col>
    </Row>
  );
};

export type { ColumnItem, DataTableProps };
export default DraggableTable;
