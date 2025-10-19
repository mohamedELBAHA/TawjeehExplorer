import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PlatformHeader from '../components/PlatformHeader';
import { 
  User, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Edit2,
  Save,
  X,
  LogOut
} from 'lucide-react';

export default function Profile() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    city: profile?.city || '',
    class_level: profile?.class_level || ''
  });

  const handleSave = () => {
    // TODO: Implement profile update logic
    console.log('Saving profile:', editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      city: profile?.city || '',
      class_level: profile?.class_level || ''
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformHeader 
        showNotificationBanner={false}
        onDismissNotification={() => {}}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/platform')}
            className="text-[#004235] hover:text-[#cda86b] transition-colors mb-4 flex items-center gap-2"
          >
            ← Retour à la plateforme
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#004235] to-[#cda86b] px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : 'Profil non complété'
                    }
                  </h2>
                  <p className="text-white/80">{user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? 'Annuler' : 'Modifier'}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {isEditing ? (
              /* Edit Mode */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={editedProfile.first_name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                      placeholder="Votre prénom"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={editedProfile.last_name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={editedProfile.city}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                      placeholder="Votre ville"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau d'études
                    </label>
                    <select
                      value={editedProfile.class_level}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, class_level: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                    >
                      <option value="">Sélectionnez votre niveau</option>
                      <option value="5ème">5ème</option>
                      <option value="6ème">6ème</option>
                      <option value="Bac">Baccalauréat</option>
                      <option value="Bac+">Bac+</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#004235] hover:bg-[#004235]/90 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Informations personnelles
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-[#004235]" />
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium">
                          {profile?.first_name && profile?.last_name 
                            ? `${profile.first_name} ${profile.last_name}`
                            : 'Non renseigné'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#004235]" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#004235]" />
                      <div>
                        <p className="text-sm text-gray-500">Ville</p>
                        <p className="font-medium">{profile?.city || 'Non renseigné'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Formation
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-[#cda86b]" />
                      <div>
                        <p className="text-sm text-gray-500">Niveau d'études</p>
                        <p className="font-medium">{profile?.class_level || 'Non renseigné'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/simulateur')}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#004235] transition-colors text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Calculateur de moyenne</h3>
            <p className="text-sm text-gray-600">Calculez votre moyenne du baccalauréat</p>
          </button>
          
          <button
            onClick={() => navigate('/platform')}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#cda86b] transition-colors text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Explorer les écoles</h3>
            <p className="text-sm text-gray-600">Rechercher des établissements adaptés</p>
          </button>

          <button
            onClick={handleLogout}
            className="p-4 bg-white rounded-lg shadow-sm border border-red-200 hover:border-red-400 hover:bg-red-50 transition-colors text-left"
          >
            <h3 className="font-semibold text-red-600 mb-1 flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </h3>
            <p className="text-sm text-red-500">Fermer votre session</p>
          </button>
        </div>
      </div>
    </div>
  );
}
