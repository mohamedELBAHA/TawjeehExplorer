import React from 'react';
import { useAuth, isAuthenticated, hasProfile } from '../contexts/AuthContext';

export function AuthStatus() {
  const { user, profile, loading, refreshProfile } = useAuth();

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-3"></div>
          <span className="text-blue-700">Loading authentication...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated(user)) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Not Authenticated</h3>
        <p className="text-gray-600">Please sign in to access your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-green-800 mb-3">Authentication Status</h3>
      
      <div className="space-y-2">
        <div>
          <span className="font-medium text-green-700">User ID:</span>
          <span className="ml-2 text-gray-700">{user.id}</span>
        </div>
        
        <div>
          <span className="font-medium text-green-700">Email:</span>
          <span className="ml-2 text-gray-700">{user.email}</span>
        </div>

        {hasProfile(profile) ? (
          <div className="mt-4 p-3 bg-white rounded border">
            <h4 className="font-medium text-gray-800 mb-2">Profile Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Name:</span>
                <span className="ml-2">
                  {profile.first_name && profile.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile.first_name || profile.last_name || 'Not set'
                  }
                </span>
              </div>
              <div>
                <span className="font-medium">Class Level:</span>
                <span className="ml-2">{profile.class_level || 'Not set'}</span>
              </div>
              <div>
                <span className="font-medium">City:</span>
                <span className="ml-2">{profile.city || 'Not set'}</span>
              </div>
              <div>
                <span className="font-medium">Plan:</span>
                <span className="ml-2">{profile.plan || 'free'}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Plan Expiry:</span>
                <span className="ml-2">
                  {profile.plan_expiry 
                    ? new Date(profile.plan_expiry).toLocaleDateString()
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-700">Profile not found or not loaded.</p>
          </div>
        )}

        <button
          onClick={refreshProfile}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Refresh Profile
        </button>
      </div>
    </div>
  );
}
