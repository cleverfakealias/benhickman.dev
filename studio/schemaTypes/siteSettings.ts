import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Site Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Default SEO Description',
            type: 'text',
        }),
        defineField({
            name: 'ogImage',
            title: 'Default Open Graph Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            description: 'Displayed on social cards.',
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Links',
            type: 'object',
            fields: [
                { name: 'github', title: 'GitHub URL', type: 'url' },
                { name: 'linkedin', title: 'LinkedIn URL', type: 'url' },
                { name: 'twitter', title: 'Twitter/X URL', type: 'url' },
                { name: 'email', title: 'Contact Email', type: 'string' },
                { name: 'bluesky', title: 'Bluesky URL', type: 'url' },
            ],
        }),
    ],
})
