import React, { createContext, HTMLProps, useContext, useMemo } from 'react'
import clsx from 'clsx'
import MSpinner from 'lib/MSpinner'

// TODO: sort, filer and search

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'rows'> {
  /** Table Schema */
  columns: Column[]
  /** Table data/rows */
  rows: any[]
  /** less padding tavle */
  compact?: boolean
  /** classes to apply on thead-> tr */
  headerClass?: string
  /** classes to apply on tbody -> tr */
  bodyRowClass?: string
  /** no data label slot */
  noDataLabel?: React.ReactNode
  /** is table data loading */
  loading?: boolean
}

export interface Column<R = any> {
  /** property inside row that hold column data */
  field: string
  /** Column header label */
  label: string
  /** Column classes */
  classes?: string | ((row: R) => string)
  /** classes to apply on column header , thead -> tr -> th */
  headerClasses?: string
  /** Custom formatter to format data before displaying */
  format?: (row: R) => React.ReactNode
}

interface TableContextType extends Pick<Props, 'columns' | 'rows' | 'headerClass' | 'bodyRowClass' | 'loading'> {}

const TableContext = createContext<TableContextType | undefined>(undefined)

function useTableContext() {
  const ctx = useContext(TableContext)

  if (ctx === undefined) throw new Error('Context not provided')

  return ctx
}

interface MRowProps extends HTMLProps<HTMLTableRowElement> {
  row: any
}

const MTableRow = React.memo<MRowProps>(({ row, children: _children, ...rest }) => {
  const { bodyRowClass, columns } = useTableContext()

  return (
    <tr className={bodyRowClass} {...rest}>
      {columns.map((column, i) => (
        <MTableColumn {...column} row={row} key={i} />
      ))}
    </tr>
  )
})

MTableRow.displayName = 'MTableRow'

interface MTableColumnProps extends Column, Omit<HTMLProps<HTMLTableCellElement>, 'label'> {
  row: any
}

const MTableColumn = React.memo<MTableColumnProps>(
  ({ classes, row, format, field, headerClasses: _headerClasses, label: _label, ...rest }) => {
    const tdVal = useMemo(() => (format != null ? format(row) : row[field]), [format, field, row])

    return (
      <td className={classes !== undefined ? (typeof classes === 'string' ? classes : classes(row)) : ''} {...rest}>
        {tdVal}
      </td>
    )
  },
)

MTableColumn.displayName = 'MTableColumn'

export const MTable: React.FC<Props> = ({
  rows,
  columns,
  className,
  compact = false,
  headerClass,
  bodyRowClass,
  noDataLabel,
  loading = false,
  ...rest
}) => {
  return (
    <TableContext.Provider value={{ rows, columns, headerClass, bodyRowClass, loading }}>
      <div className={clsx(['overflow-x-auto', className])} {...rest}>
        <table className={clsx(['table w-full', compact && 'table-compact'])}>
          <thead>
            <tr className={headerClass}>
              {columns.map(({ label, headerClasses }, i) => (
                <th key={i} className={clsx([headerClasses, 'first:rounded-none last:rounded-none'])}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {!loading && !(rows.length === 0) ? (
              rows.map((row, i) => <MTableRow row={row} key={i} />)
            ) : (
              <tr>
                <td colSpan={columns.length} className="font-normal bg-transparent">
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <MSpinner size="20px" /> <span>Loading entries...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {noDataLabel ?? (
                        <>
                          <IconLaExclamationTriangle className="text-lg" />
                          <span className="ml-1 text-base">No data found !</span>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TableContext.Provider>
  )
}

MTable.displayName = 'MTable'
