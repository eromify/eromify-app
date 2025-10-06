import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuthStore } from '../stores/authStore'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { User, Mail, Calendar, Save } from 'lucide-react'

const ProfilePage = () => {
  const { user, updateProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        bio: user.bio || ''
      })
    }
  }, [user, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await updateProfile(data)
      if (result.success) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Profile Info */}
        <div className="card">
          <div className="flex items-center space-x-6 mb-6">
            <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-10 w-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.fullName}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Profile</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be at least 2 characters'
                  }
                })}
                type="text"
                className="mt-1 input"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="input pl-10 bg-gray-50 text-gray-500"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                {...register('bio', {
                  maxLength: {
                    value: 500,
                    message: 'Bio must be less than 500 characters'
                  }
                })}
                rows={4}
                className="mt-1 input"
                placeholder="Tell us about yourself..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Account Information */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <dl className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="text-sm text-gray-900 font-mono">{user?.id}</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Danger Zone */}
        <div className="card border-red-200">
          <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="btn-danger">
            Delete Account
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage



