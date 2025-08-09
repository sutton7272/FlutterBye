import { useState } from "react";
import { Send, Bug } from "lucide-react";

export function DebugChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<string[]>([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    console.log('🐛 Debug Chat - Attempting to send:', message);
    
    try {
      const response = await fetch('/api/flutterina/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          pageContext: '/',
          sessionId: `debug_${Date.now()}`
        })
      });
      
      console.log('🐛 Debug Chat - Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🐛 Debug Chat - Response data:', data);
        setResponses(prev => [...prev, `✅ Sent: "${message}" - Got response: "${data.aiMessage?.message || 'No AI response'}"`]);
      } else {
        const errorText = await response.text();
        console.error('🐛 Debug Chat - Error response:', errorText);
        setResponses(prev => [...prev, `❌ Error ${response.status}: ${errorText}`]);
      }
      
      setMessage("");
    } catch (error) {
      console.error('🐛 Debug Chat - Network error:', error);
      setResponses(prev => [...prev, `❌ Network error: ${error.message}`]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log('🐛 Debug Chat - Key event:', {
      key: e.key,
      code: e.code,
      keyCode: e.keyCode,
      which: e.which,
      type: e.type,
      target: e.target?.tagName
    });
    
    if (e.key === 'Enter') {
      console.log('🐛 Debug Chat - Enter detected, preventing default and sending');
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  };

  return (
    <>
      {/* Debug Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => {
            console.log('🐛 Debug Chat - Toggle clicked');
            setIsOpen(!isOpen);
          }}
          className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center justify-center"
        >
          {isOpen ? '✕' : <Bug className="h-6 w-6" />}
        </button>
      </div>

      {/* Debug Window */}
      {isOpen && (
        <div className="fixed top-20 right-4 w-96 h-80 bg-red-50 dark:bg-red-900 rounded-lg shadow-xl border-2 border-red-500 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-red-500 p-3 text-white rounded-t-lg">
            <h3 className="font-bold">🐛 Debug Chat - Raw Testing</h3>
          </div>

          {/* Debug Output */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
            <div className="text-red-700 dark:text-red-300">
              <strong>Debug Log:</strong>
            </div>
            {responses.map((response, index) => (
              <div key={index} className="p-2 bg-white dark:bg-red-800 rounded border text-red-800 dark:text-red-200">
                {response}
              </div>
            ))}
            {responses.length === 0 && (
              <div className="text-red-600 dark:text-red-400">
                No messages sent yet. Type and press Enter to test.
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t-2 border-red-500">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  console.log('🐛 Debug Chat - Input changed:', e.target.value);
                  setMessage(e.target.value);
                }}
                onKeyDown={handleKeyPress}
                onKeyUp={(e) => console.log('🐛 Debug Chat - Key up:', e.key)}
                onKeyPress={(e) => console.log('🐛 Debug Chat - Key press:', e.key)}
                placeholder="Type here and press Enter..."
                className="flex-1 px-2 py-1 border-2 border-red-500 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              <button
                onClick={() => {
                  console.log('🐛 Debug Chat - Button clicked');
                  sendMessage();
                }}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded flex items-center gap-1"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
              Debug: Press Enter or click send. Check browser console (F12) for detailed logs.
            </div>
          </div>
        </div>
      )}
    </>
  );
}