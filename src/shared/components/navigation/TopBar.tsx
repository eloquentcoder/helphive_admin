import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { selectCurrentUser } from '../../../domains/auth/login/controller/authSlice'
import { useLogoutMutation } from '../../../domains/auth/login/apis/authApi'
import { logout } from '../../../domains/auth/login/controller/authSlice'
import { cn } from '../../utils/cn'

interface TopBarProps {
  onMenuClick: () => void
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export const TopBar = ({ onMenuClick, sidebarCollapsed, onToggleSidebar }: TopBarProps) => {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutMutation] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap()
      dispatch(logout())
      navigate('/auth/login')
    } catch (error) {
      // Even if API fails, logout locally
      dispatch(logout())
      navigate('/auth/login')
    }
  }

  return (
    <div className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-x-2 sm:gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 sm:px-4 shadow-sm lg:px-6">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
        onClick={onMenuClick}
      >
        <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Desktop sidebar toggle */}
      <button
        type="button"
        className="hidden lg:flex -m-2.5 p-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        onClick={onToggleSidebar}
      >
        {sidebarCollapsed ? (
          <ChevronRightIcon className="h-5 w-5" />
        ) : (
          <ChevronLeftIcon className="h-5 w-5" />
        )}
      </button>

      {/* Search */}
      <div className="flex flex-1 gap-x-2 sm:gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1 max-w-lg" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <MagnifyingGlassIcon
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-4 sm:w-5 text-gray-400 ml-2"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 sm:pl-10 pr-0 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 text-sm bg-transparent"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-1 sm:gap-x-2 lg:gap-x-4">
          {/* Notifications */}
          <button
            type="button"
            className="-m-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors relative"
          >
            <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              <span className="hidden sm:inline">3</span>
              <span className="sm:hidden w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            className="hidden sm:flex -m-2 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <SunIcon className="h-5 w-5 sm:h-6 sm:w-6 dark:hidden" />
            <MoonIcon className="h-5 w-5 sm:h-6 sm:w-6 hidden dark:block" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                {user?.profile_photo ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.profile_photo}
                    alt={user.name}
                  />
                ) : (
                  <UserIcon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                )}
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                  {user?.name}
                </span>
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {user?.roles?.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={cn(
                        active ? 'bg-gray-50 dark:bg-gray-700' : '',
                        'flex px-4 py-2 text-sm text-gray-700 dark:text-gray-300 items-center'
                      )}
                    >
                      <UserIcon className="mr-3 h-4 w-4" />
                      Your Profile
                    </a>
                  )}
                </Menu.Item>
                
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={cn(
                        active ? 'bg-gray-50 dark:bg-gray-700' : '',
                        'flex px-4 py-2 text-sm text-gray-700 dark:text-gray-300 items-center'
                      )}
                    >
                      <CogIcon className="mr-3 h-4 w-4" />
                      Settings
                    </a>
                  )}
                </Menu.Item>
                
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={cn(
                        active ? 'bg-gray-50 dark:bg-gray-700' : '',
                        'flex w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 items-center'
                      )}
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}