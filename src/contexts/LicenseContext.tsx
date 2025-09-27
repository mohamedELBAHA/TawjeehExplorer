import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LicenseInfo {
  isValid: boolean;
  licenseKey: string;
  expirationDate: Date | null;
  userEmail: string;
  features: string[];
  plan?: string;
  maxUsers?: number;
}

interface LicenseContextType {
  licenseInfo: LicenseInfo | null;
  setLicenseInfo: (info: LicenseInfo | null) => void;
  hasFeature: (feature: string) => boolean;
  isLicenseValid: () => boolean;
  getLicensePlan: () => string;
  getMaxUsers: () => number;
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

export const useLicense = () => {
  const context = useContext(LicenseContext);
  if (context === undefined) {
    throw new Error('useLicense must be used within a LicenseProvider');
  }
  return context;
};

interface LicenseProviderProps {
  children: ReactNode;
}

export const LicenseProvider: React.FC<LicenseProviderProps> = ({ children }) => {
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);

  const hasFeature = (feature: string): boolean => {
    return licenseInfo?.features.includes(feature) || false;
  };

  const isLicenseValid = (): boolean => {
    if (!licenseInfo) return false;
    if (!licenseInfo.isValid) return false;
    if (licenseInfo.expirationDate && new Date() > licenseInfo.expirationDate) return false;
    return true;
  };

  const getLicensePlan = (): string => {
    return licenseInfo?.plan || 'unknown';
  };

  const getMaxUsers = (): number => {
    return licenseInfo?.maxUsers || 1;
  };

  const value: LicenseContextType = {
    licenseInfo,
    setLicenseInfo,
    hasFeature,
    isLicenseValid,
    getLicensePlan,
    getMaxUsers,
  };

  return (
    <LicenseContext.Provider value={value}>
      {children}
    </LicenseContext.Provider>
  );
};

export type { LicenseInfo };
