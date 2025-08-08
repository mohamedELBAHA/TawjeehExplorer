import React, { useState } from 'react';
import StudentMatcher from './StudentMatcher';

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Hide hint after 10 seconds or when clicked
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* "I'm here" floating hint */}
      {showHint && !isOpen && (
        <div className="fixed bottom-32 right-6 z-40 animate-bounce">
          <div className="bg-[#cda86b] text-[#004235] px-4 py-2 rounded-full shadow-lg relative">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">👋 Je suis là </span>
              <button
                onClick={() => setShowHint(false)}
                className="text-[#004235] hover:text-red-600 ml-2"
                aria-label="Fermer l'indication"
              >
                ×
              </button>
            </div>
            {/* Arrow pointing to the button */}
            <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#cda86b]"></div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setShowHint(false); // Hide hint when button is clicked
        }}
        className="bg-[#004235] hover:bg-[#cda86b] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 group relative"
        aria-label="Ouvrir l'assistant d'orientation"
      >
        <div className="relative">
          {/* Target/Compass icon for matcher */}
          <svg 
            className="w-6 h-6 transition-transform group-hover:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" strokeWidth={2}/>
            <circle cx="12" cy="12" r="6" strokeWidth={2}/>
            <circle cx="12" cy="12" r="2" strokeWidth={2}/>
          </svg>
          
          {/* Pulse indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#cda86b] rounded-full animate-pulse"></div>
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          🎯 Assistant d'orientation personnalisé
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </button>

      {/* Student Matcher Modal */}
      {isOpen && (
        <StudentMatcher onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default ChatbotWidget;
