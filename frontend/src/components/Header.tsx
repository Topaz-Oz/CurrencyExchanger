'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-green-600">Exchanger</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
              Send money
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
              Exchange rates
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
              Business
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
              Help
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">
              Log in
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
              Sign up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-green-600"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <a href="#" className="text-gray-700 hover:text-green-600 block px-3 py-2 text-base font-medium">
                Send money
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 block px-3 py-2 text-base font-medium">
                Exchange rates
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 block px-3 py-2 text-base font-medium">
                Business
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 block px-3 py-2 text-base font-medium">
                Help
              </a>
              <div className="pt-4 space-y-2">
                <button className="text-gray-700 hover:text-green-600 block px-3 py-2 text-base font-medium w-full text-left">
                  Log in
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-green-700 w-full">
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
