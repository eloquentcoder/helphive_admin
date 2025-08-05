import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CogIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  CheckIcon,
  PauseIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  InboxArrowDownIcon,
  ArchiveBoxIcon,
  XCircleIcon,
  TagIcon,
  FolderIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline'
import { selectCurrentUser, hasPermission } from '../../../domains/auth/login/controller/authSlice'
import { useGetUserAnalyticsQuery } from '../../../domains/portal/users/apis/usersApi'
import { cn } from '../../utils/cn'

interface SidebarProps {
  open: boolean
  collapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission?: string
  badge?: number
  children?: NavigationItem[]
}

const getNavigation = (analytics?: any): NavigationItem[] => [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  {
    name: 'User Management',
    href: '/users',
    icon: UsersIcon,
    // Remove permission for development/testing - add back in production
    // permission: 'users.view',
    children: [
      { name: 'All Users', href: '/users', icon: UsersIcon },
      { name: 'Seekers', href: '/users/seekers', icon: UsersIcon },
      { name: 'Helpers', href: '/users/helpers', icon: UsersIcon },
      { 
        name: 'Pending Verifications', 
        href: '/users/pending', 
        icon: ShieldCheckIcon, 
        badge: analytics?.pendingVerifications || 0 
      },
      { 
        name: 'Banned Users', 
        href: '/users/banned', 
        icon: ExclamationTriangleIcon,
        badge: analytics?.bannedUsers || 0
      },
    ]
  },
  {
    name: 'Jobs & Contracts',
    href: '/jobs',
    icon: BriefcaseIcon,
    // Remove permission for development/testing - add back in production
    // permission: 'jobs.view',
    children: [
      { name: 'All Jobs', href: '/jobs', icon: BriefcaseIcon },
      { name: 'Pending Jobs', href: '/jobs/pending', icon: ExclamationTriangleIcon, badge: analytics?.pendingJobs || 0 },
      { name: 'Active Jobs', href: '/jobs/active', icon: CheckIcon },
      { name: 'Paused Jobs', href: '/jobs/paused', icon: PauseIcon },
      { name: 'Expired Jobs', href: '/jobs/expired', icon: ExclamationTriangleIcon },
      { name: 'Applications', href: '/jobs/applications', icon: UserGroupIcon },
      { name: 'Contracts', href: '/contracts', icon: DocumentTextIcon },
    ]
  },
  {
    name: 'Job Categories',
    href: '/job-categories',
    icon: RectangleStackIcon,
    // Remove permission for development/testing - add back in production  
    // permission: 'job-categories.view',
    children: [
      { name: 'All Categories', href: '/job-categories', icon: RectangleStackIcon },
      { name: 'Parent Categories', href: '/job-categories/parents', icon: FolderIcon },
      { name: 'Subcategories', href: '/job-categories/subcategories', icon: TagIcon },
      { name: 'Active Categories', href: '/job-categories/active', icon: CheckIcon },
      { name: 'Inactive Categories', href: '/job-categories/inactive', icon: XCircleIcon },
    ]
  },
  {
    name: 'Conversations',
    href: '/conversations',
    icon: ChatBubbleLeftRightIcon,
    // Remove permission for development/testing - add back in production  
    // permission: 'conversations.view',
    children: [
      { name: 'All Conversations', href: '/conversations', icon: ChatBubbleLeftRightIcon },
      { 
        name: 'Unread Messages', 
        href: '/conversations/unread', 
        icon: InboxArrowDownIcon,
        badge: analytics?.unreadConversations || 0 
      },
      { name: 'Active', href: '/conversations/active', icon: CheckIcon },
      { name: 'Closed', href: '/conversations/closed', icon: XCircleIcon },
      { name: 'Archived', href: '/conversations/archived', icon: ArchiveBoxIcon },
      { name: 'Application Chats', href: '/conversations/application', icon: UserGroupIcon },
      { name: 'Contract Discussions', href: '/conversations/contract', icon: DocumentTextIcon },
      { name: 'Support Tickets', href: '/conversations/support', icon: EnvelopeIcon },
    ]
  },
  {
    name: 'Financial',
    href: '/payments',
    icon: CurrencyDollarIcon,
    permission: 'payments.view',
    children: [
      { name: 'Transactions', href: '/payments/transactions', icon: CurrencyDollarIcon, permission: 'payments.view' },
      { name: 'Wallets', href: '/payments/wallets', icon: CurrencyDollarIcon, permission: 'payments.wallets' },
      { name: 'Refunds', href: '/payments/refunds', icon: CurrencyDollarIcon, permission: 'payments.refund' },
      { name: 'Reports', href: '/payments/reports', icon: ChartBarIcon, permission: 'payments.export' },
    ]
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    permission: 'analytics.view',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: CogIcon,
    permission: 'settings.view',
    children: [
      { name: 'Roles & Permissions', href: '/settings/roles', icon: ShieldCheckIcon, permission: 'roles.view' },
      { name: 'Platform Settings', href: '/settings/platform', icon: CogIcon, permission: 'settings.edit' },
      { name: 'System Logs', href: '/settings/logs', icon: DocumentTextIcon, permission: 'logs.view' },
    ]
  },
]

