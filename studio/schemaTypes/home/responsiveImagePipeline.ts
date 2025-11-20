import { defineField, defineType } from 'sanity'

export const homeResponsiveImagePipeline = defineType({
    name: 'homeResponsiveImagePipeline',
    title: 'Responsive Image Pipeline',
    type: 'object',
    fields: [
        defineField({
            name: 'desktop',
            title: 'Desktop',
            type: 'homeImageAsset',
            description: '16:9 or similar crop for large viewports (>= 1024px).',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'tablet',
            title: 'Tablet',
            type: 'homeImageAsset',
            description: 'Optional crop tuned for medium breakpoints (768-1023px).',
        }),
        defineField({
            name: 'mobile',
            title: 'Mobile',
            type: 'homeImageAsset',
            description: '4:5 or square crop to avoid layout shift on phones.',
            validation: (rule) => rule.required(),
        }),
    ],
    options: { columns: 3 },
    preview: {
        select: { title: 'desktop.alt', subtitle: 'desktop.caption', media: 'desktop.image' },
        prepare({ title, subtitle, media }) {
            return {
                title: title || 'Responsive image set',
                subtitle: subtitle || 'Desktop · Tablet · Mobile',
                media,
            }
        },
    },
})
