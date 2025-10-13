import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../lib/database';
import { BellIcon, EnvelopeIcon, DevicePhoneMobileIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface NotificationSettings {
  email: {
    newRecommendations: boolean;
    deadlineReminders: boolean;
    systemUpdates: boolean;
    weeklyDigest: boolean;
  };
  push: {
    urgent: boolean;
    recommendations: boolean;
  };
  preferences: {
    frequency: 'immediate' | 'daily' | 'weekly' | 'never';
    quietHours: boolean;
    quietStart: string;
    quietEnd: string;
  };
}

const DEFAULT_SETTINGS: NotificationSettings = {
  email: {
    newRecommendations: true,
    deadlineReminders: true,
    systemUpdates: false,
    weeklyDigest: true,
  },
  push: {
    urgent: true,
    recommendations: false,
  },
  preferences: {
    frequency: 'daily',
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
  },
};

export default function ProfileNotifications() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);

  // Load notification settings
  useEffect(() => {
    const loadSettings = async () => {
      if (!profile?.id) return;
      
      setLoading(true);
      try {
        // For now, we'll store notification settings as JSON in the profile
        // In a real app, you might want a separate notifications table
        const savedSettings = localStorage.getItem(`notifications_${profile.id}`);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [profile]);

  const handleEmailToggle = (key: keyof NotificationSettings['email']) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: !prev.email[key]
      }
    }));
  };

  const handlePushToggle = (key: keyof NotificationSettings['push']) => {
    setSettings(prev => ({
      ...prev,
      push: {
        ...prev.push,
        [key]: !prev.push[key]
      }
    }));
  };

  const handlePreferenceChange = (key: keyof NotificationSettings['preferences'], value: any) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Save to localStorage for now
      // In production, save to Supabase profile or notifications table
      localStorage.setItem(`notifications_${profile?.id}`, JSON.stringify(settings));
      setMessage({ type: 'success', text: 'Paramètres de notification mis à jour avec succès!' });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setMessage({ type: 'error', text: 'Une erreur est survenue lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-gray-600">Chargement des paramètres...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">
          Gérez vos préférences de notification pour rester informé selon vos besoins.
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Email Notifications */}
        <div>
          <div className="flex items-center mb-4">
            <EnvelopeIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Notifications par email</h3>
          </div>
          
          <div className="space-y-4 ml-8">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-900">Nouvelles recommandations</span>
                <p className="text-sm text-gray-600">Recevez un email quand de nouvelles écoles correspondent à vos critères</p>
              </div>
              <input
                type="checkbox"
                checked={settings.email.newRecommendations}
                onChange={() => handleEmailToggle('newRecommendations')}
                disabled={saving}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-900">Rappels de dates limites</span>
                <p className="text-sm text-gray-600">Alertes pour les dates importantes d'inscription</p>
              </div>
              <input
                type="checkbox"
                checked={settings.email.deadlineReminders}
                onChange={() => handleEmailToggle('deadlineReminders')}
                disabled={saving}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-900">Mises à jour du système</span>
                <p className="text-sm text-gray-600">Nouvelles fonctionnalités et améliorations</p>
              </div>
              <input
                type="checkbox"
                checked={settings.email.systemUpdates}
                onChange={() => handleEmailToggle('systemUpdates')}
                disabled={saving}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-900">Résumé hebdomadaire</span>
                <p className="text-sm text-gray-600">Un email récapitulatif chaque semaine</p>
              </div>
              <input
                type="checkbox"
                checked={settings.email.weeklyDigest}
                onChange={() => handleEmailToggle('weeklyDigest')}
                disabled={saving}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <div className="flex items-center mb-4">
            <DevicePhoneMobileIcon className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Notifications push</h3>
          </div>
          
          <div className="space-y-4 ml-8">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-900">Notifications urgentes</span>
                <p className="text-sm text-gray-600">Dates limites imminentes et alertes importantes</p>
              </div>
              <input
                type="checkbox"
                checked={settings.push.urgent}
                onChange={() => handlePushToggle('urgent')}
                disabled={saving}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-900">Nouvelles recommandations</span>
                <p className="text-sm text-gray-600">Notifications pour les nouvelles écoles suggérées</p>
              </div>
              <input
                type="checkbox"
                checked={settings.push.recommendations}
                onChange={() => handlePushToggle('recommendations')}
                disabled={saving}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <div className="flex items-center mb-4">
            <BellIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Préférences</h3>
          </div>
          
          <div className="space-y-6 ml-8">
            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fréquence des notifications
              </label>
              <select
                value={settings.preferences.frequency}
                onChange={(e) => handlePreferenceChange('frequency', e.target.value)}
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="immediate">Immédiate</option>
                <option value="daily">Quotidienne (résumé)</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="never">Jamais</option>
              </select>
            </div>

            {/* Quiet Hours */}
            <div>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={settings.preferences.quietHours}
                  onChange={(e) => handlePreferenceChange('quietHours', e.target.checked)}
                  disabled={saving}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Activer les heures silencieuses
                </span>
              </label>

              {settings.preferences.quietHours && (
                <div className="grid grid-cols-2 gap-4 ml-7">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Début
                    </label>
                    <input
                      type="time"
                      value={settings.preferences.quietStart}
                      onChange={(e) => handlePreferenceChange('quietStart', e.target.value)}
                      disabled={saving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fin
                    </label>
                    <input
                      type="time"
                      value={settings.preferences.quietEnd}
                      onChange={(e) => handlePreferenceChange('quietEnd', e.target.value)}
                      disabled={saving}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Notification */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <GlobeAltIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <h4 className="font-medium text-blue-900">Test de notification</h4>
              <p className="text-sm text-blue-700">
                Envoyez-vous une notification de test pour vérifier vos paramètres
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMessage({ type: 'success', text: 'Notification de test envoyée!' })}
            className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Envoyer un test
          </button>
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
              'Enregistrer les paramètres'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
