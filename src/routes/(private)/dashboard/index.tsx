import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  DollarSign,
  Globe,
  MessageSquare,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableView } from '@/components/table-view'

export const Route = createFileRoute('/(private)/dashboard/')({
  component: RouteComponent,
})

type MetricCard = {
  label: string
  value: string
  change?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBgColor: string
}

const metrics: Array<MetricCard> = [
  {
    label: 'Total SMS',
    value: '52,831',
    change: {
      value: 'No change',
      type: 'neutral',
    },
    icon: MessageSquare,
    iconColor: 'text-blue-600',
    iconBgColor: 'bg-blue-100',
  },
  {
    label: 'Delivery Rate',
    value: '92.18%',
    change: {
      value: '2.60%',
      type: 'increase',
    },
    icon: TrendingUp,
    iconColor: 'text-orange-600',
    iconBgColor: 'bg-orange-100',
  },
  {
    label: 'Total cost (P)',
    value: '6,861.79',
    change: {
      value: '71.34%',
      type: 'decrease',
    },
    icon: DollarSign,
    iconColor: 'text-teal-600',
    iconBgColor: 'bg-teal-100',
  },
  {
    label: 'Destination countries',
    value: '1',
    icon: Globe,
    iconColor: 'text-pink-600',
    iconBgColor: 'bg-pink-100',
  },
]

type SampleUser = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
}

const sampleData: Array<SampleUser> = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Moderator',
    status: 'inactive',
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'User',
    status: 'active',
    createdAt: '2024-03-05',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2024-02-14',
  },
  {
    id: '6',
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    role: 'User',
    status: 'inactive',
    createdAt: '2024-01-28',
  },
  {
    id: '7',
    name: 'Edward Norton',
    email: 'edward.norton@example.com',
    role: 'Moderator',
    status: 'active',
    createdAt: '2024-03-12',
  },
  {
    id: '8',
    name: 'Fiona Apple',
    email: 'fiona.apple@example.com',
    role: 'User',
    status: 'active',
    createdAt: '2024-02-08',
  },
]

const columns: Array<ColumnDef<SampleUser>> = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
]

function RouteComponent() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const totalCount = sampleData.length

  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize],
  )

  const paginatedData = useMemo(
    () => sampleData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    [pageIndex, pageSize],
  )

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPageIndex(0)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            SMS Insights
          </span>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold">{metric.value}</p>
                    {metric.change && (
                      <div className="mt-2 flex items-center gap-1 text-sm">
                        {metric.change.type === 'increase' && (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                        {metric.change.type === 'decrease' && (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={
                            metric.change.type === 'increase'
                              ? 'text-green-600 dark:text-green-400'
                              : metric.change.type === 'decrease'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-600 dark:text-gray-400'
                          }
                        >
                          {metric.change.type === 'increase' && '+'}
                          {metric.change.type === 'decrease' && '-'}
                          {metric.change.value}
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${metric.iconBgColor}`}
                  >
                    <Icon className={`h-6 w-6 ${metric.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
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
            storageKey="dashboard-table"
          />
        </CardContent>
      </Card>
    </div>
  )
}
