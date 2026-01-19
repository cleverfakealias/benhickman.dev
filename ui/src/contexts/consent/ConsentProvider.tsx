import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { ConsentStatus, getConsentCookie, setConsentCookie } from '../../lib/consent/storage';
import { ConsentContext } from './ConsentContext';

const BROADCAST_CHANNEL_NAME = 'benhickman_consent_updates';

export const ConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consent, setConsentState] = useState<ConsentStatus>('unknown');
  const [isBannerOpen, setBannerOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  // Initialize from cookie on mount
  useEffect(() => {
    const savedConsent = getConsentCookie();
    setConsentState(savedConsent);
    // If unknown, show banner
    if (savedConsent === 'unknown') {
      setBannerOpen(true);
    }
  }, []);

  // Sync across tabs using BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

    channel.onmessage = (event) => {
      if (event.data && typeof event.data.consent === 'string') {
        setConsentState(event.data.consent);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const setConsent = useCallback((status: ConsentStatus) => {
    setConsentState(status);
    setConsentCookie(status);

    // Broadcast change
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.postMessage({ consent: status });
    channel.close();

    // Close banner if status is definitive
    if (status !== 'unknown') {
      setBannerOpen(false);
    }
  }, []);

  const value = {
    consent,
    setConsent,
    isBannerOpen,
    setBannerOpen,
    isSettingsOpen,
    setSettingsOpen,
  };

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};
