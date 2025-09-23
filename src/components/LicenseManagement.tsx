import React, { useState } from 'react';
import { useLicense } from '../contexts/LicenseContext';

interface LicenseManagementProps {
  onClose: () => void;
}

const LicenseManagement: React.FC<LicenseManagementProps> = ({ onClose }) => {
  const { licenseInfo } = useLicense();
  const [showDetails, setShowDetails] = useState(false);

  const licenseFeatures = [
    { key: 'student_matcher', name: 'Recommandations personnalisées', description: 'Algorithme de matching étudiant-école' },
    { key: 'school_database', name: 'Base de données complète', description: 'Accès à toutes les écoles et programmes' },
    { key: 'map_view', name: 'Vue cartographique', description: 'Navigation géographique des établissements' },
    { key: 'export_reports', name: 'Export de rapports', description: 'Téléchargement de rapports détaillés' },
    { key: 'advanced_filters', name: 'Filtres avancés', description: 'Recherche multicritères avancée' },
    { key: 'api_access', name: 'Accès API', description: 'Intégration via API REST' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#004235]">Gestion de Licence</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current License Status */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Licence Actuelle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Email:</span>
                <div className="font-medium">{licenseInfo?.userEmail}</div>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <div className="font-medium">
                  {licenseInfo?.licenseKey === 'DEMO-TAWJEEH-2025-FREE' ? 'Démonstration' : 'Standard'}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Expiration:</span>
                <div className="font-medium">
                  {licenseInfo?.expirationDate?.toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Statut:</span>
                <div className="font-medium text-green-600">✅ Active</div>
              </div>
            </div>
          </div>

          {/* License Key Display */}
          <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Clé de Licence</h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-[#004235] hover:underline"
              >
                {showDetails ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            <div className="font-mono text-sm bg-white border rounded p-2">
              {showDetails ? licenseInfo?.licenseKey : '••••••••••••••••••••'}
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Fonctionnalités Incluses</h3>
            <div className="space-y-2">
              {licenseFeatures.map((feature) => {
                const hasFeature = licenseInfo?.features.includes(feature.key);
                return (
                  <div key={feature.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{feature.name}</div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </div>
                    <div className={`ml-4 ${hasFeature ? 'text-green-600' : 'text-gray-400'}`}>
                      {hasFeature ? '✅' : '❌'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upgrade Notice */}
          {licenseInfo?.licenseKey === 'DEMO-TAWJEEH-2025-FREE' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">🎯 Licence de Démonstration</h3>
              <p className="text-yellow-700 text-sm mb-3">
                Vous utilisez actuellement une licence de démonstration avec des fonctionnalités limitées.
              </p>
              <div className="text-sm text-yellow-600">
                <div>• Accès complet jusqu'au {licenseInfo.expirationDate?.toLocaleDateString('fr-FR')}</div>
                <div>• Toutes les fonctionnalités disponibles</div>
                <div>• Idéal pour tester la plateforme</div>
              </div>
              <div className="mt-3">
                <a
                  href="mailto:contact@tawjeehexplorer.com?subject=Demande de licence complète"
                  className="inline-block bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 transition-colors"
                >
                  Demander une licence complète
                </a>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => {
                localStorage.removeItem('tawjeeh_license');
                localStorage.removeItem('tawjeeh_email');
                window.location.reload();
              }}
              className="text-red-600 hover:text-red-800 underline text-sm"
            >
              Déconnecter
            </button>
            <button
              onClick={onClose}
              className="bg-[#004235] text-white px-6 py-2 rounded hover:bg-[#cda86b] transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseManagement;
