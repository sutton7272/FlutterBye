import { useAuth } from '../lib/auth';
import { useQuery } from '@tanstack/react-query';
import { 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';

export default function DashboardPage() {
  const { user, token } = useAuth();

  // Fetch user's jobs
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/jobs/my'],
    queryFn: async () => {
      const response = await fetch('/api/jobs/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    },
    enabled: !!token,
  });

  // Fetch open jobs (for cleaners)
  const { data: openJobs = [], isLoading: openJobsLoading } = useQuery({
    queryKey: ['/api/jobs/open'],
    queryFn: async () => {
      const response = await fetch('/api/jobs/open');
      if (!response.ok) throw new Error('Failed to fetch open jobs');
      return response.json();
    },
    enabled: user?.isCleaner,
  });

  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="text-yellow-500" size={16} />;
      case 'accepted':
        return <AlertCircle className="text-blue-500" size={16} />;
      case 'in_progress':
        return <AlertCircle className="text-orange-500" size={16} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'cancelled':
        return <AlertCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {user.isCleaner ? 'Ready to take on new pool cleaning jobs?' : 'Manage your pool cleaning requests'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Account Type</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.isCleaner 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {user.isCleaner ? (
                  <>
                    <Users size={14} className="mr-1" />
                    Pool Cleaner
                  </>
                ) : (
                  <>
                    <Briefcase size={14} className="mr-1" />
                    Customer
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
              </div>
              <Briefcase className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {jobs.filter((job: any) => ['accepted', 'in_progress'].includes(job.status)).length}
                </p>
              </div>
              <Clock className="text-orange-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {jobs.filter((job: any) => job.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${jobs.filter((job: any) => job.status === 'completed')
                    .reduce((sum: number, job: any) => sum + (job.price || 0), 0) / 100}
                </p>
              </div>
              <DollarSign className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.isCleaner ? 'Your Jobs' : 'Your Requests'}
              </h2>
            </div>
            <div className="p-6">
              {jobsLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No jobs yet</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {user.isCleaner ? 'Browse available jobs to get started' : 'Create your first job request'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job: any) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.address}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          {getStatusIcon(job.status)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ${(job.price || 0) / 100}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(job.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Jobs (for cleaners) or Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.isCleaner ? 'Available Jobs' : 'Quick Actions'}
              </h2>
            </div>
            <div className="p-6">
              {user.isCleaner ? (
                openJobsLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    ))}
                  </div>
                ) : openJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No open jobs</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Check back later for new opportunities
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {openJobs.slice(0, 5).map((job: any) => (
                      <div key={job.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                        <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.address}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            ${(job.price || 0) / 100}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(job.scheduledDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                // Quick actions for customers
                <div className="space-y-4">
                  <button className="w-full pool-button flex items-center justify-center">
                    <Calendar className="mr-2" size={18} />
                    Schedule New Cleaning
                  </button>
                  <button className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:bg-gray-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-600 font-semibold py-3 px-4 rounded-lg transition-colors">
                    <Users className="mr-2" size={18} />
                    Browse Cleaners
                  </button>
                  <button className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 font-semibold py-3 px-4 rounded-lg transition-colors">
                    <Star className="mr-2" size={18} />
                    View Reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}