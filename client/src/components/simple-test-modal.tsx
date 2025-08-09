import { useState } from "react";

export function SimpleTestModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => {
          console.log("Opening test modal");
          setIsOpen(true);
        }}
        style={{
          position: 'fixed',
          top: '50px',
          right: '10px',
          zIndex: 1000,
          padding: '15px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        TEST MODAL
      </button>
      
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div style={{
            backgroundColor: 'white',
            padding: '50px',
            borderRadius: '10px',
            color: 'black',
            fontSize: '24px'
          }}>
            <h1>TEST MODAL WORKS!</h1>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}