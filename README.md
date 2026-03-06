# benhickman.dev

Portfolio platform for Ben Hickman with a Sanity Studio CMS and a React/Vite frontend. The UI supports multi-domain branding (benhickman.dev, zengineer.cloud, zennlogic.com) and pulls content from Sanity.

## 📁 Project structure

```
benhickman.dev/
├── studio/          # Sanity CMS Studio (content management)
│   ├── README.md    # Studio-specific setup and docs
│   └── ...          # Sanity configuration and schemas
├── ui/              # React frontend application
│   ├── README.md    # Frontend setup and docs
│   └── ...          # React app source code
├── .github/         # GitHub Actions workflows
├── README.md        # This file
└── ...              # Root-level configs
```

- [studio/](studio/) — Sanity Studio for content editing and management.
- [ui/](ui/) — React app with Vite, Material-UI, Sanity integration, and domain-specific branding.

## ✨ Features

- Headless CMS with Sanity Studio (schemas for posts, authors, categories, home modules).
- React 19 + Vite frontend with responsive design and MUI theming.
- Multi-domain branding (benhickman.dev, zengineer.cloud, zennlogic.com).
- Forms via Formspree with hCaptcha support.
- Developer tooling: ESLint, Prettier, Jest, Storybook.
- Vercel-ready deployment with environment-based configuration.

## 🛠️ Tech stack

- CMS: Sanity v4
- Frontend: React 19, Vite 6, TypeScript 5, Material-UI 6
- Forms: Formspree + hCaptcha
- Tooling: ESLint, Prettier, Jest, Storybook
- Deployment: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Git
- Accounts for Sanity, Formspree, hCaptcha, and Vercel (as needed)

## 💾 Installation

Install dependencies per package:

```bash
cd studio
npm install
cd ..

cd ui
npm install
cd ..
```

## ⚙️ Configuration

- Sanity Studio settings and env vars: see [studio/README.md](studio/README.md)
- UI env vars and domain config: see [ui/README.md](ui/README.md)

## 🔎 Setup review checklist

1. Install dependencies in both packages (see [Installation](#-installation)).
2. Create required environment files:
	- Studio: [studio/README.md](studio/README.md)
	- UI: [ui/README.md](ui/README.md)
3. Verify local dev runs:
	- Studio: `cd studio && npm run dev`
	- UI: `cd ui && npm run dev`
4. Confirm domain branding config in [ui/src/config/domainConfig.ts](ui/src/config/domainConfig.ts).

## 🚀 Local development

- Start Sanity Studio: `cd studio && npm run dev`
- Start UI: `cd ui && npm run dev`

The UI runs at http://localhost:5173 by default. Studio runs at http://localhost:3333.

## ✅ Tests and quality

- Lint: `cd ui && npm run lint`
- Typecheck: `cd ui && npm run typecheck`
- Format check: `cd ui && npm run format:check`
- Unit tests: `cd ui && npm test`
- Coverage: `cd ui && npm run test:coverage`
- Storybook: `cd ui && npm run storybook`

## 🧪 Build and verification

- UI production build: `cd ui && npm run build`
- Studio production build: `cd studio && npm run build`

## 🚀 Deployment

- UI: deploy on Vercel (see [ui/README.md](ui/README.md))
- Studio: deploy via `cd studio && npm run deploy` or host separately

## 🤝 Contributing

- Follow setup in [studio/README.md](studio/README.md) and [ui/README.md](ui/README.md)
- Run lint/tests before PRs

## 📄 License

See LICENSE for details.
