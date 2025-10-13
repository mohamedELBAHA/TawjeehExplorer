import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UserCircleIcon, 
  AcademicCapIcon,
  CogIcon,
  BellIcon,
  DocumentTextIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const navigation = [
  {
    name: 'Vue d\'ensemble',
    href: '/profile',
    icon: DocumentTextIcon,
    end: true
  },
  {
    name: 'Informations personnelles',
    href: '/profile/details',
    icon: UserCircleIcon,
    end: false
  },
  {
    name: 'Formation académique',
    href: '/profile/academic',
    icon: AcademicCapIcon,
    end: false
  },
  {
    name: 'Préférences',
    href: '/profile/preferences',
    icon: CogIcon,
    end: false
  },
  {
    name: 'Notifications',
    href: '/profile/notifications',
    icon: BellIcon,
    end: false
  },
];

export default function ProfileLayout() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-gray-600">Chargement du profil...</span>
        </div>
      </div>
    );
  }

  // If not loading but no user, redirect should be handled by ProtectedRoute
  // But show a fallback just in case
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600">Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/platform')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Retour à la plateforme
              </button>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : user?.email
                    }
                  </p>
                  <p className="text-xs text-gray-500">{profile?.plan || 'free'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <nav className="p-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = item.end 
                    ? location.pathname === item.href
                    : location.pathname.startsWith(item.href) && location.pathname !== '/profile';
                  
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive: navIsActive }) => {
                        const active = item.end 
                          ? location.pathname === item.href
                          : navIsActive || location.pathname.startsWith(item.href);
                        
                        return `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          active
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`;
                      }}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Profile Summary Card */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Profil</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ville:</span>
                  <span className="text-gray-900">{profile?.city || 'Non définie'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Niveau:</span>
                  <span className="text-gray-900">{profile?.class_level || 'Non défini'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan:</span>
                  <span className={`font-medium ${
                    profile?.plan === 'premium' ? 'text-blue-600' : 
                    profile?.plan === 'enterprise' ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {profile?.plan || 'free'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
