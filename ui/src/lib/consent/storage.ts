import Cookies from 'js-cookie';

export type ConsentStatus = 'granted' | 'denied' | 'unknown';

const CONSENT_COOKIE_NAME = 'benhickman_consent_v1';
const COOKIE_EXPIRY_DAYS = 365;

export const getConsentCookie = (): ConsentStatus => {
  const value = Cookies.get(CONSENT_COOKIE_NAME);
  if (value === 'granted' || value === 'denied') {
    return value;
  }
  return 'unknown';
};

export const setConsentCookie = (status: ConsentStatus) => {
  if (status === 'unknown') {
    Cookies.remove(CONSENT_COOKIE_NAME);
  } else {
    Cookies.set(CONSENT_COOKIE_NAME, status, {
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:',
    });
  }
};
