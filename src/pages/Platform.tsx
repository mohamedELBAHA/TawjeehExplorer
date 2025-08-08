import React, { useState, useMemo } from 'react';
import { schoolsData, School } from '../data/schools';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Range } from 'react-range';
import type { LatLngExpression } from 'leaflet';
import ChatbotWidget from '../components/ChatbotWidget';

const SEUIL_MIN = 10;
const SEUIL_MAX = 20;
const SEUIL_STEP = 0.5;

const Platform: React.FC = () => {
  const [selectedFiliere, setSelectedFiliere] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedBacType, setSelectedBacType] = useState<string>('');
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<string>('');
  const [seuilValue, setSeuilValue] = useState(SEUIL_MIN);
  const [expandedSchools, setExpandedSchools] = useState<Set<number>>(new Set());
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [selectedPublicPrivate, setSelectedPublicPrivate] = useState<string>('');
  const [selectedConcoursType, setSelectedConcoursType] = useState<string>('');
  const [selectedAdmissionType, setSelectedAdmissionType] = useState<string>('');

  // Get unique values for filters
  const uniqueFilieres = Array.from(new Set(schoolsData.map(school => school.filiere)));
  const uniqueCities = Array.from(new Set(schoolsData.map(school => school.city)));
  const uniqueBacTypes = Array.from(new Set(schoolsData.flatMap(school => school.bacTypes)));
  const uniqueInstitutionTypes = Array.from(new Set(schoolsData.map(school => school.type)));

  // Filter schools based on selected criteria
  const filteredSchools = useMemo(() => {
    return schoolsData.filter(school => {
      const filiereMatch = !selectedFiliere || school.filiere === selectedFiliere;
      const cityMatch = !selectedCity || school.city === selectedCity;
      const bacTypeMatch = !selectedBacType || school.bacTypes.includes(selectedBacType);
      const institutionTypeMatch = !selectedInstitutionType || school.type === selectedInstitutionType;
      const seuilMatch = school.seuilEntree === 'NA' || school.seuilEntree >= seuilValue;
      
      // Advanced filters
      const publicPrivateMatch = !selectedPublicPrivate || 
        (selectedPublicPrivate === 'public' && school.isPublic) ||
        (selectedPublicPrivate === 'private' && !school.isPublic);
      
      const concoursMatch = !selectedConcoursType ||
        (selectedConcoursType === 'with-concours' && school.requiresConcours) ||
        (selectedConcoursType === 'without-concours' && !school.requiresConcours);
        
      const admissionTypeMatch = !selectedAdmissionType || school.admissionType === selectedAdmissionType;

      return filiereMatch && cityMatch && bacTypeMatch && institutionTypeMatch && seuilMatch && 
             publicPrivateMatch && concoursMatch && admissionTypeMatch;
    });
  }, [selectedFiliere, selectedCity, selectedBacType, selectedInstitutionType, seuilValue, 
      selectedPublicPrivate, selectedConcoursType, selectedAdmissionType]);

  const toggleSchoolExpansion = (schoolId: number) => {
    const newExpandedSchools = new Set(expandedSchools);
    if (newExpandedSchools.has(schoolId)) {
      newExpandedSchools.delete(schoolId);
    } else {
      newExpandedSchools.add(schoolId);
    }
    setExpandedSchools(newExpandedSchools);
  };

  const clearAllFilters = () => {
    setSelectedFiliere('');
    setSelectedCity('');
    setSelectedBacType('');
    setSelectedInstitutionType('');
    setSeuilValue(SEUIL_MIN);
    setSelectedPublicPrivate('');
    setSelectedConcoursType('');
    setSelectedAdmissionType('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#004235] shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Tawjeeh Navigator</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-200 hover:text-[#cda86b] transition-colors">Accueil</a>
              <a href="/platform" className="text-[#cda86b] font-medium">Plateforme</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Horizontal Filter Bar */}
      <div className="bg-gray-100 border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="space-y-4">
            {/* Basic Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Filiere Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Filière</label>
                <select 
                  value={selectedFiliere} 
                  onChange={(e) => setSelectedFiliere(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                >
                  <option value="">Toutes les filières</option>
                  {uniqueFilieres.map(filiere => (
                    <option key={filiere} value={filiere}>{filiere}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ville</label>
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                >
                  <option value="">Toutes les villes</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Bac Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type de Bac</label>
                <select 
                  value={selectedBacType} 
                  onChange={(e) => setSelectedBacType(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                >
                  <option value="">Tous les types</option>
                  {uniqueBacTypes.map(bacType => (
                    <option key={bacType} value={bacType}>
                      {bacType.length > 20 ? bacType.substring(0, 20) + '...' : bacType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Institution Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type d'établissement</label>
                <select 
                  value={selectedInstitutionType} 
                  onChange={(e) => setSelectedInstitutionType(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                >
                  <option value="">Tous les types</option>
                  {uniqueInstitutionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Seuil Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Seuil: <span className="font-bold">{seuilValue}/20</span>
                </label>
                <input
                  type="range"
                  min={SEUIL_MIN}
                  max={SEUIL_MAX}
                  step={SEUIL_STEP}
                  value={seuilValue}
                  onChange={e => setSeuilValue(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-gray-200"
                  style={{ accentColor: '#004235' }}
                />
              </div>
            </div>

            {/* Advanced Filters and Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors border border-gray-300"
              >
                <span>🔧 Filtres Avancés</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {filteredSchools.length} écoles trouvées
                </span>
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-2 text-sm bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors border border-gray-300"
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            {/* Advanced Filters Content */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
                {/* Public/Private Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Secteur</label>
                  <select 
                    value={selectedPublicPrivate} 
                    onChange={(e) => setSelectedPublicPrivate(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                  >
                    <option value="">Public et Privé</option>
                    <option value="public">🏛️ Public uniquement</option>
                    <option value="private">🏢 Privé uniquement</option>
                  </select>
                </div>

                {/* Concours Requirement Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mode d'admission</label>
                  <select 
                    value={selectedConcoursType} 
                    onChange={(e) => setSelectedConcoursType(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                  >
                    <option value="">Tous les modes</option>
                    <option value="with-concours">📝 Avec concours</option>
                    <option value="without-concours">✅ Sans concours</option>
                  </select>
                </div>

                {/* Admission Type Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type d'admission</label>
                  <select 
                    value={selectedAdmissionType} 
                    onChange={(e) => setSelectedAdmissionType(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                  >
                    <option value="">Tous les types</option>
                    <option value="Concours">🏆 Concours</option>
                    <option value="Preselection">📋 Présélection</option>
                    <option value="Combined">🔄 Mixte</option>
                    <option value="Direct">⚡ Accès direct</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: 2-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)]">
          {/* Left Column: Map */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Carte des établissements</h2>
            </div>
            <div className="h-full">
              <MapContainer
                center={[31.7917, -7.0926] as LatLngExpression}
                zoom={6}
                style={{ height: 'calc(100% - 60px)', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredSchools.map((school) => (
                  <Marker key={school.id} position={school.coordinates as LatLngExpression}>
                    <Popup>
                      <div className="font-semibold">{school.name}</div>
                      <div className="text-xs text-gray-600">{school.city}</div>
                      <div className="text-xs text-[#cda86b] font-bold mt-1">Seuil: {school.seuilEntree}/20</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Right Column: School Cards */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Écoles et Formations ({filteredSchools.length})
              </h2>
            </div>
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {filteredSchools.map((school: School) => {
                const isExpanded = expandedSchools.has(school.id);
                return (
                  <div key={school.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{school.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                              {school.type}
                            </span>
                            <span>{school.city}</span>
                            <span>{school.students} étudiants</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-[#cda86b]">
                            {school.seuilEntree}/20
                          </div>
                          <div className="text-xs text-gray-500">Seuil d'entrée</div>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{school.description}</p>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1 text-sm">Spécialités</h4>
                          <div className="flex flex-wrap gap-1">
                            {school.specialties.slice(0, 2).map((specialty, index) => (
                              <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1 text-sm">Statistiques</h4>
                          <div className="text-xs text-gray-600">
                            <div>Réussite: {school.successRate}%</div>
                            <div>Emploi: {school.employmentRate}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-1 gap-4 text-sm">
                            {/* Contact Information */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                              <div className="space-y-1 text-xs text-gray-600">
                                <div>📞 {school.phone}</div>
                                <div>📧 {school.email}</div>
                                <div>🌐 {school.website}</div>
                              </div>
                            </div>

                            {/* Academic Info */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Informations Académiques</h4>
                              <div className="space-y-2 text-xs text-gray-600">
                                <div>
                                  <span className="font-medium">Types de Bac:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {school.bacTypes.slice(0, 3).map((bacType, index) => (
                                      <span key={index} className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded">
                                        {bacType.length > 15 ? bacType.substring(0, 15) + '...' : bacType}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>Filière: <span className="font-medium">{school.filiere}</span></div>
                                <div>Salaire moyen: <span className="font-medium">{school.averageSalary?.toLocaleString()} MAD</span></div>
                              </div>
                            </div>

                            {/* Programs */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Programmes</h4>
                              <div className="flex flex-wrap gap-1">
                                {school.programs.slice(0, 3).map((program, index) => (
                                  <span key={index} className="bg-[#cda86b] text-[#004235] text-xs px-2 py-1 rounded">
                                    {program}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-3 border-t mt-3">
                        <div className="text-xs text-gray-600">
                          Fondée en {school.founded}
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => toggleSchoolExpansion(school.id)}
                            className="bg-[#004235] text-white px-3 py-1 text-xs rounded hover:bg-[#cda86b] transition-colors"
                          >
                            {isExpanded ? 'Moins' : 'Plus'}
                          </button>
                          <button 
                            onClick={() => {
                              alert(`Contacter ${school.name}\n\nTéléphone: ${school.phone}\nEmail: ${school.email}`);
                            }}
                            className="border border-[#004235] text-[#004235] px-3 py-1 text-xs rounded hover:bg-[#cda86b] hover:text-white transition-colors"
                          >
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredSchools.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">Aucune école trouvée</div>
                  <div className="text-gray-600">Essayez de modifier vos critères de recherche</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Floating Button */}
      <div id="afaqi-chatbot-widget-root" style={{ position: 'fixed', zIndex: 9999, bottom: 24, right: 24, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <ChatbotWidget />
        </div>
      </div>
    </div>
  );
};

export default Platform;