import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Briefcase, 
  Plus, 
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function JobsPage() {
  const { user, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch jobs based on user type
  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: user?.isCleaner ? ['/api/jobs/open'] : ['/api/jobs/my'],
    queryFn: async () => {
      const endpoint = user?.isCleaner ? '/api/jobs/open' : '/api/jobs/my';
      const headers: Record<string, string> = {};
      
      if (!user?.isCleaner) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, { headers });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    },
    enabled: !!user,
  });

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const handleAcceptJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to accept job');
      
      refetch();
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.isCleaner ? 'Available Jobs' : 'My Jobs'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {user.isCleaner 
                  ? 'Browse and apply for pool cleaning jobs' 
                  : 'Manage your pool cleaning requests'
                }
              </p>
            </div>
            {!user.isCleaner && (
              <Link href="/create-job">
                <button className="pool-button flex items-center">
                  <Plus size={18} className="mr-2" />
                  Post New Job
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pool-input w-full pl-10"
              />
            </div>

            {/* Status Filter */}
            {!user.isCleaner && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pool-input pl-10 pr-8 min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="accepted">Accepted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Jobs List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              {searchTerm || statusFilter !== 'all' ? 'No jobs match your filters' : 'No jobs available'}
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {user.isCleaner 
                ? 'Check back later for new opportunities'
                : 'Create your first job request to get started'
              }
            </p>
            {!user.isCleaner && (
              <Link href="/create-job">
                <button className="mt-4 pool-button">
                  <Plus size={18} className="mr-2" />
                  Post Your First Job
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job: any) => (
              <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      {!user.isCleaner && (
                        <div className="flex items-center gap-1">
                          {getStatusIcon(job.status)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.address}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(job.scheduledDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        {job.poolSize} pool
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        {job.serviceType} service
                      </div>
                    </div>

                    {job.specialRequests && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Special Requests:</strong> {job.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                      ${(job.price || 0) / 100}
                    </div>
                    {job.isRecurring && (
                      <div className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                        Recurring {job.recurringFrequency}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {user.isCleaner && job.status === 'open' ? (
                        <button
                          onClick={() => handleAcceptJob(job.id)}
                          className="pool-button w-full text-sm"
                        >
                          Accept Job
                        </button>
                      ) : (
                        <Link href={`/job/${job.id}`}>
                          <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 font-medium py-2 px-4 rounded-lg text-sm transition-colors w-full">
                            View Details
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}