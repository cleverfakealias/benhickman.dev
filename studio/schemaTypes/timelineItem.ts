import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'timelineItem',
    title: 'Timeline Item',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
            description: 'e.g., Software Engineer, Founder, or Degree Name',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle / Company / Institution',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Summary of roles, responsibilities, or coursework.',
        }),
        defineField({
            name: 'timestamp',
            title: 'Display Timestamp',
            type: 'string',
            validation: (rule) => rule.required(),
            description: 'e.g., Jan 2024 – Present, or 2025',
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date (for sorting)',
            type: 'string',
            description: 'Internal use for ordering, e.g. 2024-01-01 or just 2024',
        }),
        defineField({
            name: 'color',
            title: 'Theme Color',
            type: 'string',
            options: {
                list: [
                    { title: 'Primary', value: 'primary' },
                    { title: 'Secondary', value: 'secondary' },
                    { title: 'Success', value: 'success' },
                    { title: 'Warning', value: 'warning' },
                    { title: 'Error', value: 'error' },
                    { title: 'Info', value: 'info' },
                ],
            },
            initialValue: 'primary',
        }),
        defineField({
            name: 'icon',
            title: 'Icon Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Work / Briefcase', value: 'work' },
                    { title: 'Rocket Launch', value: 'rocket' },
                    { title: 'Construction / Tool', value: 'construction' },
                    { title: 'School / Education', value: 'school' },
                    { title: 'Language / Web', value: 'language' },
                ],
            },
            initialValue: 'work',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'subtitle',
            date: 'timestamp',
        },
        prepare({ title, subtitle, date }) {
            return {
                title,
                subtitle: `${subtitle} (${date})`,
            }
        },
    },
})