export const Sidebar = ({ open, collapsed, onClose }: SidebarProps) => {
  const location = useLocation()
  const user = useSelector(selectCurrentUser)
  const { data: analytics } = useGetUserAnalyticsQuery()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  
  const navigation = getNavigation(analytics)

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const canViewItem = (item: NavigationItem) => {
    if (!item.permission) return true
    return hasPermission(user, item.permission)
  }

  const isMenuExpanded = (menuName: string) => {
    return expandedMenus.includes(menuName)
  }

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const NavigationItems = ({ items, level = 0 }: { items: NavigationItem[], level?: number }) => (
    <ul className={cn("space-y-1", level > 0 && "ml-6 mt-2")}>
      {items.filter(canViewItem).map((item) => (
        <NavigationItem key={item.name} item={item} level={level} />
      ))}
    </ul>
  )

  const NavigationItem = ({ item, level }: { item: NavigationItem, level: number }) => {
    const hasChildren = item.children && item.children.length > 0
    const visibleChildren = hasChildren ? item.children!.filter(canViewItem) : []
    
    // For parent items with children, only highlight if it's an exact match
    // For child items, use normal route matching
    const isActive = hasChildren 
      ? location.pathname === item.href
      : isActiveRoute(item.href)
    
    // Check if this menu is manually expanded
    const isExpanded = isMenuExpanded(item.name)
    
    // Auto-expand parent menus if any child is active
    const hasActiveChild = hasChildren && visibleChildren.some(child => isActiveRoute(child.href))
    
    // Show children if manually expanded OR if any child is active
    const shouldShowChildren = isExpanded || hasActiveChild

    const handleClick = (e: React.MouseEvent) => {
      // If it has children, prevent navigation and toggle the menu instead
      if (hasChildren && visibleChildren.length > 0) {
        e.preventDefault()
        toggleMenu(item.name)
      } else {
        // Navigate normally for items without children
        if (window.innerWidth < 1024) onClose()
      }
    }

    return (
      <li>
        <Link
          to={hasChildren && visibleChildren.length > 0 ? '#' : item.href}
          className={cn(
            "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
            isActive
              ? "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
              : hasActiveChild && hasChildren
              ? "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
            level > 0 && "text-xs",
            hasChildren && "cursor-pointer"
          )}
          onClick={handleClick}
        >
          <item.icon 
            className={cn(
              "flex-shrink-0 h-5 w-5 transition-colors",
              isActive 
                ? "text-teal-600 dark:text-teal-400"
                : hasActiveChild && hasChildren
                ? "text-teal-500 dark:text-teal-400"
                : "text-gray-500 dark:text-gray-400",
              collapsed && level === 0 && "mx-auto"
            )} 
          />
          
          {!collapsed && (
            <>
              <span className="ml-3 flex-1">{item.name}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                  {item.badge}
                </span>
              )}
              {hasChildren && visibleChildren.length > 0 && (
                <ChevronRightIcon 
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform duration-200",
                    shouldShowChildren 
                      ? "rotate-90 text-teal-500" 
                      : hasActiveChild 
                      ? "text-teal-400" 
                      : "text-gray-400"
                  )} 
                />
              )}
            </>
          )}
        </Link>

        {!collapsed && hasChildren && visibleChildren.length > 0 && shouldShowChildren && (
          <NavigationItems items={visibleChildren} level={level + 1} />
        )}
      </li>
    )
  }

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-sm flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </button>
                </div>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-4 sm:px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="flex items-center">
                      <div className="bg-teal-600 rounded-lg p-2">
                        <HomeIcon className="h-6 w-6 text-white" />
                      </div>
                      <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                        HelpHive
                      </span>
                    </div>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <NavigationItems items={navigation} />
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <motion.div
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col"
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center">
              <div className="bg-teal-600 rounded-lg p-2">
                <HomeIcon className="h-6 w-6 text-white" />
              </div>
              {!collapsed && (
                <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                  HelpHive
                </span>
              )}
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <NavigationItems items={navigation} />
          </nav>
        </div>
      </motion.div>
    </>
  )
}