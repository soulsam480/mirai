import React, { createContext, HTMLProps, useContext, useMemo } from 'react'
import clsx from 'clsx'
import { MSpinner } from './MSpinner'

interface Props<R = any> extends Omit<HTMLProps<HTMLDivElement>, 'rows'> {
  /** Table Schema */
  columns: Column[]
  /** Table data/rows */
  rows: R[]
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
  /** action to perform when a row is clicked */
  onRowClick?: (row: R) => void
  /** slot for table settings, sorting menu etc. */
  settingsSlot?: React.ReactNode
}

export interface Column<R = any> {
  /** property inside row that hold column data */
  field: string
  /** Column header label */
  label?: string
  /** Column classes */
  classes?: string | ((row: R) => string)
  /** classes to apply on column header , thead -> tr -> th */
  headerClasses?: string
  /** Custom formatter to format data before displaying */
  format?: (row: R) => React.ReactNode
  /** Custom formatter to format data before displaying */
  headerslot?: React.ReactNode
}

interface TableContextType extends Omit<Props, 'compact'> {}

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
  const { bodyRowClass, columns, settingsSlot, onRowClick } = useTableContext()

  return (
    <tr
      {...rest}
      className={clsx([bodyRowClass, 'group'])}
      onClick={() => {
        onRowClick?.(row)
      }}
    >
      {columns.map((column, i) => (
        <MTableColumn {...column} row={row} key={i} />
      ))}
      {settingsSlot !== undefined && (
        <td className="transition-colors duration-200 first:rounded-none last:rounded-none group-hover:bg-base-200" />
      )}
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
      <td
        {...rest}
        className={clsx([
          classes !== undefined ? (typeof classes === 'string' ? classes : classes(row)) : '',
          'transition-colors duration-200 first:rounded-none last:rounded-none group-hover:bg-base-200',
        ])}
      >
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
  onRowClick,
  settingsSlot,
  ...rest
}) => {
  return (
    <TableContext.Provider value={{ rows, columns, headerClass, bodyRowClass, loading, settingsSlot, onRowClick }}>
      <div {...rest} className={clsx(['overflow-x-auto', className])}>
        <table className={clsx(['table w-full', compact && 'table-compact'])}>
          <thead>
            <tr className={headerClass}>
              {columns.map(({ label, headerClasses, headerslot }, i) => (
                <th
                  key={i}
                  className={clsx([
                    headerClasses ?? 'border-b border-base-200 bg-base-100',
                    'first:rounded-none last:rounded-none',
                  ])}
                >
                  {headerslot ?? label}
                </th>
              ))}

              {settingsSlot !== undefined && (
                <th className="border-b border-base-200 bg-base-100 first:rounded-none last:rounded-none">
                  {settingsSlot}
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {!loading && !(rows.length === 0) ? (
              rows.map((row, i) => <MTableRow row={row} key={i} />)
            ) : (
              <tr>
                <td colSpan={columns.length} className="bg-transparent font-normal">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <MSpinner size="20px" /> <span>Loading entries...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {noDataLabel ?? (
                        <>
                          <IconPhWarningCircle className="text-lg" />
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
