import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react'
import { useForgotPasswordMutation } from '../../login/apis/authApi'

export const ForgotPasswordPage = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email address is required'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Invalid email format'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailError = validateEmail(email)
    if (emailError) {
      setErrors({ email: emailError })
      return
    }

    setErrors({})

    try {
      await forgotPassword({ email }).unwrap()
      setIsSuccess(true)
    } catch (error: any) {
      if (error?.data?.errors) {
        setErrors(error.data.errors)
      } else if (error?.data?.message) {
        setErrors({ general: error.data.message })
      } else {
        setErrors({ general: 'Failed to send reset email. Please try again.' })
      }
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-green-100 dark:bg-green-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Email Sent!
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              If an admin account with that email exists, we have sent a password reset link to{' '}
              <span className="font-medium text-teal-600 dark:text-teal-400">{email}</span>
            </p>
            
            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-teal-700 dark:text-teal-300">
                <strong>Please check your email</strong> (including spam folder) and click the reset link within 60 minutes.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSuccess(false)
                  setEmail('')
                  setErrors({})
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Send Another Email
              </button>
              
              <Link
                to="/auth/login"
                className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Back to Login Link */}
          <Link
            to="/auth/login"
            className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-teal-100 dark:bg-teal-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-10 w-10 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter your email address and we'll send you a reset link
            </p>
          </div>

          {/* Form */}
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }))
                  }
                }}
                className={`
                  w-full px-4 py-2 border rounded-lg 
                  focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  dark:bg-gray-700 dark:text-white dark:border-gray-600
                  ${errors.email ? 'border-red-500' : 'border-gray-300'}
                  transition-colors
                `}
                placeholder="admin@helpalive.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
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
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Security Note:</strong> For security reasons, we'll send the reset link only to verified admin accounts. 
              If you don't receive an email, please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}