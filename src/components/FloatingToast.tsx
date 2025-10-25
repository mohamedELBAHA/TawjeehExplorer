import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

interface FloatingToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  position?: { x: number; y: number };
}

const FloatingToast: React.FC<FloatingToastProps> = ({
  show,
  message,
  type,
  onClose,
  position = { x: 0, y: 0 }
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Auto close after 2 seconds
      const timer = setTimeout(() => {
        setIsAnimating(false);
        // Wait for exit animation to complete
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 300);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4" />;
      case 'error':
        return <X className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <Check className="w-4 h-4" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  return (
    <div
      className={`fixed z-50 pointer-events-none transition-all duration-300 ${
        isAnimating 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-2'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        animation: isAnimating ? 'floatUp 2s ease-out forwards' : undefined
      }}
    >
      <div className={`
        ${getColors()} 
        px-4 py-2 rounded-lg shadow-lg 
        flex items-center space-x-2 
        text-sm font-medium
        backdrop-blur-sm
        border border-white/20
      `}>
        {getIcon()}
        <span>{message}</span>
      </div>
      

    </div>
  );
};

export default FloatingToast;
