import { useState } from "react";
import { X } from "lucide-react";

interface SimpleDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleDemoModal({ isOpen, onClose }: SimpleDemoModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  console.log("SimpleDemoModal render - isOpen:", isOpen);
  
  if (!isOpen) {
    console.log("Modal not open, returning null");
    return null;
  }
  
  console.log("Modal should show now!");
  
  const slides = [
    {
      title: "Wallet Intelligence",
      content: "Analyze any crypto wallet with AI-powered scoring from 0-1000 points"
    },
    {
      title: "Content Engine", 
      content: "Generate viral content optimized for blockchain marketing"
    },
    {
      title: "Market Intelligence",
      content: "Real-time market analysis and predictive analytics"
    }
  ];
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={{
        backgroundColor: '#1a1a2e',
        border: '2px solid #00d4ff',
        borderRadius: '12px',
        padding: '32px',
        width: '90%',
        maxWidth: '600px',
        color: 'white',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '24px'
          }}
        >
          ✕
        </button>
        
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
          FlutterAI Demo: {slides[currentSlide].title}
        </h2>
        
        <p style={{ fontSize: '16px', marginBottom: '32px', lineHeight: '1.5' }}>
          {slides[currentSlide].content}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            style={{
              padding: '8px 16px',
              backgroundColor: currentSlide === 0 ? '#333' : '#00d4ff',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <span style={{ color: '#00d4ff' }}>
            {currentSlide + 1} / {slides.length}
          </span>
          
          <button 
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            style={{
              padding: '8px 16px',
              backgroundColor: currentSlide === slides.length - 1 ? '#333' : '#00d4ff',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}