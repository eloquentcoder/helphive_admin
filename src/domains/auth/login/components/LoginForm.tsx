import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useLoginMutation } from '../apis/authApi'
import { setCredentials } from '../controller/authSlice'

export const LoginForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        remember_me: formData.rememberMe
      }).unwrap()

      // Store credentials in Redux state
      dispatch(setCredentials({
        user: result.user,
        token: result.token
      }))

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error: any) {
      // Handle API errors
      if (error?.data?.errors) {
        setErrors(error.data.errors)
      } else if (error?.data?.message) {
        setErrors({ general: error.data.message })
      } else {
        setErrors({ general: 'Login failed. Please try again.' })
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General Error Message */}
      {errors.general && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {errors.general}
        </div>
      )}
      
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          className={`
            w-full px-4 py-2 border rounded-lg 
            focus:ring-2 focus:ring-teal-500 focus:border-transparent
            dark:bg-gray-700 dark:text-white dark:border-gray-600
            ${errors.email ? 'border-red-500' : 'border-gray-300'}
            transition-colors
          `}
          placeholder="admin@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className={`
              w-full px-4 py-2 pr-10 border rounded-lg 
              focus:ring-2 focus:ring-teal-500 focus:border-transparent
              dark:bg-gray-700 dark:text-white dark:border-gray-600
              ${errors.password ? 'border-red-500' : 'border-gray-300'}
              transition-colors
            `}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Remember me</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`
          w-full flex justify-center items-center py-2 px-4 
          border border-transparent rounded-lg shadow-sm 
          text-sm font-medium text-white 
          bg-teal-600 hover:bg-teal-700 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  )
}