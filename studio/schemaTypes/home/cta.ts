import { defineField, defineType } from 'sanity'

export const homeCta = defineType({
    name: 'homeCta',
    title: 'Call To Action',
    type: 'object',
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: (rule) => rule.required().min(2).max(48),
        }),
        defineField({
            name: 'href',
            title: 'Destination',
            type: 'url',
            description: 'Supports absolute URLs or relative paths (e.g. /contact).',
            validation: (rule) =>
                rule
                    .required()
                    .uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
        }),
        defineField({
            name: 'style',
            title: 'Style',
            type: 'string',
            options: {
                list: [
                    { title: 'Primary', value: 'primary' },
                    { title: 'Secondary', value: 'secondary' },
                    { title: 'Link', value: 'link' },
                ],
                layout: 'radio',
            },
            initialValue: 'primary',
        }),
    ],
    preview: {
        select: { title: 'label', subtitle: 'href' },
        prepare({ title, subtitle }) {
            return {
                title: title || 'CTA',
                subtitle: subtitle || 'Configure link destination',
            }
        },
    },
})
