import {defineField, defineType} from 'sanity'

export const homeContentSectionModule = defineType({
  name: 'homeContentSectionModule',
  title: 'Content Section Module',
  type: 'object',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Content Section',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required().min(6).max(120),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'media',
      title: 'Supporting Media',
      type: 'homeImageAsset',
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Content Left', value: 'content-left'},
          {title: 'Content Right', value: 'content-right'},
          {title: 'Full Width', value: 'full-width'},
        ],
        layout: 'radio',
      },
      initialValue: 'content-left',
    }),
    defineField({
      name: 'cta',
      title: 'Section CTA',
      type: 'homeCta',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'layout',
      media: 'media.image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Content section',
        subtitle: subtitle ? `Section · ${subtitle}` : 'Content section',
        media,
      }
    },
  },
})
