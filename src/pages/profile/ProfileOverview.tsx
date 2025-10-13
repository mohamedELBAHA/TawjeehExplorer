import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UserCircleIcon, 
  AcademicCapIcon,
  CogIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function ProfileOverview() {
  const { user, profile } = useAuth();

  const getCompletionStatus = () => {
    const checks = [
      { name: 'Informations personnelles', completed: profile?.first_name && profile?.last_name && profile?.city },
      { name: 'Niveau de classe', completed: profile?.class_level },
      { name: 'Formation académique', completed: false }, // Will be updated based on academic info
      { name: 'Préférences', completed: false }, // Will be updated based on preferences
    ];

    const completedCount = checks.filter(check => check.completed).length;
    const percentage = Math.round((completedCount / checks.length) * 100);

    return { checks, completedCount, percentage };
  };

  const { checks, completedCount, percentage } = getCompletionStatus();

  const quickActions = [
    {
      name: 'Modifier mes informations',
      href: '/profile/details',
      icon: UserCircleIcon,
      description: 'Nom, prénom, ville et niveau d\'études',
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100'
    },
    {
      name: 'Formation académique',
      href: '/profile/academic',
      icon: AcademicCapIcon,
      description: 'Type de bac, moyennes et centres d\'intérêt',
      color: 'bg-green-50 text-green-700 hover:bg-green-100'
    },
    {
      name: 'Mes préférences',
      href: '/profile/preferences',
      icon: CogIcon,
      description: 'Villes, filières et besoins spécifiques',
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100'
    },
    {
      name: 'Notifications',
      href: '/profile/notifications',
      icon: BellIcon,
      description: 'Paramétrer les alertes email',
      color: 'bg-orange-50 text-orange-700 hover:bg-orange-100'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vue d'ensemble du profil</h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles et vos préférences pour une expérience personnalisée.
        </p>
      </div>

      {/* Completion Status */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Complétude du profil</h2>
          <span className="text-2xl font-bold text-blue-600">{percentage}%</span>
        </div>
        
        <div className="w-full bg-white rounded-full h-3 mb-4">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center space-x-2">
              {check.completed ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              )}
              <span className={`text-sm ${check.completed ? 'text-green-700' : 'text-amber-700'}`}>
                {check.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Summary */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Compte</h3>
          <p className="text-lg font-semibold text-gray-900">
            {profile?.first_name && profile?.last_name 
              ? `${profile.first_name} ${profile.last_name}`
              : 'Non défini'
            }
          </p>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Localisation</h3>
          <p className="text-lg font-semibold text-gray-900">
            {profile?.city || 'Non définie'}
          </p>
          <p className="text-sm text-gray-600">Ville actuelle</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Formation</h3>
          <p className="text-lg font-semibold text-gray-900">
            {profile?.class_level || 'Non défini'}
          </p>
          <p className="text-sm text-gray-600">Niveau d'études</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className={`block p-4 rounded-lg border border-gray-200 transition-colors ${action.color}`}
            >
              <div className="flex items-start space-x-3">
                <action.icon className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">{action.name}</h3>
                  <p className="text-sm opacity-75">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">Aucune activité récente</p>
          <p className="text-sm text-gray-400 mt-1">
            Vos modifications de profil apparaîtront ici
          </p>
        </div>
      </div>
    </div>
  );
}
