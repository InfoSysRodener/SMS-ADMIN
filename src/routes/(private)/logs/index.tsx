import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableView } from '@/components/table-view'

export const Route = createFileRoute('/(private)/logs/')({
  component: RouteComponent,
})

type SMSLogEntry = {
  id: string
  subaccount: string
  dateSentReceived: string
  destination: string
  source: string
  cost: string
  status: 'Delivered' | 'Read' | 'Pending' | 'Failed'
}

const sampleLogs: Array<SMSLogEntry> = [
  {
    id: '1',
    subaccount: 'XN_OTP',
    dateSentReceived: 'Dec 03, 2025 10:33 AM (UTC+08:00)',
    destination: '+639950472420',
    source: 'MegaPerya',
    cost: 'PHP 0.13',
    status: 'Delivered',
  },
  {
    id: '2',
    subaccount: 'XN_OTP',
    dateSentReceived: 'Dec 03, 2025 10:33 AM (UTC+08:00)',
    destination: '+639154804641',
    source: 'MegaPerya',
    cost: 'PHP 0.13',
    status: 'Read',
  },
  {
    id: '3',
    subaccount: 'XN_OTP',
    dateSentReceived: 'Dec 03, 2025 10:32 AM (UTC+08:00)',
    destination: '+639876543210',
    source: 'MegaPerya',
    cost: 'PHP 0.13',
    status: 'Delivered',
  },
  {
    id: '4',
    subaccount: 'XN_OTP',
    dateSentReceived: 'Dec 03, 2025 10:33 AM (UTC+08:00)',
    destination: '+639123456789',
    source: 'MegaPerya',
    cost: 'PHP 0.13',
    status: 'Read',
  },
  {
    id: '5',
    subaccount: 'XN_OTP',
    dateSentReceived: 'Dec 03, 2025 10:32 AM (UTC+08:00)',
    destination: '+639987654321',
    source: 'MegaPerya',
    cost: 'PHP 0.13',
    status: 'Delivered',
  },
  {
    id: '6',
    subaccount: 'XN_OTP',
    dateSentReceived: 'Dec 03, 2025 10:33 AM (UTC+08:00)',
    destination: '+639112233445',
    source: 'MegaPerya',
    cost: 'PHP 0.13',
    status: 'Read',
  },
  {
    id: '7',
    subaccount: 'XN_OTP',
    dateSentReceived: 'Dec 03, 2025 10:32 AM (UTC+08:00)',
    destination: '+639556677889',
    source: 'MegaPerya',
    cost: 'PHP 0.13',
    status: 'Delivered',
  },
  {
    id: '8',
    subaccount: 'XN_OTP',
    dateSentReceived: 'Dec 03, 2025 10:33 AM (UTC+08:00)',
    destination: '+639223344556',
    source: 'MegaPerya',
    cost: 'PHP 0.13',
    status: 'Read',
  },
  {
    id: '9',
    subaccount: 'XN_OTP',
    dateSentReceived: 'Dec 03, 2025 10:32 AM (UTC+08:00)',
    destination: '+639334455667',
    source: 'MegaPerya',
    cost: 'PHP 0.13',
    status: 'Delivered',
  },
]

const columns: Array<ColumnDef<SMSLogEntry>> = [
  {
    accessorKey: 'subaccount',
    header: 'Subaccount',
  },
  {
    accessorKey: 'dateSentReceived',
    header: 'Date sent/received (UTC+0 8:00)',
  },
  {
    accessorKey: 'destination',
    header: 'Destination',
  },
  {
    accessorKey: 'source',
    header: 'Source',
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      const statusColors = {
        Delivered:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        Read: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        Pending:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        Failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      }
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[status]}`}
        >
          {status}
        </span>
      )
    },
  },
]

function RouteComponent() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const totalCount = sampleLogs.length

  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize],
  )

  const paginatedData = useMemo(
    () => sampleLogs.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    [pageIndex, pageSize],
  )

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPageIndex(0)
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">SMS Logs</h1>
      <Card>
        <CardContent>
          <TableView
            columns={columns}
            data={paginatedData}
            pagination={{
              totalCount,
              pageIndex,
              pageSize,
              pageCount,
              onPageChange: setPageIndex,
              onPageSizeChange: handlePageSizeChange,
            }}
            storageKey="logs-table"
          />
        </CardContent>
      </Card>
    </div>
  )
}
