'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useUser } from "@auth0/nextjs-auth0"
import MobileMenu from './MobileMenu'; // Assuming this component is already working

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 text-[16px] font-medium transition-colors duration-200 ${
        isActive
          ? 'text-brand-blue border-b-2 border-brand-blue'
          : 'text-[#1E212A] hover:text-brand-blue'
      }`}
    >
      {children}
    </Link>
  );
};

const EventsDropdown = () => {
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname.startsWith('/events'); // Use startsWith for nested routes

  return (
    <div className="relative">
      <button
        onClick={() => setIsEventsDropdownOpen(!isEventsDropdownOpen)}
        className={`px-3 py-2 text-[16px] font-medium transition-colors duration-200 flex items-center space-x-1 ${
          isActive
            ? 'text-brand-blue border-b-2 border-brand-blue'
            : 'text-dark-neutral hover:text-brand-blue'
        }`}
      >
        <span>Events</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isEventsDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isEventsDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#C9CACE] rounded-md shadow-lg z-50">
          <div className="py-1">
            <Link
              href="/events/conferences"
              className="block px-4 py-2 text-sm text-dark-neutral hover:bg-[#F4F4F7]"
            >
              Conferences
            </Link>
            <Link
              href="/events/summits"
              className="block px-4 py-2 text-sm text-dark-neutral hover:bg-[#F4F4F7]"
            >
              Summits
            </Link>
            <Link
              href="/events/webinars"
              className="block px-4 py-2 text-sm text-dark-neutral hover:bg-[#F4F4F7]"
            >
              Webinars
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const AuthButtons = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <>
      {user ? (
        <Link
          href="/my-account"
          className="text-[16px] font-medium transition-colors duration-200 text-[#1E212A] hover:text-brand-blue"
        >
          MY ACCOUNT
        </Link>
      ) : (
        <div className="flex items-center space-x-2 ">
          <Link href="/auth/login">
            <button className="bg-brand-blue text-white py-1  text-xs lg:text-lg px-6 font-medium hover:bg-white hover:text-brand-blue hover:border-brand-blue border-2 border-transparent transition-colors duration-200">
              Log in
            </button>
          </Link>
          <Link href="/auth/login?screen_hint=signup">
            <button className="bg-brand-blue text-white py-1  text-xs lg:text-lg px-6 font-medium hover:bg-white hover:text-brand-blue  hover:border-brand-blue border-2 border-transparent transition-colors duration-200">
              Sign up
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default function Header() {
  return (
    <header className="bg-white bg-fixed shadow-sm poppins-thin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo_final.png" alt="logo" width={220} height={220} />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 px-6">
            <NavLink href="/interviews">Interviews</NavLink>
            <NavLink href="/articles">Articles</NavLink>
            <NavLink href="/shop">Shop</NavLink>
            <EventsDropdown />
            <NavLink href="/contract-publishing">Contract Publishing</NavLink>
          </nav>

          {/* Right side - Search and Account */}
          <div className="flex items-center space-x-6">
            {/* Search Icon */}
            <button className="text-[#1E212A] hover:text-brand-blue transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <AuthButtons />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}