import {defineArrayMember, defineField, defineType} from 'sanity'
import {ORGANIZATION_OPTIONS} from '../../lib/organizations'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'organizationId',
      title: 'Organization',
      type: 'string',
      description: 'Select the organization that this home page represents.',
      options: {list: ORGANIZATION_OPTIONS, layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internalTitle',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Home',
      validation: (rule) => rule.required().min(3).max(80),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Optional meta description override for search and social sharing.',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'modules',
      title: 'Page Modules',
      type: 'array',
      of: [
        defineArrayMember({type: 'homeHeroModule', title: 'Hero Module'}),
        defineArrayMember({type: 'homeContentSectionModule', title: 'Content Section'}),
      ],
      description: 'Compose the home page by arranging hero and content modules.',
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .custom((modules) => {
            if (!Array.isArray(modules) || modules.length === 0) {
              return 'Add at least one module to build the page.'
            }

            const heroCount = modules.filter((module) => {
              if (!module || typeof module !== 'object') {
                return false
              }

              const typedModule = module as {_type?: string}
              return typedModule._type === 'homeHeroModule'
            }).length

            if (heroCount === 0) {
              return 'Add a hero module so the page has a primary entry point.'
            }

            if (heroCount > 1) {
              return 'Only one hero module is allowed per home page.'
            }

            return true
          }),
    }),
  ],
  initialValue: ({documentId}) => {
    const inferredOrgId = documentId?.startsWith('homePage-')
      ? documentId.replace('homePage-', '')
      : undefined

    return {
      organizationId: inferredOrgId,
      modules: [
        {
          _type: 'homeHeroModule',
          internalTitle: 'Hero',
          eyebrow: 'Welcome',
          headline: 'Introduce your brand value here',
          lede: 'Replace this copy to highlight the promise your organization makes to visitors.',
          layout: 'media-right',
          emphasis: 'brand',
          primaryCta: {
            _type: 'homeCta',
            label: 'Get in touch',
            href: '/contact',
            style: 'primary',
          },
          secondaryCta: {
            _type: 'homeCta',
            label: 'View services',
            href: '/services',
            style: 'secondary',
          },
          media: {
            _type: 'homeResponsiveImagePipeline',
            desktop: {
              _type: 'homeImageAsset',
              alt: 'Hero desktop image placeholder - update with a branded asset.',
            },
            mobile: {
              _type: 'homeImageAsset',
              alt: 'Hero mobile image placeholder - update with a mobile-first composition.',
            },
          },
        },
        {
          _type: 'homeContentSectionModule',
          internalTitle: 'Intro Section',
          headline: 'Share the core outcomes you deliver',
          body: [
            {
              _type: 'block',
              style: 'normal',
              markDefs: [],
              children: [
                {
                  _type: 'span',
                  text: 'Use this section to expand on the services or expertise your organization provides.',
                },
              ],
            },
          ],
          layout: 'content-left',
          cta: {
            _type: 'homeCta',
            label: 'Explore more',
            href: '/about',
            style: 'link',
          },
        },
      ],
    }
  },
  preview: {
    select: {
      title: 'internalTitle',
      subtitle: 'organizationId',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Home Page',
        subtitle: subtitle ? `Home · ${subtitle}` : 'Home page configuration',
      }
    },
  },
})

export {
  homeContentSectionModule,
  homeCta,
  homeHeroModule,
  homeImageAsset,
  homeResponsiveImagePipeline,
} from './modules'
