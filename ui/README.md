# Zengineer Cloud UI

This is the React frontend for the Zengineer Cloud platform, built with Vite, TypeScript, and Material-UI. It integrates with Sanity CMS for content and supports multi-domain branding, contact forms with hCaptcha, and responsive design.

## ✨ Features

- **Multi-Domain Branding**: Dynamic theming for `zengineer.cloud`, `zennlogic.com`, etc.
- **Responsive Design**: Material-UI with light/dark mode.
- **Contact Forms**: Formspree integration with hCaptcha spam protection.
- **CMS Integration**: Pulls content from Sanity.io.
- **Developer Tools**: ESLint, Prettier, Jest, Storybook.
- **Performance**: Vite-powered with code splitting and lazy loading.

## 🛠️ Tech Stack

- React 18, Vite 5, TypeScript 5
- Material-UI 6, Emotion 11
- Sanity.io client
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

- **Dev Server**: `npm run dev` (opens at `http://localhost:5173`)
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`
- **Format Check**: `npm run format:check`
- **Tests**: `npm test`
- **Storybook**: `npm run storybook`

## 🚀 Deployment

Configured for Vercel. Connect repo and deploy automatically after CI.

## 🤝 Contributing

- Follow code style and run tests.
- See main [`../README.md`](../README.md) for overall guidelines.

For more, see the main [`../README.md`](../README.md).
