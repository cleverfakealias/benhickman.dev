import { defineField, defineType } from 'sanity'

export const homeImageAsset = defineType({
    name: 'homeImageAsset',
    title: 'Image Asset',
    type: 'object',
    fields: [
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true, metadata: ['lqip', 'palette'] },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'alt',
            title: 'Alt Text',
            type: 'string',
            description: 'Describe what appears in the image for screen reader users.',
            validation: (rule) => rule.required().min(10).max(160),
        }),
        defineField({
            name: 'caption',
            title: 'Caption',
            type: 'string',
            description: 'Optional caption for supporting context.',
        }),
    ],
    preview: {
        select: { title: 'alt', subtitle: 'caption', media: 'image' },
        prepare({ title, subtitle, media }) {
            return {
                title: title || 'Image asset',
                subtitle: subtitle || 'Responsive media source',
                media,
            }
        },
    },
})
