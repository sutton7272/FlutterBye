import { Router, Route, Switch } from 'wouter';
import { AuthProvider, useAuth } from './lib/auth';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/theme-provider';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import CleanersPage from './pages/CleanersPage';
import CreateJobPage from './pages/CreateJobPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ProfilePage from './pages/ProfilePage';

// Components
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import { FlutterAIIntelligenceDashboard } from './components/FlutterAIIntelligenceDashboard';
import { DataProtectionDashboard } from './components/DataProtectionDashboard';
import { DataMirrorDashboard } from './components/DataMirrorDashboard';
import FeatureToggleDashboard from './components/FeatureToggleDashboard';
import FeatureReleaseAnalyzer from './components/FeatureReleaseAnalyzer';
import DemoShowcase from './pages/DemoShowcase';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main>
        <Router>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/cleaners" component={CleanersPage} />
            
            {/* Protected Routes */}
            <Route path="/dashboard">
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </Route>
            
            <Route path="/jobs">
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            </Route>
            
            <Route path="/create-job">
              <ProtectedRoute>
                <CreateJobPage />
              </ProtectedRoute>
            </Route>
            
            <Route path="/job/:id">
              {(params) => (
                <ProtectedRoute>
                  <JobDetailsPage jobId={parseInt(params.id)} />
                </ProtectedRoute>
              )}
            </Route>
            
            <Route path="/profile">
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            </Route>
            
            <Route path="/intelligence">
              <ProtectedRoute>
                <FlutterAIIntelligenceDashboard />
              </ProtectedRoute>
            </Route>
            
            <Route path="/data-protection">
              <ProtectedRoute>
                <DataProtectionDashboard />
              </ProtectedRoute>
            </Route>
            
            <Route path="/data-mirrors">
              <ProtectedRoute>
                <DataMirrorDashboard />
              </ProtectedRoute>
            </Route>
            
            <Route path="/feature-toggle">
              <ProtectedRoute>
                <FeatureToggleDashboard />
              </ProtectedRoute>
            </Route>
            
            <Route path="/ai-analyzer">
              <ProtectedRoute>
                <FeatureReleaseAnalyzer />
              </ProtectedRoute>
            </Route>
            
            <Route path="/demo">
              <DemoShowcase />
            </Route>
            
            {/* 404 Page */}
            <Route>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    404 - Page Not Found
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              </div>
            </Route>
          </Switch>
        </Router>
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}