import { defineField, defineType } from 'sanity'

export const homeHeroModule = defineType({
    name: 'homeHeroModule',
    title: 'Hero Module',
    type: 'object',
    fields: [
        defineField({
            name: 'internalTitle',
            title: 'Internal Title',
            type: 'string',
            initialValue: 'Hero',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'eyebrow',
            title: 'Eyebrow',
            type: 'string',
            validation: (rule) => rule.max(60),
        }),
        defineField({
            name: 'headline',
            title: 'Headline',
            type: 'string',
            validation: (rule) => rule.required().min(10).max(120),
        }),
        defineField({
            name: 'lede',
            title: 'Supporting Copy',
            type: 'text',
            rows: 3,
            validation: (rule) => rule.max(320),
        }),
        defineField({
            name: 'primaryCta',
            title: 'Primary CTA',
            type: 'homeCta',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'secondaryCta',
            title: 'Secondary CTA',
            type: 'homeCta',
            description: 'Optional secondary action rendered beside the primary CTA.',
        }),
        defineField({
            name: 'media',
            title: 'Hero Media',
            type: 'homeResponsiveImagePipeline',
            description: 'Supply responsive imagery for each breakpoint to drive the image pipeline.',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'layout',
            title: 'Layout',
            type: 'string',
            options: {
                list: [
                    { title: 'Media Right', value: 'media-right' },
                    { title: 'Media Left', value: 'media-left' },
                    { title: 'Content Only', value: 'content-only' },
                ],
                layout: 'radio',
            },
            initialValue: 'media-right',
        }),
        defineField({
            name: 'emphasis',
            title: 'Theme Emphasis',
            type: 'string',
            options: {
                list: [
                    { title: 'Brand', value: 'brand' },
                    { title: 'Neutral', value: 'neutral' },
                    { title: 'Surface', value: 'surface' },
                ],
                layout: 'radio',
            },
            initialValue: 'brand',
        }),
    ],
    preview: {
        select: {
            title: 'headline',
            subtitle: 'eyebrow',
            media: 'media.desktop.image',
        },
        prepare({ title, subtitle, media }) {
            return {
                title: title || 'Hero module',
                subtitle: subtitle ? `Hero · ${subtitle}` : 'Hero module',
                media,
            }
        },
    },
})
