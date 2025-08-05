import { Link, useLocation } from 'wouter';
import { useAuth } from '../lib/auth';
import { 
  Home, 
  Users, 
  Briefcase, 
  Plus, 
  User, 
  LogOut, 
  LogIn,
  UserPlus,
  Settings
} from 'lucide-react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-blue-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏊‍♀️</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                PoolPal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}>
                <Home size={18} />
                <span>Home</span>
              </div>
            </Link>

            <Link href="/cleaners">
              <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive('/cleaners') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}>
                <Users size={18} />
                <span>Find Cleaners</span>
              </div>
            </Link>

            {user && (
              <>
                <Link href="/dashboard">
                  <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isActive('/dashboard') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}>
                    <Briefcase size={18} />
                    <span>Dashboard</span>
                  </div>
                </Link>

                <Link href="/jobs">
                  <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isActive('/jobs') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}>
                    <Briefcase size={18} />
                    <span>Jobs</span>
                  </div>
                </Link>

                {!user.isCleaner && (
                  <Link href="/create-job">
                    <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      isActive('/create-job') 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                        : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                    }`}>
                      <Plus size={18} />
                      <span>Post Job</span>
                    </div>
                  </Link>
                )}

                <Link href="/intelligence">
                  <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isActive('/intelligence') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}>
                    <Briefcase size={18} />
                    <span>Intelligence</span>
                  </div>
                </Link>

                <Link href="/data-protection">
                  <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isActive('/data-protection') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}>
                    <Briefcase size={18} />
                    <span>Data Protection</span>
                  </div>
                </Link>

                <Link href="/data-mirrors">
                  <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isActive('/data-mirrors') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}>
                    <Briefcase size={18} />
                    <span>Data Mirrors</span>
                  </div>
                </Link>

                <Link href="/feature-toggle">
                  <div className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isActive('/feature-toggle') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}>
                    <Settings size={18} />
                    <span>Feature Control</span>
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile">
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                    <User size={18} />
                    <span className="hidden sm:inline">{user.name}</span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <div className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 cursor-pointer">
                    <LogIn size={18} />
                    <span>Login</span>
                  </div>
                </Link>
                <Link href="/register">
                  <div className="pool-button flex items-center space-x-1 cursor-pointer">
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}