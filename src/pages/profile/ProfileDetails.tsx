import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../lib/database';
import type { ClassLevel } from '../../types/database';

const MOROCCO_CITIES = [
  'Casablanca',
  'Rabat',
  'Fès',
  'Marrakech',
  'Agadir',
  'Tanger',
  'Oujda',
  'Kenitra',
  'Tétouan',
  'Safi',
  'Salé',
  'Meknès',
  'El Jadida',
  'Mohammedia',
  'Nador',
  'Laâyoune',
  'Dakhla',
  'Taroudant',
  'Taza',
  'Beni Mellal',
  'Khouribga',
  'Settat',
  'Berkane',
  'Al Hoceima',
  'Ouarzazate'
].sort();

const CLASS_LEVELS: { value: ClassLevel; label: string }[] = [
  { value: '5ème', label: '5ème' },
  { value: '6ème', label: '6ème' },
  { value: 'Bac', label: 'Bac' },
  { value: 'Bac+', label: 'Bac+' },
];

interface FormData {
  firstName: string;
  lastName: string;
  city: string;
  classLevel: ClassLevel | '';
}

export default function ProfileDetails() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    city: '',
    classLevel: '',
  });

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        city: profile.city || '',
        classLevel: profile.class_level || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const updateData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        city: formData.city,
        class_level: formData.classLevel as ClassLevel,
      };

      const updatedProfile = await profileService.updateProfile(updateData);
      
      if (updatedProfile) {
        await refreshProfile();
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Une erreur est survenue lors de la mise à jour' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Informations personnelles</h1>
        <p className="text-gray-600">
          Modifiez vos informations personnelles de base.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre prénom"
              disabled={saving}
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre nom"
              disabled={saving}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              Ville *
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={saving}
            >
              <option value="">Sélectionnez votre ville</option>
              {MOROCCO_CITIES.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Class Level */}
          <div>
            <label htmlFor="classLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de classe *
            </label>
            <select
              id="classLevel"
              name="classLevel"
              value={formData.classLevel}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={saving}
            >
              <option value="">Sélectionnez votre niveau</option>
              {CLASS_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Account Information (Read-only) */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du compte</h3>
          <div className="bg-gray-50 rounded-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900">{profile?.id || 'Non disponible'}</p>
                <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Plan
                </label>
                <p className={`text-sm font-medium ${
                  profile?.plan === 'premium' ? 'text-blue-600' : 
                  profile?.plan === 'enterprise' ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {profile?.plan || 'free'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              saving
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Enregistrement...
              </div>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
