export default function TestRoute() {
  return (
    <div className="min-h-screen bg-green-900 text-white p-8">
      <h1 className="text-4xl font-bold">TEST ROUTE SUCCESS!</h1>
      <p className="text-xl mt-4">This route is working correctly.</p>
      <p>Path: {window.location.pathname}</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
}