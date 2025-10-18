import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { schoolsData, School } from '../data/schools';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Range } from 'react-range';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import ChatbotWidget from '../components/ChatbotWidget';
import PlatformHeader from '../components/PlatformHeader';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { UserCircleIcon } from '@heroicons/react/24/outline';

// Fix for default markers not showing in production
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom school marker icon
const createSchoolIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #004235;
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        border: 2px solid #cda86b;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <div style="
          color: white;
          font-size: 12px;
          font-weight: bold;
          transform: rotate(45deg);
        ">🎓</div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

const SEUIL_MIN = 10;
const SEUIL_MAX = 20;
const SEUIL_STEP = 0.5;

const Platform: React.FC = () => {
  const { user } = useAuth();
  const [selectedFiliere, setSelectedFiliere] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedBacType, setSelectedBacType] = useState<string>('');
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<string>('');
  const [seuilValue, setSeuilValue] = useState(SEUIL_MIN);
  const [expandedSchools, setExpandedSchools] = useState<Set<number>>(new Set());
  const [highlightedSchoolId, setHighlightedSchoolId] = useState<number | null>(null);
  const [showMatcherNotification, setShowMatcherNotification] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Advanced filters state
  const [selectedPublicPrivate, setSelectedPublicPrivate] = useState<string>('');
  const [selectedConcoursType, setSelectedConcoursType] = useState<string>('');
  const [selectedAdmissionType, setSelectedAdmissionType] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');

  // Get unique values for filters
  const uniqueFilieres = Array.from(new Set(schoolsData.map(school => school.filiere)));
  const uniqueCities = Array.from(new Set(schoolsData.map(school => school.city)));
  const uniqueBacTypes = Array.from(new Set(schoolsData.flatMap(school => school.bacTypes)));
  const uniqueInstitutionTypes = Array.from(new Set(schoolsData.map(school => school.type)));

  // Get unique specialties for Engineering schools when "Ingénierie" is selected
  const availableSpecialties = useMemo(() => {
    if (selectedFiliere === 'Ingénierie') {
      const engineeringSchools = schoolsData.filter(school => school.filiere === 'Ingénierie');
      const allSpecialties = engineeringSchools.flatMap(school => school.specialties);
      return Array.from(new Set(allSpecialties)).sort();
    }
    return [];
  }, [selectedFiliere]);

  // Reset specialty filter when filière changes
  useEffect(() => {
    setSelectedSpecialty('');
  }, [selectedFiliere]);

  // Filter schools based on selected criteria
  const filteredSchools = useMemo(() => {
    return schoolsData.filter(school => {
      const filiereMatch = !selectedFiliere || school.filiere === selectedFiliere;
      const cityMatch = !selectedCity || school.city === selectedCity;
      const bacTypeMatch = !selectedBacType || school.bacTypes.includes(selectedBacType);
      const institutionTypeMatch = !selectedInstitutionType || school.type === selectedInstitutionType;
      const seuilMatch = school.seuilEntree === 'NA' || 
        (typeof school.seuilEntree === 'number' && school.seuilEntree >= seuilValue) ||
        (typeof school.seuilEntree === 'object' && school.seuilEntree !== null && 
         Object.values(school.seuilEntree).some(seuil => seuil >= seuilValue));
      
      // Advanced filters
      const publicPrivateMatch = !selectedPublicPrivate || 
        (selectedPublicPrivate === 'public' && school.isPublic) ||
        (selectedPublicPrivate === 'private' && !school.isPublic);
      
      const concoursMatch = !selectedConcoursType ||
        (selectedConcoursType === 'with-concours' && school.requiresConcours) ||
        (selectedConcoursType === 'without-concours' && !school.requiresConcours);
        
      const admissionTypeMatch = !selectedAdmissionType || school.admissionType === selectedAdmissionType;
      
      // Specialty filter (only for Engineering schools)
      const specialtyMatch = !selectedSpecialty || school.specialties.includes(selectedSpecialty);

      return filiereMatch && cityMatch && bacTypeMatch && institutionTypeMatch && seuilMatch && 
             publicPrivateMatch && concoursMatch && admissionTypeMatch && specialtyMatch;
    });
  }, [selectedFiliere, selectedCity, selectedBacType, selectedInstitutionType, seuilValue, 
      selectedPublicPrivate, selectedConcoursType, selectedAdmissionType, selectedSpecialty]);

  const toggleSchoolExpansion = (schoolId: number) => {
    const newExpandedSchools = new Set(expandedSchools);
    if (newExpandedSchools.has(schoolId)) {
      newExpandedSchools.delete(schoolId);
    } else {
      newExpandedSchools.add(schoolId);
    }
    setExpandedSchools(newExpandedSchools);
  };

  const handleMarkerClick = (schoolId: number) => {
    // Highlight the school card
    setHighlightedSchoolId(schoolId);
    
    // Scroll to the school card
    setTimeout(() => {
      const schoolElement = document.getElementById(`school-card-${schoolId}`);
      if (schoolElement) {
        schoolElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);

    // Remove highlight after 3 seconds
    setTimeout(() => {
      setHighlightedSchoolId(null);
    }, 3000);
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
    setSelectedSpecialty('');
    setHighlightedSchoolId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformHeader 
        showNotificationBanner={showMatcherNotification}
        onDismissNotification={() => setShowMatcherNotification(false)}
        customNotificationContent={
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth={2}/>
                <circle cx="12" cy="12" r="6" strokeWidth={2}/>
                <circle cx="12" cy="12" r="2" strokeWidth={2}/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                🎯 <span className="font-bold">Astuce :</span> Pas envie de filtrer manuellement ? 
                <span className="ml-1 underline cursor-pointer hover:text-yellow-200 transition-colors"
                      onClick={() => {
                        // Click the floating matcher button
                        const matcherButton = document.querySelector('[aria-label="Ouvrir l\'assistant d\'orientation"]') as HTMLButtonElement;
                        if (matcherButton) {
                          matcherButton.click();
                        }
                      }}>
                  Utilisez notre assistant intelligent
                </span> 
                <span className="ml-1">pour trouver vos écoles idéales en quelques questions !</span>
              </p>
            </div>
          </div>
        }
      />

      {/* Clean Filter Panel */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Primary Filters Row */}
          <div className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Type de Bac */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de Bac</label>
                <select 
                  value={selectedBacType} 
                  onChange={(e) => setSelectedBacType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235] bg-white font-medium shadow-sm"
                >
                  <option value="">Sélectionnez votre Bac</option>
                  {uniqueBacTypes.map(bacType => (
                    <option key={bacType} value={bacType}>
                      {bacType.length > 30 ? bacType.substring(0, 30) + '...' : bacType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type d'établissement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'établissement</label>
                <select 
                  value={selectedInstitutionType} 
                  onChange={(e) => setSelectedInstitutionType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235] bg-white font-medium shadow-sm"
                >
                  <option value="">Tous types</option>
                  {uniqueInstitutionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Filière */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filière</label>
                <select 
                  value={selectedFiliere} 
                  onChange={(e) => {
                    setSelectedFiliere(e.target.value);
                    if (e.target.value !== 'Ingénierie') {
                      setSelectedSpecialty('');
                    }
                  }}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235] bg-white font-medium shadow-sm"
                >
                  <option value="">Toutes filières</option>
                  {uniqueFilieres.map(filiere => (
                    <option key={filiere} value={filiere}>{filiere}</option>
                  ))}
                </select>
              </div>

              {/* Ville */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235] bg-white font-medium shadow-sm"
                >
                  <option value="">Toutes villes</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Seuil minimum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seuil minimum</label>
                <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2.5 shadow-sm">
                  <button
                    onClick={() => setSeuilValue(Math.max(SEUIL_MIN, seuilValue - SEUIL_STEP))}
                    disabled={seuilValue <= SEUIL_MIN}
                    className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-[#004235] hover:text-white disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-600 rounded-full transition-colors text-gray-600 text-sm font-bold"
                  >
                    −
                  </button>
                  <div className="flex-1 mx-3 text-center">
                    <span className="text-sm font-bold text-[#004235]">{seuilValue}</span>
                    <span className="text-xs text-gray-500">/20</span>
                  </div>
                  <button
                    onClick={() => setSeuilValue(Math.min(SEUIL_MAX, seuilValue + SEUIL_STEP))}
                    disabled={seuilValue >= SEUIL_MAX}
                    className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-[#004235] hover:text-white disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-600 rounded-full transition-colors text-gray-600 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-2.5 text-sm rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                  showAdvancedFilters 
                    ? 'bg-[#004235] text-white border-[#004235] shadow-md' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Plus de filtres</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Clear Filters */}
              {(selectedFiliere || selectedCity || seuilValue > SEUIL_MIN || selectedBacType || selectedInstitutionType || selectedPublicPrivate || selectedConcoursType || selectedAdmissionType || selectedSpecialty) && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                >
                  Effacer tous les filtres
                </button>
              )}
            </div>

            {/* Results Counter */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-[#004235] to-[#cda86b] text-white rounded-lg shadow-sm">
              <span className="text-sm font-medium">
                {filteredSchools.length} école{filteredSchools.length !== 1 ? 's' : ''} trouvée{filteredSchools.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Advanced Filters Panel - Clean Slide Animation */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showAdvancedFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">              
              {/* Advanced Filters Grid - Clean Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Public/Private Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secteur</label>
                  <select 
                    value={selectedPublicPrivate} 
                    onChange={(e) => setSelectedPublicPrivate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235] bg-white font-medium shadow-sm transition-all hover:border-[#004235]"
                  >
                    <option value="">Public et Privé</option>
                    <option value="public">🏛️ Public uniquement</option>
                    <option value="private">🏢 Privé uniquement</option>
                  </select>
                </div>

                {/* Concours Requirement Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mode d'admission</label>
                  <select 
                    value={selectedConcoursType} 
                    onChange={(e) => setSelectedConcoursType(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235] bg-white font-medium shadow-sm transition-all hover:border-[#004235]"
                  >
                    <option value="">Tous les modes</option>
                    <option value="with-concours">📝 Avec concours</option>
                    <option value="without-concours">✅ Sans concours</option>
                  </select>
                </div>

                {/* Admission Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'admission</label>
                  <select 
                    value={selectedAdmissionType} 
                    onChange={(e) => setSelectedAdmissionType(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235] bg-white font-medium shadow-sm transition-all hover:border-[#004235]"
                  >
                    <option value="">Tous les types</option>
                    <option value="Concours">🏆 Concours</option>
                    <option value="Preselection">📋 Présélection</option>
                    <option value="Combined">🔄 Mixte</option>
                    <option value="Direct">⚡ Accès direct</option>
                  </select>
                </div>
              </div>

              {/* Specialty Filter - Special Section for Engineering */}
              {selectedFiliere === 'Ingénierie' && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-[#cda86b]">⚙️</span>
                    Spécialité d'ingénierie
                  </label>
                  <select 
                    value={selectedSpecialty} 
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full md:w-2/3 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004235] focus:border-[#004235] bg-white font-medium shadow-sm transition-all hover:border-[#004235]"
                  >
                    <option value="">Toutes les spécialités d'ingénierie</option>
                    {availableSpecialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
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
                  <Marker 
                    key={school.id} 
                    position={school.coordinates as LatLngExpression}
                    icon={createSchoolIcon()}
                    eventHandlers={{
                      click: () => handleMarkerClick(school.id)
                    }}
                  >
                    <Popup>
                      <div className="font-semibold">{school.name}</div>
                      <div className="text-xs text-gray-600">{school.city}</div>
                      <div className="text-xs text-[#cda86b] font-bold mt-1">
                        Seuil: {typeof school.seuilEntree === 'object' && school.seuilEntree !== null
                          ? `${Math.min(...Object.values(school.seuilEntree))}-${Math.max(...Object.values(school.seuilEntree))}/20`
                          : `${school.seuilEntree}/20`}
                      </div>
                      <button 
                        onClick={() => handleMarkerClick(school.id)}
                        className="mt-2 text-xs bg-[#004235] text-white px-2 py-1 rounded hover:bg-[#cda86b] transition-colors"
                      >
                        Voir la carte →
                      </button>
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
                const isHighlighted = highlightedSchoolId === school.id;
                return (
                  <div 
                    key={school.id} 
                    id={`school-card-${school.id}`}
                    className={`border rounded-lg transition-all duration-500 ${
                      isHighlighted 
                        ? 'border-[#cda86b] shadow-lg bg-gradient-to-r from-[#cda86b]/10 to-[#004235]/5 scale-[1.02]' 
                        : 'border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                            {isHighlighted && (
                              <span className="inline-flex items-center mr-2 text-[#cda86b] animate-pulse">
                                📍
                              </span>
                            )}
                            {school.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                              {school.type}
                            </span>
                            <span>{school.city}</span>
                            <span>{school.students} étudiants</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-medium text-gray-700 mb-1">Seuils d'admission</div>
                          {typeof school.seuilEntree === 'object' && school.seuilEntree !== null ? (
                            <div className="space-y-1">
                              <div className="text-xs text-[#cda86b] font-bold">
                                {Math.min(...Object.values(school.seuilEntree))}-{Math.max(...Object.values(school.seuilEntree))}/20
                              </div>
                              <div className="text-xs text-gray-500">Par bac</div>
                            </div>
                          ) : (
                            <>
                              <div className="text-lg font-bold text-[#cda86b]">
                                {school.seuilEntree}/20
                              </div>
                              <div className="text-xs text-gray-500">Seuil d'entrée</div>
                            </>
                          )}
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
                                
                                {/* Seuils d'admission detaillés */}
                                <div>
                                  <span className="font-medium">Seuils d'admission:</span>
                                  {typeof school.seuilEntree === 'object' && school.seuilEntree !== null ? (
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {Object.entries(school.seuilEntree).map(([bacType, seuil]) => (
                                        <div 
                                          key={bacType} 
                                          className="px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800"
                                        >
                                          <div className="font-medium text-xs">{bacType}</div>
                                          <div className="text-sm font-bold">{seuil}/20</div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="ml-2 font-medium">{school.seuilEntree}/20</span>
                                  )}
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