import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '../../hooks/useConsent';
import {
  initAnalyticsIfConsented,
  GA_MEASUREMENT_ID,
  GA_DEBUG,
  updateAnalyticsConsent,
} from '../../config/analytics';

const AnalyticsTracker = () => {
  const location = useLocation();
  const { consent } = useConsent();

  // Handle initialization based on consent
  useEffect(() => {
    if (consent === 'unknown') {
      return;
    }

    updateAnalyticsConsent(consent === 'granted' ? 'granted' : 'denied');

    if (consent === 'granted') {
      initAnalyticsIfConsented(true);
    }
  }, [consent]);

  // Handle page views
  useEffect(() => {
    // Only track if consent is granted
    if (consent !== 'granted' || !GA_MEASUREMENT_ID) {
      return;
    }

    // Ensure we are initialized (idempotent check inside)
    initAnalyticsIfConsented(true);

    const pagePath = `${location.pathname}${location.search}${location.hash}`;

    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Use the config command to update page_path context, or send a page_view event explicitly.
    // Since we disabled send_page_view in init, we send it here.
    // Note: 'config' updates the 'page_path' parameter for subsequent events too.
    if (typeof window.gtag === 'function') {
      if (GA_DEBUG) {
        console.log('BENHICKMAN_DEV: Sending page_view event', pagePath);
      }
      window.gtag('event', 'page_view', {
        send_to: GA_MEASUREMENT_ID,
        page_title: document.title,
        page_location: window.location.href,
        page_path: pagePath,
        ...(GA_DEBUG && isLocalhost ? { debug_mode: true } : {}),
        // In dev, force XHR so the request is visible in the Network tab.
        ...(isLocalhost ? { transport_type: 'xhr' } : {}),
      });
    } else {
      console.warn('BENHICKMAN_DEV: window.gtag is not a function');
    }
  }, [location.pathname, location.search, location.hash, consent]);

  return null;
};

export default AnalyticsTracker;
