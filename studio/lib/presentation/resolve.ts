import { defineDocuments, defineLocations } from 'sanity/presentation'

// Map Sanity documents to your frontend routes
// Adjust routes if your UI paths change
export const locations = {
    post: defineLocations({
        select: { title: 'title', slug: 'slug.current' },
        resolve: (doc) => ({
            locations: [
                { title: (doc as any)?.title || 'Post', href: `/blog/post/${(doc as any)?.slug}` },
                { title: 'Blog index', href: '/blog' },
            ],
        }),
    }),
    homePage: defineLocations({
        select: { organizationId: 'organizationId' },
        resolve: (doc) => {
            const organizationId = (doc as any)?.organizationId || 'benhickman.dev'

            return {
                locations: [
                    {
                        title: 'Preview Home',
                        href: `/preview/home/${organizationId}`,
                    },
                ],
            }
        },
    }),
}

// Tell Presentation which document to open when navigating to a route
export const mainDocuments = defineDocuments([
    {
        route: '/blog/post/:slug',
        filter: `_type == "post" && slug.current == $slug`,
    },
    {
        route: '/preview/home/:organizationId',
        filter: `_type == "homePage" && organizationId == $organizationId`,
    },
])
