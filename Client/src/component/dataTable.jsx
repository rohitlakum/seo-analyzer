import React from "react";
import { EmptyComponent } from "./dataNotFound";
import { Table } from "antd";

export const DataTable = ({
  dataSource,
  columns,
  scrollX = 0,
  Datalength = 0,
  pagination = true,
}) => {
  return (
    <>
      {Datalength || dataSource?.length > 0 ? (
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={
            pagination
              ? {
                  pageSizeOptions: [10, 20, 30, 40, 50, 100],
                  responsive: true,
                  showSizeChanger: true,
                  showTotal: (total, range) => {
                    return (
                      <div className=" border-2 font-Plight rounded-md px-1.5">{`${range[0]}-${range[1]} of ${total} items`}</div>
                    );
                  },
                }
              : false
          }
          scroll={{ x: scrollX }}
        />
      ) : (
        <EmptyComponent />
      )}
    </>
  );
};
