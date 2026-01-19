import { getEnv } from './env';

export const GA_MEASUREMENT_ID = getEnv('VITE_GA_MEASUREMENT_ID');
export const GA_DEBUG = getEnv('VITE_GA_DEBUG') === 'true';

let isInitialized = false;

type ConsentModeValue = 'granted' | 'denied';

let consentDefaultSet = false;

const ensureGtag = () => {
    window.dataLayer = window.dataLayer || [];

    if (typeof window.gtag !== 'function') {
        // Important: match the official gtag snippet behavior.
        // gtag.js expects each queued entry to be the `arguments` object.
        // We accept a rest param for linting, but we intentionally push the real
        // `arguments` object (gtag.js reads the dataLayer queue in that shape).
        function gtag(...args: unknown[]) {
            if (GA_DEBUG) {
                console.log('BENHICKMAN_DEV: gtag called with:', args);
            }
            // eslint-disable-next-line prefer-rest-params
            window.dataLayer?.push(arguments as unknown as never);
        }
        window.gtag = gtag;
    }

    // Set default consent state (must happen before config)
    if (!consentDefaultSet && typeof window.gtag === 'function') {
        window.gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            wait_for_update: 500, // Wait up to 500ms for consent update
        });
        consentDefaultSet = true;
        if (GA_DEBUG) {
            console.log('BENHICKMAN_DEV: Consent default set to denied');
        }
    }
};

export const updateAnalyticsConsent = (consent: ConsentModeValue) => {
    ensureGtag();

    if (GA_DEBUG) {
        console.log('BENHICKMAN_DEV: Updating analytics consent to:', consent);
    }

    if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
            analytics_storage: consent,
            ad_storage: 'denied',
        });
    }
};

export const isAnalyticsInitialized = () => isInitialized;

export const initAnalyticsIfConsented = (consentGranted: boolean) => {
    if (!consentGranted) {
        // If permission revoked (or not given), we ideally want to clean up or ensure we don't track.
        // Gtm/Ga doesn't have an easy "un-init", but we can ensure we don't inject scripts.
        return;
    }

    if (isInitialized) {
        return;
    }

    if (!GA_MEASUREMENT_ID) {
        console.warn('GA_MEASUREMENT_ID not set, skipping analytics init');
        return;
    }

    // Ensure dataLayer/gtag exist before the script loads
    ensureGtag();

    // Ensure consent mode is granted before init
    updateAnalyticsConsent('granted');

    // Inject script
    const existingScript = document.getElementById('ga-gtag');
    if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'ga-gtag';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        script.onload = () => {
            if (GA_DEBUG) {
                console.log(
                    'BENHICKMAN_DEV: gtag.js loaded (dataLayer size)',
                    Array.isArray(window.dataLayer) ? window.dataLayer.length : 'n/a'
                );
            }
        };
        script.onerror = () => {
            console.warn('BENHICKMAN_DEV: gtag.js failed to load');
        };
        document.head.appendChild(script);
    }

    // Config
    if (GA_DEBUG) {
        console.log('BENHICKMAN_DEV: Initializing GA', GA_MEASUREMENT_ID);
    }
    const gtag = window.gtag;
    if (typeof gtag !== 'function') {
        console.warn('BENHICKMAN_DEV: window.gtag is not available after initialization');
        return;
    }

    gtag('js', new Date());

    const config: Record<string, unknown> = {
        send_page_view: false, // We manually send page views to handle SPA routing
    };

    if (GA_DEBUG && window.location.hostname === 'localhost') {
        config.debug_mode = true;
    }

    gtag('config', GA_MEASUREMENT_ID, config);

    isInitialized = true;
};
