import React, { useState, useEffect } from 'react';
import { useLicense } from '../contexts/LicenseContext';

interface LicenseInfo {
  isValid: boolean;
  licenseKey: string;
  expirationDate: Date | null;
  userEmail: string;
  features: string[];
}

interface LicenseValidatorProps {
  children: React.ReactNode;
  onLicenseValidated?: (licenseInfo: LicenseInfo) => void;
}

const DEMO_LICENSE = "DEMO-TAWJEEH-2025-FREE";
const DEMO_EXPIRATION = new Date('2025-12-31');

const LicenseValidator: React.FC<LicenseValidatorProps> = ({ children, onLicenseValidated }) => {
  const { licenseInfo, setLicenseInfo } = useLicense();
  const [showLicensePrompt, setShowLicensePrompt] = useState(false);
  const [inputLicense, setInputLicense] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if license exists in localStorage
    const storedLicense = localStorage.getItem('tawjeeh_license');
    const storedEmail = localStorage.getItem('tawjeeh_email');
    
    if (storedLicense && storedEmail) {
      validateLicense(storedLicense, storedEmail);
    } else {
      setShowLicensePrompt(true);
    }
  }, []);

  const validateLicense = (license: string, email: string) => {
    setIsLoading(true);
    setError('');

    // Simulate license validation
    setTimeout(() => {
      const isValidDemo = license === DEMO_LICENSE;
      const isNotExpired = new Date() <= DEMO_EXPIRATION;
      
      if (isValidDemo && isNotExpired) {
        const validLicense: LicenseInfo = {
          isValid: true,
          licenseKey: license,
          expirationDate: DEMO_EXPIRATION,
          userEmail: email,
          features: ['student_matcher', 'school_database', 'map_view', 'export_reports']
        };
        
        setLicenseInfo(validLicense);
        setShowLicensePrompt(false);
        
        // Store in localStorage
        localStorage.setItem('tawjeeh_license', license);
        localStorage.setItem('tawjeeh_email', email);
        
        onLicenseValidated?.(validLicense);
      } else if (isValidDemo && !isNotExpired) {
        setError('Cette licence de démonstration a expiré. Contactez-nous pour une nouvelle licence.');
      } else {
        setError('Clé de licence invalide. Vérifiez votre clé ou contactez le support.');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputLicense.trim() || !inputEmail.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    validateLicense(inputLicense.trim(), inputEmail.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('tawjeeh_license');
    localStorage.removeItem('tawjeeh_email');
    setLicenseInfo(null);
    setShowLicensePrompt(true);
    setInputLicense('');
    setInputEmail('');
  };

  if (showLicensePrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#004235] to-[#006b4f] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#004235] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-[#004235] mb-2">
              Licence TawjeehExplorer
            </h1>
            <p className="text-gray-600">
              Entrez votre clé de licence pour accéder à la plateforme
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004235]"
                placeholder="votre.email@exemple.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clé de licence
              </label>
              <input
                type="text"
                value={inputLicense}
                onChange={(e) => setInputLicense(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004235] font-mono"
                placeholder="DEMO-TAWJEEH-2025-FREE"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#004235] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#cda86b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Validation...
                </div>
              ) : (
                'Valider la licence'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">🎯 Licence de démonstration</h3>
            <p className="text-sm text-blue-700 mb-2">
              Utilisez cette clé pour tester la plateforme :
            </p>
            <code className="bg-blue-100 text-blue-900 px-2 py-1 rounded text-sm">
              DEMO-TAWJEEH-2025-FREE
            </code>
            <p className="text-xs text-blue-600 mt-2">
              Valide jusqu'au 31 décembre 2025
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Besoin d'une licence ? 
              <a href="mailto:contact@tawjeehexplorer.com" className="text-[#004235] hover:underline ml-1">
                Contactez-nous
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (licenseInfo?.isValid) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004235] mx-auto mb-4"></div>
        <p className="text-gray-600">Validation de la licence...</p>
      </div>
    </div>
  );
};

export default LicenseValidator;
