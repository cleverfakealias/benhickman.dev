/**
 * Shared organization constants
 * Single source of truth for organization IDs and titles across the Sanity Studio
 */

export interface Organization {
    id: string;
    title: string;
    value?: string; // For Sanity options list compatibility
}

/**
 * Static organization IDs
 * Used for filtering posts, configuring home pages, and desk structure
 */
export const ORGANIZATIONS: Organization[] = [
    { id: 'zengineer.cloud', title: 'Zengineer.cloud' },
    { id: 'benhickman.dev', title: 'BenHickman.dev' },
    { id: 'chisagolakesmasons.org', title: 'ChisagoLakesMasons.org' },
];

/**
 * Organization options formatted for Sanity dropdown/radio inputs
 * Maps organization IDs to dropdown options with title/value pairs
 */
export const ORGANIZATION_OPTIONS = ORGANIZATIONS.map((org) => ({
    title: org.title,
    value: org.id,
}));
