export default function RouteTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Route Test Page</h1>
        <p className="text-slate-300 text-xl">If you can see this, the routing is working correctly!</p>
        <div className="mt-8 p-6 bg-slate-800/50 border border-cyan-500/20 rounded-lg">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Multi-Chain Intelligence Dashboard</h2>
          <p className="text-white">This confirms the route is accessible. Now loading the full dashboard...</p>
        </div>
      </div>
    </div>
  );
}