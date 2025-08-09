import { useState } from "react";
import { Send } from "lucide-react";

export function MinimalChatTest() {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    console.log('Submitting message:', message);
    
    try {
      const response = await fetch('/api/flutterina/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          pageContext: '/',
          sessionId: `test_${Date.now()}`
        })
      });
      
      const data = await response.json();
      console.log('Response:', data);
      alert(`AI Response: ${data.aiMessage?.message || 'No response'}`);
      setMessage("");
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-yellow-400 p-4 rounded shadow-lg z-50">
      <h3 className="text-black font-bold mb-2">Minimal Chat Test</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Type here..."
          className="px-2 py-1 border rounded text-black"
        />
        <button
          onClick={handleSubmit}
          disabled={!message.trim()}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}