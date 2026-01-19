import { createContext } from 'react';
import { ConsentStatus } from '../../lib/consent/storage';

interface ConsentContextType {
  consent: ConsentStatus;
  setConsent: (status: ConsentStatus) => void;
  isBannerOpen: boolean;
  setBannerOpen: (isOpen: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (isOpen: boolean) => void;
}

export const ConsentContext = createContext<ConsentContextType | undefined>(undefined);
