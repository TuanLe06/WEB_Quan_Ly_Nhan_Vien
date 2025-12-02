import React, { ReactNode } from 'react';
import Loading from './Loading';
import './common.css';

interface Column<T> {
  key: string;
  title: string;
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey: keyof T;
  onRowClick?: (record: T) => void;
  emptyText?: string;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  rowKey,
  onRowClick,
  emptyText = 'Không có dữ liệu',
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="table-loading">
        <Loading text="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  width: col.width,
                  textAlign: col.align || 'left',
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr
              key={String(record[rowKey])}
              onClick={() => onRowClick?.(record)}
              className={onRowClick ? 'table-row-clickable' : ''}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{ textAlign: col.align || 'left' }}
                >
                  {col.render
                    ? col.render(record[col.key], record, index)
                    : record[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;