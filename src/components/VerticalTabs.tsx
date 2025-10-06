'use client'

import { useState, ReactNode } from 'react'
import { 
  UserIcon, 
  BookmarkIcon, 
  CreditCardIcon, 
  SettingsIcon, 
  BellIcon,
  ShieldCheckIcon,
  ChevronRightIcon
} from 'lucide-react'

interface TabItem {
  id: string
  label: string
  icon: ReactNode
  content: ReactNode
  badge?: string | number
}

interface VerticalTabsProps {
  tabs: TabItem[]
  defaultActiveTab?: string
  className?: string
}

export default function VerticalTabs({ 
  tabs, 
  defaultActiveTab = tabs[0]?.id,
  className = '' 
}: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab)

  return (
    <div className={`flex flex-col lg:flex-row gap-8 ${className}`}>
      {/* Tab Navigation */}
      <div className="lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 poppins-bold">Account Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your account preferences</p>
          </div>
          
          <nav className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                  activeTab === tab.id
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activeTab === tab.id 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    {tab.icon}
                  </div>
                  <span className="font-medium">{tab.label}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {tab.badge && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-brand-blue text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                  <ChevronRightIcon className={`w-4 h-4 transition-transform duration-200 ${
                    activeTab === tab.id ? 'rotate-90' : ''
                  }`} />
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[600px]">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  )
}

// Pre-configured tab items for common account sections
export const accountTabItems = {
  personalInfo: {
    id: 'personal-info',
    label: 'Personal Information',
    icon: <UserIcon className="w-5 h-5" />,
    content: null // Will be set dynamically
  },
  savedItems: {
    id: 'saved-items',
    label: 'Saved Items',
    icon: <BookmarkIcon className="w-5 h-5" />,
    content: null // Will be set dynamically
  },
  subscription: {
    id: 'subscription',
    label: 'Subscription',
    icon: <CreditCardIcon className="w-5 h-5" />,
    content: null // Will be set dynamically
  },
  notifications: {
    id: 'notifications',
    label: 'Notifications',
    icon: <BellIcon className="w-5 h-5" />,
    content: null // Will be set dynamically
  },
  security: {
    id: 'security',
    label: 'Security',
    icon: <ShieldCheckIcon className="w-5 h-5" />,
    content: null // Will be set dynamically
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon className="w-5 h-5" />,
    content: null // Will be set dynamically
  }
}
