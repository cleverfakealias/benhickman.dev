import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project / Portfolio',
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
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'summary',
            title: 'Short Summary',
            type: 'text',
            description: 'Used for project cards.',
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'blockContent',
            description: 'Full project description.',
        }),
        defineField({
            name: 'techStack',
            title: 'Tech Stack',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
        defineField({
            name: 'githubUrl',
            title: 'GitHub URL',
            type: 'url',
        }),
        defineField({
            name: 'liveUrl',
            title: 'Live Demo URL',
            type: 'url',
        }),
        defineField({
            name: 'displayOrder',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers show up first',
            initialValue: 0,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'featuredImage',
        },
    },
})
