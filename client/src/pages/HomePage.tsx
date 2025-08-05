import { Link } from 'wouter';
import { useAuth } from '../lib/auth';
import { 
  Search, 
  Calendar, 
  CheckCircle, 
  Star,
  Users,
  Briefcase,
  Clock,
  DollarSign
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="wave-animation inline-block text-6xl mb-6">🏊‍♀️</div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Crystal Clear Pool
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                {" "}Services
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with professional pool cleaners in your area. Get quotes, schedule services, 
              and enjoy sparkling clean pools year-round.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  {user.isCleaner ? (
                    <Link href="/jobs">
                      <button className="pool-button text-lg px-8 py-4">
                        <Search className="mr-2" size={20} />
                        Find Work
                      </button>
                    </Link>
                  ) : (
                    <Link href="/create-job">
                      <button className="pool-button text-lg px-8 py-4">
                        <Calendar className="mr-2" size={20} />
                        Book Service
                      </button>
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <button className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                      Dashboard
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <button className="pool-button text-lg px-8 py-4">
                      <CheckCircle className="mr-2" size={20} />
                      Get Started
                    </button>
                  </Link>
                  <Link href="/cleaners">
                    <button className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                      <Users className="mr-2" size={20} />
                      Browse Cleaners
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How PoolPal Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple, fast, and reliable pool services at your fingertips
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center pool-card bg-white dark:bg-gray-700 p-8 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Post Your Job
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Describe your pool cleaning needs, set your budget, and choose your preferred schedule.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center pool-card bg-white dark:bg-gray-700 p-8 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Get Matched
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Professional cleaners in your area will apply for your job with competitive quotes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center pool-card bg-white dark:bg-gray-700 p-8 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Enjoy Clean Pool
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Relax while your chosen professional takes care of your pool maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose PoolPal?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Verified Cleaners</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                All cleaners are background checked and insurance verified
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="text-teal-600 dark:text-teal-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                One-time cleaning or recurring maintenance on your schedule
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Competitive Pricing</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Compare quotes and choose the best value for your budget
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Service</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Expert pool maintenance with professional equipment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Dive In?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of pool owners who trust PoolPal for their pool maintenance needs.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/register">
                  <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started as Customer
                  </button>
                </Link>
                <Link href="/register?type=cleaner">
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg transition-all duration-300">
                    Join as Cleaner
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}