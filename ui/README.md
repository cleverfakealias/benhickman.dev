# benhickman.dev UI

React frontend for benhickman.dev, built with Vite, TypeScript, and Material-UI. It integrates with Sanity CMS content, supports multi-domain branding, and includes contact forms with hCaptcha.

## ✨ Features

- **Multi-Domain Branding**: Dynamic theming for benhickman.dev, zengineer.cloud, and zennlogic.com.
- **Responsive Design**: Material-UI with light/dark mode.
- **Contact Forms**: Formspree integration with hCaptcha spam protection.
- **CMS Integration**: Pulls content from Sanity.io.
- **Developer Tools**: ESLint, Prettier, Jest, Storybook.
- **Performance**: Vite-powered with code splitting and lazy loading.

## 🛠️ Tech Stack

- React 19, Vite 6, TypeScript 5
- Material-UI 6, Emotion 11
- Sanity client
- Formspree + hCaptcha
- Jest, Storybook

## 📋 Prerequisites

- Node.js 18+
- npm
- Sanity project and credentials

## 💾 Installation

```bash
cd ui
npm install
```

## ⚙️ Setup

1. **Environment Variables**:
   Create `.env` in `ui/`:

   ```
   VITE_SANITY_PROJECT_ID=your-project-id
   VITE_SANITY_DATASET=production
   VITE_FORMSPREE_URL=your-formspree-url
   VITE_HCAPTCHA_SITEKEY=your-hcaptcha-key
   ```

2. **Domain Config**: Edit `src/config/domainConfig.ts` for branding per domain.

## 🚀 Usage

- **Dev Server**: `npm run dev` (opens at http://localhost:5173)
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`
- **Format Check**: `npm run format:check`
- **Tests**: `npm test`
- **Storybook**: `npm run storybook`

## 🚀 Deployment

Configured for Vercel. Connect the repo and deploy automatically after CI.

## 🤝 Contributing

- Follow code style and run tests.
- See main [`../README.md`](../README.md) for overall guidelines.

For more, see the main [`../README.md`](../README.md).
