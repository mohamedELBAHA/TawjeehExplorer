import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const BAC_TYPES = [
  'Sciences Mathématiques A',
  'Sciences Mathématiques B', 
  'Sciences Physiques',
  'Sciences de la Vie et de la Terre',
  'Sciences Économiques',
  'Lettres',
  'Sciences Humaines',
  'Arts Appliqués',
  'Sciences et Technologies Électriques',
  'Sciences et Technologies Mécaniques',
  'Autre'
];

const INTEREST_AREAS = [
  'Mathématiques',
  'Physique',
  'Chimie',
  'Biologie',
  'Informatique',
  'Économie',
  'Littérature',
  'Histoire',
  'Géographie',
  'Philosophie',
  'Langues étrangères',
  'Arts',
  'Sport',
  'Sciences sociales',
  'Ingénierie',
  'Médecine',
  'Architecture',
  'Droit',
  'Communication',
  'Management'
];

interface FormData {
  bacType: string;
  generalAverage: string;
  mathGrade: string;
  scienceGrade: string;
  languageGrade: string;
  interests: string[];
  careerGoals: string;
}

export default function ProfileAcademic() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    bacType: '',
    generalAverage: '',
    mathGrade: '',
    scienceGrade: '',
    languageGrade: '',
    interests: [],
    careerGoals: '',
  });

  // Load academic data (this would come from preferences or academic_info table in real app)
  useEffect(() => {
    // For now, we'll use mock data or localStorage
    const savedData = localStorage.getItem('academic_info');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error parsing saved academic data:', error);
      }
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // For now, save to localStorage (in real app, save to Supabase)
      localStorage.setItem('academic_info', JSON.stringify(formData));
      setMessage({ type: 'success', text: 'Informations académiques mises à jour avec succès!' });
    } catch (error) {
      console.error('Error saving academic info:', error);
      setMessage({ type: 'error', text: 'Une erreur est survenue lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Formation académique</h1>
        <p className="text-gray-600">
          Renseignez vos informations académiques pour recevoir des recommandations personnalisées.
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
        {/* Bac Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du Baccalauréat</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bac Type */}
            <div>
              <label htmlFor="bacType" className="block text-sm font-medium text-gray-700 mb-2">
                Type de Bac
              </label>
              <select
                id="bacType"
                name="bacType"
                value={formData.bacType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={saving}
              >
                <option value="">Sélectionnez votre type de bac</option>
                {BAC_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* General Average */}
            <div>
              <label htmlFor="generalAverage" className="block text-sm font-medium text-gray-700 mb-2">
                Moyenne générale
              </label>
              <input
                type="number"
                id="generalAverage"
                name="generalAverage"
                value={formData.generalAverage}
                onChange={handleInputChange}
                min="0"
                max="20"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 15.75"
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Subject Grades */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notes par matière (optionnel)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="mathGrade" className="block text-sm font-medium text-gray-700 mb-2">
                Mathématiques
              </label>
              <input
                type="number"
                id="mathGrade"
                name="mathGrade"
                value={formData.mathGrade}
                onChange={handleInputChange}
                min="0"
                max="20"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Note/20"
                disabled={saving}
              />
            </div>

            <div>
              <label htmlFor="scienceGrade" className="block text-sm font-medium text-gray-700 mb-2">
                Sciences (PC/SVT)
              </label>
              <input
                type="number"
                id="scienceGrade"
                name="scienceGrade"
                value={formData.scienceGrade}
                onChange={handleInputChange}
                min="0"
                max="20"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Note/20"
                disabled={saving}
              />
            </div>

            <div>
              <label htmlFor="languageGrade" className="block text-sm font-medium text-gray-700 mb-2">
                Langues
              </label>
              <input
                type="number"
                id="languageGrade"
                name="languageGrade"
                value={formData.languageGrade}
                onChange={handleInputChange}
                min="0"
                max="20"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Note/20"
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Centres d'intérêt</h3>
          <p className="text-sm text-gray-600 mb-4">
            Sélectionnez les domaines qui vous intéressent (maximum 8)
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {INTEREST_AREAS.map(interest => (
              <label
                key={interest}
                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                  formData.interests.includes(interest)
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } ${formData.interests.length >= 8 && !formData.interests.includes(interest) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                  disabled={saving || (formData.interests.length >= 8 && !formData.interests.includes(interest))}
                />
                <span className="text-sm">{interest}</span>
              </label>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {formData.interests.length}/8 sélectionnés
          </p>
        </div>

        {/* Career Goals */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Objectifs de carrière</h3>
          
          <div>
            <label htmlFor="careerGoals" className="block text-sm font-medium text-gray-700 mb-2">
              Décrivez vos aspirations professionnelles
            </label>
            <textarea
              id="careerGoals"
              name="careerGoals"
              value={formData.careerGoals}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Je souhaite devenir ingénieur en informatique et travailler dans le développement d'applications mobiles..."
              disabled={saving}
            />
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
              'Enregistrer les informations'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
