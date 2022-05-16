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

interface TableContextType
  extends Pick<Props, 'columns' | 'rows' | 'headerClass' | 'bodyRowClass' | 'loading' | 'settingsSlot'> {}

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
  const { bodyRowClass, columns, settingsSlot } = useTableContext()

  return (
    <tr className={clsx([bodyRowClass, 'group'])} {...rest}>
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
  settingsSlot,
  ...rest
}) => {
  return (
    <TableContext.Provider value={{ rows, columns, headerClass, bodyRowClass, loading, settingsSlot }}>
      <div className={clsx(['overflow-x-auto', className])} {...rest}>
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
