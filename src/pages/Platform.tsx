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

// Morocco GeoJSON polygon (simplified)
const moroccoGeoJson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-13.17, 35.92],
          [-13.17, 27.66],
          [-1.02, 27.66],
          [-1.02, 35.92],
          [-13.17, 35.92]
        ]]
      }
    }
  ]
};
const moroccoBounds: LatLngExpression[] = [
  [27.66, -13.17], // SW
  [35.92, -1.02]   // NE
];

const Platform: React.FC = () => {
  const [selectedFiliere, setSelectedFiliere] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedBacType, setSelectedBacType] = useState<string>('');
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<string>('');
  const [seuilValue, setSeuilValue] = useState(SEUIL_MIN);
  const [expandedSchools, setExpandedSchools] = useState<Set<number>>(new Set());

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
      // If seuilEntree is 'NA', always include the school in the results
      const seuilMatch = school.seuilEntree === 'NA' || school.seuilEntree >= seuilValue;
      return filiereMatch && cityMatch && bacTypeMatch && institutionTypeMatch && seuilMatch;
    });
  }, [selectedFiliere, selectedCity, selectedBacType, selectedInstitutionType, seuilValue]);

  // Handle school expansion
  const toggleSchoolExpansion = (schoolId: number) => {
    const newExpandedSchools = new Set(expandedSchools);
    if (newExpandedSchools.has(schoolId)) {
      newExpandedSchools.delete(schoolId);
    } else {
      newExpandedSchools.add(schoolId);
    }
    setExpandedSchools(newExpandedSchools);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#004235]">Tawjeeh Navigator</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-[#004235] transition-colors">Accueil</a>
              <a href="/platform" className="text-[#004235] font-medium">Plateforme</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Filtres</h2>
              <div className="space-y-6">
                {/* Filiere Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filière
                  </label>
                  <select 
                    value={selectedFiliere} 
                    onChange={(e) => setSelectedFiliere(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                  >
                    <option value="">Toutes les filières</option>
                    {uniqueFilieres.map(filiere => (
                      <option key={filiere} value={filiere}>{filiere}</option>
                    ))}
                  </select>
                </div>
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                  >
                    <option value="">Toutes les villes</option>
                    {uniqueCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                {/* Type de Bac Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de Bac
                  </label>
                  <select 
                    value={selectedBacType} 
                    onChange={(e) => setSelectedBacType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                  >
                    <option value="">Tous les types</option>
                    {uniqueBacTypes.map(bacType => (
                      <option key={bacType} value={bacType}>{bacType}</option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    Filtrez selon votre type de baccalauréat
                  </div>
                </div>
                {/* Institution Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'établissement
                  </label>
                  <select 
                    value={selectedInstitutionType} 
                    onChange={(e) => setSelectedInstitutionType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004235] focus:border-[#004235]"
                  >
                    <option value="">Tous les types</option>
                    {uniqueInstitutionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {/* Seuil Filter - Minimalist single-handle slider, black/white */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Seuil d'entrée minimum: <span className="font-bold text-black">{seuilValue}/20</span>
                  </label>
                  <div className="text-xs text-gray-500 mb-3">
                    Affichez les écoles accessibles avec votre moyenne au bac
                  </div>
                  <div className="flex items-center gap-3 px-2 py-4">
                    <span className="text-xs text-gray-500">{SEUIL_MIN}</span>
                    <input
                      type="range"
                      min={SEUIL_MIN}
                      max={SEUIL_MAX}
                      step={SEUIL_STEP}
                      value={seuilValue}
                      onChange={e => setSeuilValue(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none bg-black"
                      style={{ accentColor: '#000' }}
                    />
                    <span className="text-xs text-gray-500">{SEUIL_MAX}</span>
                  </div>
                </div>
                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedFiliere('');
                    setSelectedCity('');
                    setSelectedBacType('');
                    setSelectedInstitutionType('');
                    setSeuilValue(SEUIL_MIN);
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Main Content: Map and List side-by-side on large screens */}
          <div className="lg:col-span-3 flex flex-col lg:flex-row gap-8">
            {/* Map Container */}
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Carte des établissements</h2>
              <div className="w-full h-[36rem] rounded-lg overflow-hidden mb-6">
                {/* @ts-ignore: react-leaflet expects LatLngExpression for center */}
                <MapContainer
                  center={[31.7917, -7.0926] as LatLngExpression}
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
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
            {/* Schools Grid */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Écoles et Formations ({filteredSchools.length})
                </h2>
                <p className="text-gray-600">
                  Comparez les établissements par seuil d'entrée et trouvez celui qui correspond à votre niveau
                </p>
              </div>
              {filteredSchools.map((school: School) => {
                const isExpanded = expandedSchools.has(school.id);
                return (
                  <div key={school.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{school.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="px-2 py-1 rounded border border-gray-300 bg-gray-50 text-gray-700 font-medium">
                              {school.type}
                            </span>
                            <span>{school.city}</span>
                            <span>{school.students} étudiants</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#cda86b]">
                            {school.seuilEntree}/20
                          </div>
                          <div className="text-xs text-gray-500">Seuil d'entrée</div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{school.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Spécialités</h4>
                          <div className="flex flex-wrap gap-1">
                            {school.specialties.slice(0, 3).map((specialty, index) => (
                              <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Statistiques</h4>
                          <div className="text-sm text-gray-600">
                            <div>Taux de réussite: {school.successRate}%</div>
                            <div>Employabilité: {school.employmentRate}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contact Information */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div>📞 {school.phone}</div>
                                <div>📧 {school.email}</div>
                                <div>🌐 {school.website}</div>
                                <div>📍 {school.city}</div>
                              </div>
                            </div>

                            {/* Programs & Facilities */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Programmes & Infrastructures</h4>
                              <div className="space-y-3">
                                <div>
                                  <h5 className="font-medium text-gray-800 text-sm">Programmes:</h5>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {school.programs.slice(0, 4).map((program, index) => (
                                      <span key={index} className="bg-[#cda86b] text-[#004235] text-xs px-2 py-1 rounded">
                                        {program}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-800 text-sm">Infrastructures:</h5>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {school.facilities.slice(0, 4).map((facility, index) => (
                                      <span key={index} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                                        {facility}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Additional Info */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Informations Académiques</h4>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div>Types de Bac acceptés:</div>
                                <div className="flex flex-wrap gap-1">
                                  {school.bacTypes.map((bacType, index) => (
                                    <span key={index} className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded">
                                      {bacType}
                                    </span>
                                  ))}
                                </div>
                                <div className="mt-3">
                                  <div>Filière: <span className="font-medium">{school.filiere}</span></div>
                                  <div>Salaire moyen: <span className="font-medium">{school.averageSalary.toLocaleString()} MAD</span></div>
                                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                                    💡 <strong>Seuil d'entrée:</strong> Note minimum requise au baccalauréat pour accéder à cet établissement
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Partnerships */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Partenariats & Recherche</h4>
                              <div className="space-y-3">
                                <div>
                                  <h5 className="font-medium text-gray-800 text-sm">Partenariats:</h5>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {school.partnerships.slice(0, 3).map((partnership, index) => (
                                      <span key={index} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">
                                        {partnership}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-800 text-sm">Domaines de recherche:</h5>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {school.researchAreas.slice(0, 3).map((area, index) => (
                                      <span key={index} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded">
                                        {area}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          Fondée en {school.founded}
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              toggleSchoolExpansion(school.id);
                            }}
                            className="bg-[#004235] text-white px-4 py-2 rounded hover:bg-[#cda86b] hover:text-white transition-colors"
                          >
                            {isExpanded ? 'Moins d\'infos' : 'Plus d\'infos'}
                          </button>
                          <button 
                            onClick={() => {
                              alert(`Contacter ${school.name}\n\nTéléphone: ${school.phone}\nEmail: ${school.email}\nSite web: ${school.website}`);
                            }}
                            className="border border-[#004235] text-[#004235] px-4 py-2 rounded hover:bg-[#cda86b] hover:text-white transition-colors"
                          >
                            Contacter
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

      {/* Chatbot Floating Button - render outside main content for proper z-index */}
      <div id="afaqi-chatbot-widget-root" style={{ position: 'fixed', zIndex: 9999, bottom: 24, right: 24, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <ChatbotWidget />
        </div>
      </div>
    </div>
  );
};

export default Platform;