import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { type ChartDataPoint } from '../apis/dashboardApi'

interface DashboardChartProps {
  data: ChartDataPoint[]
}

const mockData = [
  { date: 'Jan 1', users: 4000, jobs: 2400, revenue: 1200 },
  { date: 'Jan 2', users: 3000, jobs: 1398, revenue: 2210 },
  { date: 'Jan 3', users: 2000, jobs: 9800, revenue: 2290 },
  { date: 'Jan 4', users: 2780, jobs: 3908, revenue: 2000 },
  { date: 'Jan 5', users: 1890, jobs: 4800, revenue: 2181 },
  { date: 'Jan 6', users: 2390, jobs: 3800, revenue: 2500 },
  { date: 'Jan 7', users: 3490, jobs: 4300, revenue: 2100 },
]

const chartTypes = [
  { id: 'area', name: 'Area Chart' },
  { id: 'line', name: 'Line Chart' },
]

export const DashboardChart = ({ data = mockData }: DashboardChartProps) => {
  const [activeChart, setActiveChart] = useState('area')

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
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
                {pld.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          Platform Overview
        </h3>
        <div className="flex items-center space-x-1 sm:space-x-2">
          {chartTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveChart(type.id)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeChart === type.id
                  ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stackId="1"
                stroke="#14b8a6"
                fillOpacity={1}
                fill="url(#colorUsers)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="jobs"
                stackId="1"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorJobs)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#14b8a6' }}
              />
              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#f59e0b' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}