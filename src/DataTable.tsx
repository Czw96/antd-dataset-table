import { Button, Col, Pagination, Popover, Row, Space, Table } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import type { ColumnType, TableProps } from "antd/lib/table";
import React, { useMemo, useState } from "react";

interface ColumnItem<RecordType> extends Omit<ColumnType<RecordType>, "render"> {
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
  columns: ColumnItem<RecordType>[];
  selectionConfig?: SelectionConfig<RecordType>;
  rowActionRender?: (record: RecordType) => React.ReactNode;
  paginationConfig?: PaginationConfig;
}

const DraggableTable = <RecordType extends Record<keyof RecordType, unknown>>(props: DataTableProps<RecordType>) => {
  const { columns, dataSource, selectionConfig, paginationConfig, rowActionRender, batchActionRender, ...restProps } = props;
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
          <Popover
            title="已选择项"
            content={
              <div style={{ width: "400px", minHeight: "160px" }}>
                <BatchSelectTable
                  rowKey="id"
                  dataColumns={dataColumns}
                  dataSource={selectedItems}
                  onChange={(items) => dispatch(setSelectedItems(items))}
                />
              </div>
            }
            trigger="click"
          >
            <Button type="default" style={{ width: "160px" }}>
              已选择 {selectedRowItems.length} 项
            </Button>
          </Popover>
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
