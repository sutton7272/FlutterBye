import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useLocation } from 'wouter';
import { toast } from '../hooks/use-toast';
import { 
  Calendar, 
  MapPin, 
  DollarSign,
  Plus,
  Droplets,
  Settings
} from 'lucide-react';

export default function CreateJobPage() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: user?.address || '',
    serviceType: 'basic',
    poolSize: 'medium',
    scheduledDate: '',
    price: '',
    isRecurring: false,
    recurringFrequency: 'weekly',
    specialRequests: '',
    chemicalNeeds: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        price: formData.price ? parseInt(formData.price) * 100 : null, // Convert to cents
      };

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      const job = await response.json();

      toast({
        title: "Job posted successfully!",
        description: "Your job has been posted and cleaners can now apply.",
      });

      setLocation(`/job/${job.id}`);
    } catch (error) {
      toast({
        title: "Failed to create job",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const serviceTypes = [
    { value: 'basic', label: 'Basic Cleaning', description: 'Skimming, vacuuming, and basic maintenance' },
    { value: 'deep', label: 'Deep Cleaning', description: 'Comprehensive cleaning including algae treatment' },
    { value: 'repair', label: 'Repair Service', description: 'Equipment repair and troubleshooting' },
    { value: 'maintenance', label: 'Full Maintenance', description: 'Complete pool care and chemical balancing' }
  ];

  const poolSizes = [
    { value: 'small', label: 'Small Pool', description: 'Up to 15,000 gallons' },
    { value: 'medium', label: 'Medium Pool', description: '15,000 - 25,000 gallons' },
    { value: 'large', label: 'Large Pool', description: '25,000+ gallons' }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Post a Pool Cleaning Job
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Tell us about your pool cleaning needs and get quotes from professional cleaners.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Plus className="mr-2" size={20} />
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="pool-input w-full"
                  placeholder="e.g., Weekly Pool Cleaning Service"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="pool-input w-full resize-none"
                  placeholder="Describe your pool cleaning needs, any specific requirements, and what you're looking for..."
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="inline mr-1" size={16} />
                  Pool Location *
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="pool-input w-full"
                  placeholder="Enter the address where pool cleaning is needed"
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Settings className="mr-2" size={20} />
              Service Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Service Type *
                </label>
                <div className="space-y-3">
                  {serviceTypes.map((type) => (
                    <label key={type.value} className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        value={type.value}
                        checked={formData.serviceType === type.value}
                        onChange={handleChange}
                        className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{type.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{type.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Pool Size *
                </label>
                <div className="space-y-3">
                  {poolSizes.map((size) => (
                    <label key={size.value} className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="poolSize"
                        value={size.value}
                        checked={formData.poolSize === size.value}
                        onChange={handleChange}
                        className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{size.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{size.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Calendar className="mr-2" size={20} />
              Scheduling
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Start Date *
                </label>
                <input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  required
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="pool-input w-full"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="inline mr-1" size={16} />
                  Budget (Optional)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="pool-input w-full"
                  placeholder="Enter your budget in dollars"
                  min="0"
                  step="1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave blank to receive quotes from cleaners
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    id="isRecurring"
                    name="isRecurring"
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    This is a recurring service
                  </label>
                </div>

                {formData.isRecurring && (
                  <div className="mt-3">
                    <label htmlFor="recurringFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frequency
                    </label>
                    <select
                      id="recurringFrequency"
                      name="recurringFrequency"
                      value={formData.recurringFrequency}
                      onChange={handleChange}
                      className="pool-input w-full md:w-auto"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Requirements */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Droplets className="mr-2" size={20} />
              Additional Requirements
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Requests
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={3}
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="pool-input w-full resize-none"
                  placeholder="Any special instructions, accessibility notes, or specific requirements..."
                />
              </div>

              <div>
                <label htmlFor="chemicalNeeds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chemical Needs
                </label>
                <textarea
                  id="chemicalNeeds"
                  name="chemicalNeeds"
                  rows={3}
                  value={formData.chemicalNeeds}
                  onChange={handleChange}
                  className="pool-input w-full resize-none"
                  placeholder="Specific chemical treatments needed, current water conditions, or chemical preferences..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setLocation('/dashboard')}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="pool-button flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus className="mr-2" size={18} />
              )}
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}