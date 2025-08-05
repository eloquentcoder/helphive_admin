import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../auth/login/controller/authSlice'
import { StatCard } from '../components/StatCard'
import { DashboardChart } from '../components/DashboardChart'
import { RecentActivity } from '../components/RecentActivity'
import { QuickActions } from '../components/QuickActions'
import { TopHelpers } from '../components/TopHelpers'
import { TopServiceProviders } from '../components/TopServiceProviders'
import { TopServices } from '../components/TopServices'
import { RecentTransactions } from '../components/RecentTransactions'
import { TopCategories } from '../components/TopCategories'
import { PerformanceChart } from '../components/PerformanceChart'
import { useGetDashboardQuery } from '../apis/dashboardApi'

export const DashboardPage = () => {
  const user = useSelector(selectCurrentUser)
  const { data, isLoading, error } = useGetDashboardQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <span className="ml-3 text-lg">Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Failed to load dashboard data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { stats } = data

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-teal-100 text-sm sm:text-base">Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.value}
          change={stats.totalUsers.change}
          trend={stats.totalUsers.trend}
          icon="users"
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs.value}
          change={stats.activeJobs.change}
          trend={stats.activeJobs.trend}
          icon="briefcase"
        />
        <StatCard
          title="Revenue"
          value={stats.revenue.value}
          change={stats.revenue.change}
          trend={stats.revenue.trend}
          icon="currency-dollar"
        />
        <StatCard
          title="Active Contracts"
          value={stats.activeContracts.value}
          change={stats.activeContracts.change}
          trend={stats.activeContracts.trend}
          icon="document-text"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <DashboardChart data={data.chartData} />
        </div>
        <div>
          <RecentActivity activities={data.recentActivity} />
        </div>
      </div>

      {/* Top Performers Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <TopHelpers helpers={data.topHelpers} />
        <TopServiceProviders providers={data.topServiceProviders} />
      </div>

      {/* Services and Categories */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <TopServices services={data.topServices} />
        <TopCategories categories={data.topCategories} />
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <RecentTransactions transactions={data.recentTransactions} />
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Performance Analytics */}
      <PerformanceChart data={data.performanceData} />
    </div>
  )
}