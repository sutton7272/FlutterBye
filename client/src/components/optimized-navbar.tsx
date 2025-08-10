import { Link } from "wouter";

export default function OptimizedNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white">
            FlutterBye
          </Link>
          <div className="flex space-x-4">
            <Link href="/home" className="text-gray-300 hover:text-white px-3 py-2 text-sm">
              Home
            </Link>
            <Link href="/info" className="text-gray-300 hover:text-white px-3 py-2 text-sm">
              Info
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}