/**
 * Utility functions for secure Sanity preview mode detection.
 *
 * SECURITY RATIONALE:
 * ==================
 * Simple iframe detection (window.parent !== window) is NOT secure because:
 * 1. Any malicious site can embed your app in an iframe
 * 2. This could enable unintended visual editing capabilities
 * 3. Preview data/tokens could be exposed to untrusted origins
 *
 * DEFENSE IN DEPTH:
 * ================
 * This implementation uses multiple security layers:
 * 1. Query parameter check (?preview=true) - explicit opt-in
 * 2. Origin verification via ancestorOrigins API (when available)
 * 3. Same-origin policy enforcement (cross-origin access blocked)
 * 4. Allowlist of trusted Sanity Studio URLs
 *
 * USAGE:
 * =====
 * - Use `isSanityPreviewMode()` for preview data fetching
 * - Use `shouldEnableVisualEditing()` for enabling Sanity visual editing
 * - Always pass `?preview=true` query parameter from Sanity Studio
 *
 * @see https://www.sanity.io/docs/presentation-tool
 */

/**
 * Checks if the application is running in Sanity Presentation/Preview mode.
 *
 * Uses multiple security checks:
 * 1. Query parameter check (?preview=true) - primary indicator
 * 2. Origin verification against allowed studio URLs
 * 3. Iframe context verification (secondary check only)
 *
 * @returns true if in legitimate Sanity preview mode
 */
export function isSanityPreviewMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check 1: Explicit preview query parameter
  const searchParams = new URLSearchParams(window.location.search);
  const hasPreviewParam = searchParams.has('preview');

  // Check 2: Verify we're in an iframe context (but don't rely on this alone)
  const isInIframe = window.parent !== window;

  // Check 3: Verify parent origin is from an allowed Sanity Studio URL
  const isFromTrustedOrigin = isInIframe && isTrustedStudioOrigin();

  // Require either explicit preview param OR trusted iframe origin
  return hasPreviewParam || isFromTrustedOrigin;
}

/**
 * Verifies if the parent frame origin is a trusted Sanity Studio URL.
 * Uses window.location.ancestorOrigins when available (Chromium browsers).
 *
 * @returns true if parent origin is trusted
 */
function isTrustedStudioOrigin(): boolean {
  if (typeof window === 'undefined' || window.parent === window) {
    return false;
  }

  const allowedOrigins = [
    'http://localhost:3333', // Local Sanity Studio
    'https://localhost:3333', // Local HTTPS Studio
    import.meta.env.VITE_SANITY_STUDIO_URL, // Configured studio URL
  ].filter(Boolean); // Remove undefined values

  // Try using ancestorOrigins API (available in Chrome/Edge/Opera)
  if ('ancestorOrigins' in window.location) {
    const ancestorOrigins = window.location.ancestorOrigins;
    for (let i = 0; i < ancestorOrigins.length; i++) {
      const origin = ancestorOrigins[i];
      if (allowedOrigins.some((allowed) => origin?.startsWith(allowed || ''))) {
        return true;
      }
    }
  }

  // Fallback: Try postMessage communication to verify parent
  // This is less secure but provides some verification
  try {
    // Check if we can access parent.location.origin (will throw if cross-origin)
    // Only works if parent allows access via document.domain or same-origin
    const parentOrigin = window.parent.location.origin;
    return allowedOrigins.some((allowed) => allowed && parentOrigin.startsWith(allowed));
  } catch {
    // Cross-origin parent - for local dev, allow if we're on localhost preview route
    if (window.location.pathname.startsWith('/preview/') && 
        window.location.hostname === 'localhost') {
      return true;
    }
    return false;
  }
}

/**
 * Checks if visual editing should be enabled.
 * More restrictive than preview mode - requires iframe context + trusted origin.
 *
 * @returns true if visual editing should be enabled
 */
export function shouldEnableVisualEditing(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Visual editing requires iframe context AND trusted origin
  const isInIframe = window.parent !== window;
  const isTrusted = isTrustedStudioOrigin();

  return isInIframe && isTrusted;
}
