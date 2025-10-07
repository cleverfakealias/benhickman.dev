# Zengineer Cloud Platform

A full-stack web platform for Zengineer Cloud, featuring a headless CMS powered by Sanity.io and a modern React frontend. This repository includes everything needed to manage content, build dynamic user experiences, and deploy seamlessly across multiple domains.

## 📁 Project Structure

```
zengineer.cloud/
├── studio/          # Sanity CMS Studio (Content Management)
│   ├── README.md    # Studio-specific setup and docs
│   └── ...          # Sanity configuration and schemas
├── ui/              # React Frontend Application
│   ├── README.md    # Frontend setup and docs
│   └── ...          # React app source code
├── .github/         # GitHub Actions workflows
├── README.md        # This file (overall project docs)
└── ...              # Root-level configs (e.g., .gitignore)
```

- **[`studio/`](./studio/)**: Sanity Studio for content editing and management.
- **[`ui/`](./ui/)**: React application with Vite, Material-UI, and integrations for forms, CMS, and multi-domain support.

## ✨ Features

- **Headless CMS**: Sanity.io for flexible content modeling and real-time editing.
- **Dynamic Frontend**: React app with domain-specific branding, responsive design, and CMS integration.
- **Multi-Domain**: Configurable for `zengineer.cloud`, `zennlogic.com`, etc.
- **Forms & Security**: Formspree contact forms with hCaptcha spam protection.
- **Developer Tools**: ESLint, Prettier, Jest, Storybook, and automated CI/CD.
- **Deployment**: Vercel-ready with environment-based configs.

## 🛠️ Tech Stack

- **Backend/CMS**: Sanity.io (v3)
- **Frontend**: React 18, Vite 5, TypeScript 5, Material-UI 6
- **Forms**: Formspree + hCaptcha
- **Build/Dev**: Vite, ESLint, Prettier, Jest
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Node.js 18+ and npm
- Git
- Accounts for Sanity.io, Formspree, hCaptcha, and Vercel

## 💾 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/cleverfakealias/zengineer.cloud.git
   cd zengineer.cloud
   ```

2. **Install dependencies for both parts**:
   ```bash
   # For Sanity Studio
   cd studio
   npm install
   cd ..

   # For React UI
   cd ui
   npm install
   cd ..
   ```

3. **Set up environment variables**:
   - See [`studio/README.md`](./studio/README.md) for Sanity configs.
   - See [`ui/README.md`](./ui/README.md) for React app configs.

## ⚙️ Setup

### Sanity Studio
- Follow [`studio/README.md`](./studio/README.md) for detailed setup, including dataset creation and schema configuration.

### React Frontend
- Follow [`ui/README.md`](./ui/README.md) for environment setup, domain config, and development.

## 🚀 Usage

- **Development**:
  - Start Sanity Studio: `cd studio && npm run dev`
  - Start React App: `cd ui && npm run dev`
- **Content Editing**: Use Sanity Studio to manage posts, authors, categories, etc.
- **Frontend**: The React app pulls content from Sanity and adapts to the domain.

## 🚀 Deployment

- **Vercel**: Connect the repo for automated deploys. See [`ui/README.md`](./ui/README.md) for frontend deployment.
- **Sanity Hosting**: Sanity Studio can be hosted separately or integrated.

## 🤝 Contributing

1. Follow the setup in both [`studio/README.md`](./studio/README.md) and [`ui/README.md`](./ui/README.md).
2. Run linting and tests: `cd ui && npm run lint && npm test`.
3. Submit PRs—CI will check formatting, linting, and tests.
4. Reviews required for `main` branch merges.

## � License

MIT License. See `LICENSE` for details.

## 📞 Support

Open issues on GitHub or contact the maintainer.
