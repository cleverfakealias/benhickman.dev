import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'snippet',
    title: 'Code Snippet / TIL',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'language',
            title: 'Language',
            type: 'string',
            description: 'e.g., typescript, python, css',
        }),
        defineField({
            name: 'description',
            title: 'Brief Explanation',
            type: 'text',
        }),
        defineField({
            name: 'code',
            title: 'Code Block',
            type: 'text',
            description: 'Store the actual snippet here. Or use a custom Sanity code input plugin if installed.',
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'language',
        },
    },
})
