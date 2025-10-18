import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface PlatformHeaderProps {
  showNotificationBanner?: boolean;
  onDismissNotification?: () => void;
  customNotificationContent?: React.ReactNode;
}

const PlatformHeader: React.FC<PlatformHeaderProps> = ({ 
  showNotificationBanner = false, 
  onDismissNotification,
  customNotificationContent
}) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string) => {
    return isActive(path) 
      ? "text-[#cda86b] font-medium" 
      : "text-gray-200 hover:text-[#cda86b] transition-colors";
  };

  const defaultNotificationContent = (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2}/>
          <circle cx="12" cy="12" r="6" strokeWidth={2}/>
          <circle cx="12" cy="12" r="2" strokeWidth={2}/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          Découvrez les écoles qui correspondent parfaitement à votre profil !
        </p>
        <p className="text-xs text-gray-200">
          Utilisez notre outil intelligent pour des recommandations personnalisées.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className="bg-[#004235] shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-white hover:text-[#cda86b] transition-colors">
                Tawjeeh Navigator
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <nav className="flex space-x-8">
                <Link to="/" className={getLinkClass('/')}>
                  Accueil
                </Link>
                <Link to="/platform" className={getLinkClass('/platform')}>
                  Plateforme
                </Link>
                <Link to="/simulateur" className={getLinkClass('/simulateur')}>
                  Simulateur
                </Link>
                {user && (
                  <Link 
                    to="/profile" 
                    className={`flex items-center space-x-1 ${getLinkClass('/profile')}`}
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      {showNotificationBanner && onDismissNotification && (
        <div className="bg-gradient-to-r from-[#004235] to-[#cda86b] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {customNotificationContent || defaultNotificationContent}
              <div className="flex items-center space-x-3">
                {!customNotificationContent && (
                  <Link
                    to="/platform#matcher"
                    className="bg-white text-[#004235] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Essayer maintenant
                  </Link>
                )}
                <button
                  onClick={onDismissNotification}
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlatformHeader;
