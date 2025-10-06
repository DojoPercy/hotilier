'use client'

import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { UserIcon, MailIcon, CalendarIcon, EditIcon, SaveIcon, XIcon } from 'lucide-react'

export default function PersonalInfoTab() {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    company: '',
    jobTitle: '',
    location: '',
    website: ''
  })

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving personal info:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: '',
      company: '',
      jobTitle: '',
      location: '',
      website: ''
    })
    setIsEditing(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 poppins-bold">Personal Information</h3>
          <p className="text-gray-600 mt-1">Manage your personal details and profile information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            isEditing
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-brand-blue text-white hover:bg-vibrant-blue'
          }`}
        >
          {isEditing ? <XIcon className="w-4 h-4" /> : <EditIcon className="w-4 h-4" />}
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Picture Section */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-vibrant-blue rounded-full flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          {isEditing && (
            <button 
              className="absolute -bottom-1 -right-1 bg-white border-2 border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors"
              title="Change profile picture"
              aria-label="Change profile picture"
            >
              <EditIcon className="w-3 h-3 text-gray-600" />
            </button>
          )}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{user?.name || 'User Name'}</h4>
          <p className="text-gray-600">{user?.email}</p>
          {isEditing && (
            <button className="text-sm text-brand-blue hover:text-vibrant-blue font-medium mt-1">
              Change Profile Picture
            </button>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors"
                placeholder="Enter your full name"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{formData.name || 'Not provided'}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MailIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">{formData.email}</span>
              <span className="text-xs bg-emerald-green text-white px-2 py-1 rounded-full">Verified</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors"
                placeholder="e.g., Energy Analyst"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">{formData.jobTitle || 'Not provided'}</span>
              </div>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors"
                placeholder="e.g., EnergyNexus"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">{formData.company || 'Not provided'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors"
                placeholder="e.g., Dubai, UAE"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">{formData.location || 'Not provided'}</span>
              </div>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website
            </label>
            {isEditing ? (
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors"
                placeholder="https://yourwebsite.com"
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">{formData.website || 'Not provided'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors resize-none"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-900">{formData.bio || 'No bio provided'}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-vibrant-blue transition-colors duration-200"
            >
              <SaveIcon className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              <XIcon className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
