import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../lib/auth';
import { toast } from '../hooks/use-toast';
import { 
  MapPin, 
  Calendar, 
  DollarSign,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';

interface JobDetailsPageProps {
  jobId: number;
}

export default function JobDetailsPage({ jobId }: JobDetailsPageProps) {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const { data: job, isLoading } = useQuery({
    queryKey: ['/api/jobs', jobId],
    queryFn: async () => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch job');
      return response.json();
    },
    enabled: !!token && !!jobId,
  });

  const acceptJobMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/jobs/${jobId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to accept job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', jobId] });
      toast({
        title: "Job accepted!",
        description: "You have successfully accepted this job.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to accept job",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await fetch(`/api/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', jobId] });
      toast({
        title: "Status updated!",
        description: "Job status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update status",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Job Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The job you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="text-yellow-500" size={20} />;
      case 'accepted':
        return <AlertCircle className="text-blue-500" size={20} />;
      case 'in_progress':
        return <AlertCircle className="text-orange-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
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

  const canAcceptJob = user?.isCleaner && job.status === 'open';
  const canUpdateStatus = (user?.id === job.customerId || user?.id === job.cleanerId) && job.status !== 'completed' && job.status !== 'cancelled';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {job.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                {getStatusIcon(job.status)}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                  {job.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${(job.price || 0) / 100}
              </div>
              {job.isRecurring && (
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Recurring {job.recurringFrequency}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Job Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Job Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Service Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <MapPin className="mr-3 text-gray-400" size={18} />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{job.address}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Calendar className="mr-3 text-gray-400" size={18} />
                    <div>
                      <div className="font-medium">Scheduled Date</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(job.scheduledDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Service Type</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {job.serviceType} cleaning
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Pool Size</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {job.poolSize} pool
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            {(job.specialRequests || job.chemicalNeeds) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Special Requirements
                </h2>
                
                {job.specialRequests && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Special Requests
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{job.specialRequests}</p>
                  </div>
                )}

                {job.chemicalNeeds && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Chemical Needs
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{job.chemicalNeeds}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions
              </h3>
              
              <div className="space-y-3">
                {canAcceptJob && (
                  <button
                    onClick={() => acceptJobMutation.mutate()}
                    disabled={acceptJobMutation.isPending}
                    className="pool-button w-full flex items-center justify-center disabled:opacity-50"
                  >
                    {acceptJobMutation.isPending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="mr-2" size={18} />
                        Accept Job
                      </>
                    )}
                  </button>
                )}

                {canUpdateStatus && job.status === 'accepted' && user?.isCleaner && (
                  <button
                    onClick={() => updateStatusMutation.mutate('in_progress')}
                    disabled={updateStatusMutation.isPending}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Start Work
                  </button>
                )}

                {canUpdateStatus && job.status === 'in_progress' && user?.isCleaner && (
                  <button
                    onClick={() => updateStatusMutation.mutate('completed')}
                    disabled={updateStatusMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Mark Complete
                  </button>
                )}

                <button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <MessageCircle className="mr-2" size={18} />
                  Send Message
                </button>
              </div>
            </div>

            {/* Customer/Cleaner Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {user?.isCleaner ? 'Customer' : 'Cleaner'} Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                    <User className="text-white" size={18} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user?.isCleaner ? 'Pool Owner' : 'Assigned Cleaner'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {job.cleanerId ? 'Cleaner Assigned' : 'No cleaner assigned yet'}
                    </div>
                  </div>
                </div>

                {job.cleanerId && (
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone size={14} className="mr-2" />
                      Contact via phone
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail size={14} className="mr-2" />
                      Contact via email
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Timeline
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <div>
                    <div className="text-gray-900 dark:text-white">Job Posted</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {job.cleanerId && (
                  <div className="flex items-center text-sm">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    <div>
                      <div className="text-gray-900 dark:text-white">Job Accepted</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {new Date(job.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center text-sm">
                  <Clock className="text-gray-400 mr-2" size={16} />
                  <div>
                    <div className="text-gray-900 dark:text-white">Scheduled Date</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {new Date(job.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}