import { Col, Pagination, Row, Table } from "antd";
import type { ColumnType, TableProps } from "antd/lib/table";

interface ColumnItem<RecordItem> extends Omit<ColumnType<RecordItem>, "render"> {
  render?: ({ record, index }: { record: RecordItem; index: number }) => React.ReactNode;
}

interface SelectionConfig<RecordItem> {
  fixed?: boolean;
  batchActionRender?: (records: RecordItem[]) => React.ReactNode;
  onChange: (records: RecordItem[]) => void;
}

interface PaginationConfig {
  page?: number | string;
  pageSize?: number | string;
  totalCount: number;
  onChange: (page: number, pageSize: number) => void;
}

interface DataTableProps<RecordItem> extends Omit<
  TableProps<RecordItem>,
  "columns" | "rowSelection" | "pagination" | "sticky" | "showSorterTooltip"
> {
  columns: ColumnItem<RecordItem>[];
  rowSelection?: SelectionConfig<RecordItem>;
  rowActionRender?: (record: RecordItem) => React.ReactNode;
  pagination?: PaginationConfig;
}

const DraggableTable = <RecordItem extends Record<keyof RecordItem, unknown>>(props: DataTableProps<RecordItem>) => {
  const { columns, dataSource, pagination, rowSelection, rowActionRender, batchActionRender, ...restProps } = props;
  const [openMultiSelectMode, setOpenMultiSelectMode] = useState(false); // 开启多选模式

  return (
    <Row gutter={[8, 12]}>
      <Col span={24}>
        <Table<RecordItem>
          {...restProps}
          sticky={true}
          columns={columns}
          dataSource={dataSource}
          showSorterTooltip={false}
          pagination={false}
          scroll={{ ...restProps.scroll, x: "max-content" }}
          // expandable={expandable}
          // onChange={(pagination, filters, sorter, extra) =>
          //   onSearch?.(generateTableQueryParams(pagination, filters, sorter, extra))
          // }
        />
      </Col>

      <Col>ss</Col>

      {/* {renderBatchActionContent()} */}

      <Col style={{ marginLeft: "auto" }}>
        {pagination && (
          <Pagination
            current={Number(pagination.page ?? 1)}
            pageSize={Number(pagination.pageSize ?? 15)}
            total={pagination.totalCount}
            showSizeChanger={true}
            pageSizeOptions={[10, 15, 20, 30, 50, 100]}
            showTotal={() => <span style={{ fontSize: "16px", color: "#0009" }}>总共: {pagination.totalCount} 条</span>}
            style={{ textAlign: "right" }}
            onChange={pagination.onChange}
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

export type { DataTableProps };
export default DraggableTable;
