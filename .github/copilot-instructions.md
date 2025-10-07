# GitHub Copilot Instructions for zengineer.cloud (benhickman.dev)

## Overview
This repository contains a modern React-based portfolio website for Ben Hickman, built with TypeScript, Vite, and Material-UI. It integrates with Sanity CMS for blog content and supports multiple domains. Follow these guidelines for consistent, high-quality development.

## Development Environment
- **OS**: Windows (PowerShell as default shell)
- **IDE**: Visual Studio Code with recommended extensions (ESLint, Prettier, TypeScript Importer)
- **Node.js**: Version 18+ (use nvm-windows for management)
- **Package Manager**: npm (scripts in package.json)
- **Git**: Use Git Bash or PowerShell with posh-git for better experience
- **Browser**: Chrome/Edge for development, test across browsers

### Setup Commands (PowerShell)
```powershell
cd C:\Users\YourName\git\zengineer.cloud\ui
npm install
npm run dev  # Starts Vite dev server on localhost:5173
```

## Code Style & Best Practices

### TypeScript/React
- **Strict Mode**: Enable all TypeScript strict checks
- **Type Safety**: Use interfaces/types for all props, state, and API responses
- **Component Patterns**: Prefer functional components with hooks
- **File Naming**: PascalCase for components (.tsx), camelCase for utilities (.ts)
- **Imports**: Group by: React, third-party libs, internal modules. Use absolute imports where possible
- **Error Handling**: Use try/catch for async operations, provide user-friendly error messages
- **Performance**: Memoize expensive computations with useMemo/useCallback, lazy load components

### Code Structure
- **Components**: Feature-based organization (e.g., `components/features/Blog.tsx`)
- **Hooks**: Custom hooks in `hooks/` directory
- **Utils**: Pure functions in `utils/` or `lib/`
- **Types**: Shared types in `types/` or component-specific
- **Constants**: Magic numbers/strings in `config/` or `constants/`

### Best Practices
- **DRY Principle**: Extract reusable logic into hooks/utilities
- **Single Responsibility**: One component/function does one thing
- **Accessibility**: Use semantic HTML, ARIA attributes, keyboard navigation
- **Security**: Sanitize user inputs, use HTTPS, avoid inline scripts
- **Performance**: Optimize images, bundle splitting, lazy loading

## UI/UX Guidelines

### Design System
- **Framework**: Material-UI (MUI) v6
- **Theme**: Custom theme in `styles/theme.ts` with color tokens
- **Responsive**: Mobile-first approach, use MUI breakpoints
- **Typography**: Consistent font families (JetBrains Mono, Manrope, Orbitron, Pacifico)
- **Icons**: Material Icons or React Icons

### User Experience
- **Accessibility (a11y)**: WCAG 2.1 AA compliance
  - Alt text for images
  - Sufficient color contrast (4.5:1 ratio)
  - Keyboard navigation support
  - Screen reader friendly
- **Loading States**: Skeleton loaders for async content
- **Error States**: Graceful error handling with retry options
- **Feedback**: Toast notifications for actions, form validation messages
- **Animations**: Subtle transitions (200-400ms), avoid motion for reduced-motion users

### Component Guidelines
- **Props**: Destructure props, provide defaults
- **Styling**: Use MUI sx prop or styled-components, avoid inline styles
- **Forms**: Controlled components, validation with react-hook-form or similar
- **Data Fetching**: Use custom hooks (e.g., `useBlogPosts`), handle loading/error states
- **Routing**: React Router v6, protected routes if needed

## Testing
- **Framework**: Jest + React Testing Library
- **Coverage**: Aim for 80%+ coverage
- **Test Types**: Unit tests for utilities, integration for components
- **Commands**:
  ```powershell
  npm test              # Run all tests
  npm run test:watch    # Watch mode
  npm run test:coverage # With coverage report
  ```

## Deployment & CI/CD
- **Platform**: Vercel (configured in vercel.json)
- **Build**: `npm run build` (TypeScript + Vite)
- **Environment Variables**: Use .env files, prefix with VITE_ for client-side
- **SEO**: Meta tags handled dynamically via domainConfig, static fallbacks in index.html
- **Multi-Domain**: Supports benhickman.dev (primary), zengineer.cloud, zennlogic.com

## Git Workflow
- **Branching**: Feature branches from dev, PR to main
- **Commits**: Conventional commits (feat:, fix:, docs:)
- **PR Reviews**: Required for main merges
- **Linting/Formatting**: ESLint + Prettier, run before commit

## Common Patterns
- **API Calls**: Use Sanity client for blog data
- **State Management**: React hooks for local state, Context for global
- **Images**: Store in public/images/, optimize for web
- **Environment Config**: domainConfig.ts for domain-specific branding

## Troubleshooting
- **Build Issues**: Clear node_modules, reinstall
- **Type Errors**: Check TypeScript config, run `npx tsc --noEmit`
- **Styling**: Use browser dev tools, check MUI theme overrides
- **Performance**: Use Lighthouse, optimize bundles

Follow these guidelines to maintain code quality, user experience, and cross-platform compatibility in this Windows-focused development setup.