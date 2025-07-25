# Zengineer Cloud UI

This is the UI for the zengineer.cloud project, built with React, TypeScript, Vite, and Material-UI, with content managed through Sanity CMS.

## Features

- Modern responsive design
- Light and dark mode support
- Contact form with Formspree and reCAPTCHA
- Themed with Minnesota sports-inspired palette
- Content management with Sanity CMS
- Blog functionality with dynamic content

## Project Structure

```
zengineer.cloud/
├── ui/                    # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── common/    # Reusable UI components
│   │   │   ├── features/  # Feature-specific components
│   │   │   └── layout/    # Layout components (header, footer)
│   │   ├── pages/         # Page components (routes)
│   │   ├── styles/        # Global styles and theme
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript types
│   │   └── constants/     # App constants
│   └── public/            # Static assets
└── studio/                # Sanity CMS studio
    ├── schemaTypes/       # Content schemas
    ├── sanity.config.ts   # Sanity configuration
    └── sanity.cli.ts      # Sanity CLI configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Sanity CLI (for content management)

### Installation

1. Install dependencies for both projects:

   ```sh
   # Install UI dependencies
   cd ui
   npm install

   # Install Sanity dependencies
   cd ../studio
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the `ui/` directory with:
   ```
   VITE_FORMSPREE_URL=your-formspree-endpoint
   VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
   VITE_SANITY_PROJECT_ID=your-sanity-project-id
   VITE_SANITY_DATASET=production
   ```

### Development

#### Running the UI

```sh
cd ui
npm run dev
```

The UI will be available at `http://localhost:5173`

#### Running Sanity Studio

```sh
cd studio
npm run dev
```

Sanity Studio will be available at `http://localhost:3333`

#### Running Both Projects

You can run both projects simultaneously by opening two terminal windows:

**Terminal 1:**

```sh
cd ui
npm run dev
```

**Terminal 2:**

```sh
cd studio
npm run dev
```

### Building for Production

#### UI

```sh
cd ui
npm run build
```

#### Sanity Studio

```sh
cd studio
npm run build
```

## Content Management

The project uses Sanity CMS for content management. The Sanity studio is located in the `studio/` directory and includes:

- **Blog Posts**: Create and manage blog content
- **Authors**: Manage author information
- **Categories**: Organize content with categories
- **Rich Text**: Full-featured text editor with custom blocks

### Sanity Schema Types

- `post.ts` - Blog post schema
- `author.ts` - Author information
- `category.ts` - Content categories
- `blockContent.ts` - Rich text content blocks

## Testing

Run tests for the UI:

```sh
cd ui
npm test
```

## Deployment

### UI Deployment

The UI is configured for deployment on Vercel with the `vercel.json` configuration file.

### Sanity Studio Deployment

Deploy Sanity Studio to Sanity's hosting:

```sh
cd studio
npm run deploy
```

## Environment Variables

### UI Environment Variables

Create a `.env` file in the `ui/` directory:

```
VITE_FORMSPREE_URL=your-formspree-endpoint
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
VITE_SANITY_PROJECT_ID=your-sanity-project-id
VITE_SANITY_DATASET=production
```

### Sanity Environment Variables

Sanity configuration is handled through the `sanity.config.ts` file in the `studio/` directory.

## License

MIT
