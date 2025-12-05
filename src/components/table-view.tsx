import { useEffect, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  FilterX,
  Loader2,
} from 'lucide-react'

import { Separator } from './ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { SearchInput } from './search-input'
import type {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table'
import type { SearchProps } from './search-input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export type TablePagination = {
  totalCount: number
  pageIndex: number
  pageSize: number
  pageCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export type TableBulkAction = {
  label: string
  loadingLabel?: string
  isLoading?: boolean
  onClick: (ids: Array<string>) => void
  type?: 'positive' | 'destructive'
}

type TableViewProps<TData, TValue> = {
  columns: Array<ColumnDef<TData, TValue>>
  data: Array<TData>
  pagination: TablePagination
  search?: SearchProps
  filters?: React.ReactNode
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  enableRowSelection?: boolean
  onClearFilters?: () => void
  fitContentColumns?: Array<keyof TData | 'number' | 'actions' | 'select'>
  defaultHiddenColumns?: Array<keyof TData | 'number' | 'actions' | 'select'>
  bulkActions?: Array<TableBulkAction>
  isLoading?: boolean
  showFilters?: boolean
  storageKey: string
}

export function TableView<TData, TValue>({
  columns,
  data,
  search,
  filters,
  pagination,
  columnFilters,
  onColumnFiltersChange,
  enableRowSelection,
  fitContentColumns = [],
  defaultHiddenColumns = [],
  isLoading = false,
  bulkActions = [],
  onClearFilters,
  showFilters = true,
  storageKey = 'table-view-columns',
}: TableViewProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const initialState = defaultHiddenColumns.reduce((acc, columnId) => {
        acc[columnId.toString()] = false
        return acc
      }, {} as VisibilityState)

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          return JSON.parse(stored)
        }
      }

      return initialState
    },
  )

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(columnVisibility))
  }, [columnVisibility, storageKey])

  const allColumns = useMemo(() => {
    const selectColumn: ColumnDef<TData> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }

    const numberColumn: ColumnDef<TData> = {
      id: 'number',
      header: '#',
      cell: ({ row, table }) => {
        const pageSize = table.getState().pagination.pageSize
        return (
          row.index +
          1 +
          (table.getState().pagination.pageIndex || 0) * pageSize
        )
      },
    }

    return enableRowSelection
      ? [selectColumn, numberColumn, ...columns]
      : [numberColumn, ...columns]
  }, [columns, enableRowSelection])

  const fitContentColumnsWithActions = useMemo(() => {
    return ['actions', ...fitContentColumns]
  }, [fitContentColumns])

  const table = useReactTable({
    data,
    columns: allColumns,
    state: {
      columnFilters: columnFilters || [],
      rowSelection,
      columnVisibility,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
    enableRowSelection,
    onRowSelectionChange: (updater) => {
      setRowSelection((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        return next
      })
    },
    onColumnFiltersChange: (updatedFilters) =>
      onColumnFiltersChange?.(updatedFilters as ColumnFiltersState),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: pagination.pageCount,
    manualPagination: true,
  })

  return (
    <div className="w-full space-y-4">
      {showFilters && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {search && (
              <SearchInput
                {...search}
                className={cn('w-[320px]', search.className)}
              />
            )}
            {filters}
          </div>

          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Clear filters"
                  onClick={onClearFilters}
                >
                  <FilterX className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="center">Clear all filters</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .filter(
                    (column) => typeof column.columnDef.header === 'string',
                  )
                  .map((column) => {
                    const header = column.columnDef.header as string

                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {header}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {Object.keys(rowSelection).length > 0 && (
        <div className="bg-muted/50 text-muted-foreground flex items-center justify-between rounded-md px-3 py-2 text-sm">
          <p>{Object.keys(rowSelection).length} row(s) selected</p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRowSelection({})
              }}
              className="w-max px-5"
            >
              Clear Selection
            </Button>

            {bulkActions.map((action, index) => (
              <Button
                size="sm"
                key={action.label + index}
                variant={action.type === 'positive' ? 'default' : 'destructive'}
                onClick={() => {
                  const selectedRows = table.getFilteredSelectedRowModel().rows

                  const selectedIds = selectedRows.map(
                    (row) => (row.original as { id: string }).id,
                  )

                  action.onClick(selectedIds)
                }}
                loadingText={action.loadingLabel}
                isLoading={action.isLoading}
                className="w-max px-5"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn('whitespace-nowrap', {
                        'w-0': fitContentColumnsWithActions.includes(
                          header.column.id as keyof TData,
                        ),
                      })}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={allColumns.length}
                    className="h-24 text-center"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                    </span>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn('whitespace-nowrap', {
                          'w-0': fitContentColumnsWithActions.includes(
                            cell.column.id as keyof TData,
                          ),
                        })}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={allColumns.length}
                    className="h-24 text-center"
                  >
                    No Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center gap-3">
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) =>
                pagination.onPageSizeChange(Number(value))
              }
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm font-medium">rows per page</p>
          </div>

          <div className="flex items-center gap-5">
            <p className="text-sm font-medium">
              Total count: {pagination.totalCount}
            </p>

            <Separator orientation="vertical" className="h-5" />

            <p className="text-sm font-medium">
              Page {pagination.pageIndex + 1} of {pagination.pageCount}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  pagination.onPageChange(pagination.pageIndex - 1)
                }}
                disabled={pagination.pageIndex === 0}
                className="font-xs"
              >
                <ChevronLeft className="-ml-1 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  pagination.onPageChange(pagination.pageIndex + 1)
                }}
                disabled={pagination.pageIndex === pagination.pageCount - 1}
                className="font-xs"
              >
                <ChevronRight className="-mr-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
