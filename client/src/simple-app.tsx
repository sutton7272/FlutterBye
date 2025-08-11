import { useState } from "react";

function SimpleApp() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">FlutterBye Loading Test</h1>
        <p className="text-xl mb-4">Count: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Click me
        </button>
        <p className="mt-4 text-green-400">✅ React is working!</p>
      </div>
    </div>
  );
}

export default SimpleApp;