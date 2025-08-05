import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Star, 
  MapPin, 
  Phone,
  Mail,
  Shield,
  Award,
  DollarSign
} from 'lucide-react';

export default function CleanersPage() {
  const { data: cleaners = [], isLoading } = useQuery({
    queryKey: ['/api/cleaners'],
    queryFn: async () => {
      const response = await fetch('/api/cleaners');
      if (!response.ok) throw new Error('Failed to fetch cleaners');
      return response.json();
    },
  });

  const renderStars = (rating: number, totalRatings: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} className="text-yellow-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} size={16} className="text-yellow-400 fill-current opacity-50" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300 dark:text-gray-600" />);
      }
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          ({totalRatings} reviews)
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Professional Pool Cleaners
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
              Browse our network of verified, professional pool cleaners. 
              All cleaners are background checked and insurance verified.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{cleaners.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">Verified Cleaners</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">100%</h3>
            <p className="text-gray-600 dark:text-gray-400">Background Checked</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">4.8</h3>
            <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
          </div>
        </div>

        {/* Cleaners Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : cleaners.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No cleaners available
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Check back later for available pool cleaners in your area.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cleaners.map((cleaner: any) => (
              <div key={cleaner.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {cleaner.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {cleaner.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {renderStars(cleaner.rating || 0, cleaner.totalRatings || 0)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="text-green-500" size={16} />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  {cleaner.phone && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone size={14} className="mr-2" />
                      {cleaner.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail size={14} className="mr-2" />
                    {cleaner.email}
                  </div>
                  {cleaner.address && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin size={14} className="mr-2" />
                      {cleaner.address}
                    </div>
                  )}
                </div>

                {/* Services & Pricing */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Starting Rate
                    </span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center">
                      <DollarSign size={16} />
                      50/hr
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Services:</strong> Basic cleaning, Chemical balancing, Equipment maintenance
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Experience:</strong> 5+ years
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  <button className="pool-button w-full text-sm">
                    Contact Cleaner
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need Pool Cleaning Services?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Post your job requirements and let professional cleaners come to you with competitive quotes.
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Post a Job Now
          </button>
        </div>
      </div>
    </div>
  );
}