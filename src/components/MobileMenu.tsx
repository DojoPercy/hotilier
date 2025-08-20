'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isEventsOpen, setIsEventsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleEvents = () => setIsEventsOpen(!isEventsOpen)

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="text-[#1E212A] hover:text- p-2 transition-colors duration-200"
        aria-label="Toggle mobile menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 bg-opacity-50" onClick={toggleMenu}>
          <div 
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex w-full items-center justify-between p-6 border-b border-[#C9CACE]">
                <Link href="/" className="flex items-center" onClick={toggleMenu}>
                <Image src="/logo_final.png" alt="logo" width={180} height={180} />
                </Link>
                <button
                  onClick={toggleMenu}
                  className="text-[#1E212A] hover:text-brand-blue p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-6 py-4 space-y-2">
                <Link 
                  href="/interviews"
                  onClick={toggleMenu}
                  className={`block py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/interviews') 
                      ? 'bg-[#F4F4F7] text-brand-blue' 
                      : 'text-[#1E212A] hover:bg-[#F4F4F7] hover:text-brand-blue'
                  }`}
                >
                  Interviews
                </Link>
                
                <Link 
                  href="/articles"
                  onClick={toggleMenu}
                  className={`block py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/articles') 
                      ? 'bg-[#F4F4F7] text-brand-blue' 
                      : 'text-[#1E212A] hover:bg-[#F4F4F7] hover:text-'
                  }`}
                >
                  Articles
                </Link>
                
                <Link 
                  href="/regions"
                  onClick={toggleMenu}
                  className={`block py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/regions') 
                      ? 'bg-[#F4F4F7] text-brand-blue' 
                      : 'text-[#1E212A] hover:bg-[#F4F4F7] hover:text-'
                  }`}
                >
                  Regions
                </Link>
                
                {/* Events Dropdown */}
                <div>
                  <button
                    onClick={toggleEvents}
                    className={`w-full text-left py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-between ${
                      isActive('/events') 
                        ? 'bg-[#F4F4F7] text-brand-blue' 
                        : 'text-[#1E212A] hover:bg-[#F4F4F7] hover:text-'
                    }`}
                  >
                    <span>Events</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isEventsOpen ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isEventsOpen && (
                    <div className="ml-4 mt-2 space-y-1">
                      <Link 
                        href="/events/conferences"
                        onClick={toggleMenu}
                        className="block py-2 px-4 text-sm text-[#65676E] hover:text-"
                      >
                        Conferences
                      </Link>
                      <Link 
                        href="/events/summits"
                        onClick={toggleMenu}
                        className="block py-2 px-4 text-sm text-[#65676E] hover:text-"
                      >
                        Summits
                      </Link>
                      <Link 
                        href="/events/webinars"
                        onClick={toggleMenu}
                        className="block py-2 px-4 text-sm text-[#65676E] hover:text-"
                      >
                        Webinars
                      </Link>
                    </div>
                  )}
                </div>
                
                <Link 
                  href="/contract-publishing"
                  onClick={toggleMenu}
                  className={`block py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/publishing') 
                      ? 'bg-[#F4F4F7] text-brand-blue' 
                      : 'text-[#1E212A] hover:bg-[#F4F4F7] hover:text-'
                  }`}
                >
                  Contract Publishing
                </Link>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-[#C9CACE] space-y-4">
                <Link 
                  href="/account"
                  onClick={toggleMenu}
                  className={`block py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/account') 
                      ? 'bg-[#F4F4F7] text-brand-blue' 
                      : 'text-[#1E212A] hover:bg-[#F4F4F7] hover:text-'
                  }`}
                >
                  MY ACCOUNT
                </Link>
                
                <button className="w-full text-left py-3 px-4 rounded-md text-sm font-medium text-[#1E212A] hover:bg-[#F4F4F7] hover:text- transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
