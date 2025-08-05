import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { type PerformanceData } from '../apis/dashboardApi'

interface PerformanceChartProps {
  data: PerformanceData
}

const mockPerformanceData = [
  { month: 'Jan', revenue: 45000, users: 120, jobs: 450 },
  { month: 'Feb', revenue: 52000, users: 145, jobs: 520 },
  { month: 'Mar', revenue: 48000, users: 135, jobs: 480 },
  { month: 'Apr', revenue: 61000, users: 160, jobs: 610 },
  { month: 'May', revenue: 55000, users: 150, jobs: 550 },
  { month: 'Jun', revenue: 67000, users: 175, jobs: 670 },
  { month: 'Jul', revenue: 72000, users: 190, jobs: 720 },
]

const categoryData = [
  { name: 'Cleaning', value: 35, color: '#14b8a6' },
  { name: 'Maintenance', value: 25, color: '#3b82f6' },
  { name: 'Gardening', value: 20, color: '#10b981' },
  { name: 'Pet Care', value: 12, color: '#8b5cf6' },
  { name: 'Others', value: 8, color: '#f59e0b' },
]

const chartTypes = [
  { id: 'revenue', name: 'Revenue Trends', icon: CurrencyDollarIcon },
  { id: 'users', name: 'User Growth', icon: UsersIcon },
  { id: 'categories', name: 'Service Distribution', icon: ChartBarIcon },
]

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const [activeChart, setActiveChart] = useState('revenue')
  const chartData = data?.chart || mockPerformanceData

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} className="flex items-center text-sm">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: pld.color }}
              />
              <span className="text-gray-600 dark:text-gray-400 mr-2">
                {pld.dataKey}:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {activeChart === 'revenue' ? `$${pld.value.toLocaleString()}` : pld.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="text-gray-600 dark:text-gray-400 mr-2">
              {data.payload.name}:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {data.value}%
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    switch (activeChart) {
      case 'revenue':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="#14b8a6"
              radius={[4, 4, 0, 0]}
              name="Revenue ($)"
            />
          </BarChart>
        )
      case 'users':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="users"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="New Users"
            />
            <Bar
              dataKey="jobs"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="Jobs Completed"
            />
          </BarChart>
        )
      case 'categories':
        return (
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
              labelLine={false}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        )
      default:
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="#14b8a6"
              radius={[4, 4, 0, 0]}
              name="Revenue ($)"
            />
          </BarChart>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <ArrowTrendingUpIcon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Performance Analytics
          </h3>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          {chartTypes.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.id}
                onClick={() => setActiveChart(type.id)}
                className={`flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  activeChart === type.id
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{type.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Chart Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              $72k
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              This Month
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              +18.5%
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Growth Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              190
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              New Users
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              720
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Jobs Done
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}