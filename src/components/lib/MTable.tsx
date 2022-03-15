import clsx from 'clsx';
import React, { HTMLProps } from 'react';

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'rows'> {
  /** Table Schema */
  columns: Column[];
  /** Table data/rows */
  rows: any[];
  /** less padding tavle */
  compact?: boolean;
  /** classes to apply on thead-> tr */
  headerClass?: string;
  /** classes to apply on tbody -> tr */
  bodyRowClass?: string;
  /** no data label slot */
  noDataLabel?: React.ReactNode;
}

export interface Column<R = any> {
  /** property inside row that hold column data */
  key: string;
  /** Column header label */
  label: string;
  /** Column classes */
  classes?: string | ((row: R) => string);
  /** classes to apply on column header , thead -> tr -> th */
  headerClasses?: string;
  /** Custom formatter to format data before displaying */
  format?: (row: R) => React.ReactNode;
}

export const MTable: React.FC<Props> = ({
  rows,
  columns,
  className,
  compact,
  headerClass,
  bodyRowClass,
  noDataLabel,
  ...rest
}) => {
  return (
    <div className={clsx(['overflow-x-auto', className])} {...rest}>
      <table className={clsx(['table w-full', compact && 'table-compact'])}>
        <thead>
          <tr className={headerClass}>
            {columns.map(({ key, label, headerClasses }) => (
              <th key={key} className={clsx([headerClasses, 'first:rounded-none last:rounded-none'])}>
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {!!rows.length ? (
            rows.map((row, i) => (
              <tr key={i} className={bodyRowClass}>
                {columns.map(({ key, format, classes }) => (
                  <td key={key} className={classes ? (typeof classes === 'string' ? classes : classes(row)) : ''}>
                    {' '}
                    {format ? format(row) : row[key]}{' '}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="font-normal bg-transparent">
                <div className="flex items-center">
                  {noDataLabel || (
                    <>
                      <IconLaExclamationTriangle className="text-lg" />
                      <span className="ml-1 text-base">No data found !</span>
                    </>
                  )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
