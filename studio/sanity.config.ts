import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {locations, mainDocuments} from './lib/presentation/resolve'
import {schemaTypes} from './schemaTypes'
import deskStructure from './deskStructure'

export default defineConfig({
  name: 'default',
  title: 'ZennLogic CMS',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({structure: deskStructure}),
    presentationTool({
      resolve: {locations, mainDocuments},
      previewUrl: {
        // Prefer env override; fallback to localhost:5173 for Vite dev; else production domain
        initial:
          process.env.SANITY_STUDIO_PREVIEW_URL ||
          process.env.VITE_SITE_URL ||
          'https://localhost:5173',
      },
      allowOrigins: [
        'http://localhost:*',
        'https://localhost:*',
        'https://benhickman.dev',
        'https://www.benhickman.dev',
        'https://zengineer.cloud',
        'https://www.zengineer.cloud',
      ],
    }),
    visionTool(),
  ],
  schema: {types: schemaTypes},
})
