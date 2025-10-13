import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { preferencesService } from '../../lib/database';

const MOROCCO_CITIES = [
  'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Agadir', 'Tanger', 'Oujda', 
  'Kenitra', 'Tétouan', 'Safi', 'Salé', 'Meknès', 'El Jadida', 'Mohammedia', 
  'Nador', 'Laâyoune', 'Dakhla', 'Taroudant', 'Taza', 'Beni Mellal', 
  'Khouribga', 'Settat', 'Berkane', 'Al Hoceima', 'Ouarzazate'
].sort();

const STUDY_FIELDS = [
  'Ingénierie Informatique',
  'Ingénierie Électrique',
  'Ingénierie Mécanique',
  'Ingénierie Civile',
  'Médecine',
  'Pharmacie',
  'Dentaire',
  'Sciences Économiques',
  'Management',
  'Commerce International',
  'Droit',
  'Littérature',
  'Langues Étrangères',
  'Sciences Politiques',
  'Architecture',
  'Arts et Design',
  'Communication',
  'Journalisme',
  'Tourisme',
  'Agriculture',
  'Environnement',
  'Psychologie',
  'Sociologie',
  'Éducation'
];

const HOBBIES = [
  'Sport', 'Lecture', 'Musique', 'Cinéma', 'Voyage', 'Photographie', 
  'Cuisine', 'Jardinage', 'Technologie', 'Gaming', 'Art', 'Danse',
  'Théâtre', 'Écriture', 'Randonnée', 'Natation', 'Football', 'Basketball',
  'Volleyball', 'Tennis', 'Cyclisme', 'Course à pied'
];

interface FormData {
  preferredCities: string[];
  preferredFields: string[];
  nearOcean: boolean;
  needsHousing: boolean;
  needsScholarship: boolean;
  hobbies: string[];
  additionalNotes: string;
}

export default function ProfilePreferences() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    preferredCities: [],
    preferredFields: [],
    nearOcean: false,
    needsHousing: false,
    needsScholarship: false,
    hobbies: [],
    additionalNotes: '',
  });

  // Load preferences data
  useEffect(() => {
    const loadPreferences = async () => {
      if (!profile?.id) return;
      
      setLoading(true);
      try {
        const preferences = await preferencesService.getPreferences();
        if (preferences) {
          setFormData({
            preferredCities: preferences.preferred_cities || [],
            preferredFields: preferences.preferred_fields || [],
            nearOcean: preferences.near_ocean || false,
            needsHousing: preferences.needs_housing || false,
            needsScholarship: preferences.needs_scholarship || false,
            hobbies: preferences.hobbies || [],
            additionalNotes: preferences.additional_notes || '',
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [profile]);

  const handleCityToggle = (city: string) => {
    setFormData(prev => ({
      ...prev,
      preferredCities: prev.preferredCities.includes(city)
        ? prev.preferredCities.filter(c => c !== city)
        : [...prev.preferredCities, city]
    }));
  };

  const handleFieldToggle = (field: string) => {
    setFormData(prev => ({
      ...prev,
      preferredFields: prev.preferredFields.includes(field)
        ? prev.preferredFields.filter(f => f !== field)
        : [...prev.preferredFields, field]
    }));
  };

  const handleHobbyToggle = (hobby: string) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby]
    }));
  };

  const handleCheckboxChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.target.checked
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      additionalNotes: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const preferencesData = {
        preferred_cities: formData.preferredCities,
        preferred_fields: formData.preferredFields,
        near_ocean: formData.nearOcean,
        needs_housing: formData.needsHousing,
        needs_scholarship: formData.needsScholarship,
        hobbies: formData.hobbies,
        additional_notes: formData.additionalNotes,
      };

      const result = await preferencesService.upsertPreferences(preferencesData);
      
      if (result) {
        setMessage({ type: 'success', text: 'Préférences mises à jour avec succès!' });
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la mise à jour des préférences' });
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
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
          <span className="text-gray-600">Chargement des préférences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes préférences</h1>
        <p className="text-gray-600">
          Définissez vos préférences pour recevoir des recommandations personnalisées.
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
        {/* Preferred Cities */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Villes préférées</h3>
          <p className="text-sm text-gray-600 mb-4">
            Sélectionnez les villes où vous aimeriez étudier (maximum 5)
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MOROCCO_CITIES.map(city => (
              <label
                key={city}
                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                  formData.preferredCities.includes(city)
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } ${formData.preferredCities.length >= 5 && !formData.preferredCities.includes(city) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.preferredCities.includes(city)}
                  onChange={() => handleCityToggle(city)}
                  disabled={saving || (formData.preferredCities.length >= 5 && !formData.preferredCities.includes(city))}
                />
                <span className="text-sm">{city}</span>
              </label>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {formData.preferredCities.length}/5 sélectionnées
          </p>
        </div>

        {/* Preferred Fields */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filières préférées</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choisissez les domaines d'études qui vous intéressent (maximum 6)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STUDY_FIELDS.map(field => (
              <label
                key={field}
                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                  formData.preferredFields.includes(field)
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } ${formData.preferredFields.length >= 6 && !formData.preferredFields.includes(field) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.preferredFields.includes(field)}
                  onChange={() => handleFieldToggle(field)}
                  disabled={saving || (formData.preferredFields.length >= 6 && !formData.preferredFields.includes(field))}
                />
                <span className="text-sm">{field}</span>
              </label>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {formData.preferredFields.length}/6 sélectionnées
          </p>
        </div>

        {/* Special Requirements */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Besoins spécifiques</h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.nearOcean}
                onChange={handleCheckboxChange('nearOcean')}
                disabled={saving}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-900">
                Préférence pour les villes côtières (près de l'océan)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.needsHousing}
                onChange={handleCheckboxChange('needsHousing')}
                disabled={saving}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-900">
                J'ai besoin d'un logement étudiant
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.needsScholarship}
                onChange={handleCheckboxChange('needsScholarship')}
                disabled={saving}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-900">
                Je recherche des bourses d'études
              </span>
            </label>
          </div>
        </div>

        {/* Hobbies */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Loisirs et activités</h3>
          <p className="text-sm text-gray-600 mb-4">
            Sélectionnez vos activités préférées (optionnel)
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HOBBIES.map(hobby => (
              <label
                key={hobby}
                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                  formData.hobbies.includes(hobby)
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.hobbies.includes(hobby)}
                  onChange={() => handleHobbyToggle(hobby)}
                  disabled={saving}
                />
                <span className="text-sm">{hobby}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notes additionnelles</h3>
          
          <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Informations complémentaires
            </label>
            <textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleTextareaChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ajoutez toute information qui pourrait nous aider à mieux vous conseiller..."
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
              'Enregistrer les préférences'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
