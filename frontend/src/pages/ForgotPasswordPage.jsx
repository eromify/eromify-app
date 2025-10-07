import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Eromify" className="h-24 w-auto mx-auto mb-6" />
            <h1 className="text-3xl font-semibold mb-2">
              <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                Password Reset
              </span>
            </h1>
          </div>

          {/* Success Message */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-green-400" />
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-4">Request Submitted</h2>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                We've received your password reset request. To set up a new password, please contact our support team.
              </p>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-300 mb-2">Contact Support:</p>
                <a 
                  href="mailto:admin@eromify.com"
                  className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
                >
                  admin@eromify.com
                </a>
              </div>

              <p className="text-gray-400 text-sm mb-6">
                Our team will help you regain access to your account within 24 hours.
              </p>

              <Link
                to="/login"
                className="inline-flex items-center text-pink-400 hover:text-pink-300 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Eromify" className="h-24 w-auto mx-auto mb-6" />
          <h1 className="text-3xl font-semibold mb-2">
            Forgot your{' '}
            <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
              password?
            </span>
          </h1>
          <p className="text-gray-400">No worries, we'll help you get back into your account</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Request Password Reset</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Remember your password?{' '}
              <Link to="/login" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Landing */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-400 hover:text-gray-300 text-sm transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
