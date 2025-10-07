# Sanity Studio

This is the content management system (CMS) for the Zengineer Cloud platform, built with Sanity.io. It provides a user-friendly interface for editing and managing content like blog posts, authors, categories, and more.

## ✨ Features

- **Real-time Editing**: Collaborative content editing with live updates.
- **Custom Schemas**: Structured content types for posts, authors, categories, and block content.
- **Media Management**: Image uploads and optimization.
- **Preview Integration**: See how content looks in the frontend.
- **Version Control**: Track changes and roll back if needed.

## 🛠️ Tech Stack

- Sanity.io v3
- React (via Sanity Studio)
- TypeScript

## 📋 Prerequisites

- Node.js 18+
- Sanity account and project

## 💾 Installation

Dependencies are installed at the root level. If not, run:

```bash
cd studio
npm install
```

## ⚙️ Setup

1. **Create a Sanity Project**:
   - Go to [sanity.io](https://sanity.io) and create a new project.
   - Note your `projectId` and `dataset` (usually `production`).

2. **Configure Environment**:
   - Create a `.env` file in the `studio/` directory:
     ```
     SANITY_STUDIO_PROJECT_ID=your-project-id
     SANITY_STUDIO_DATASET=production
     ```

3. **Schemas**:
   - Schemas are defined in `schemaTypes/`.
   - Includes: `author.ts`, `blockContent.ts`, `category.ts`, `post.ts`, `index.ts`.

4. **Start Studio**:
   ```bash
   npm run dev
   ```
   - Opens at `http://localhost:3333`.

## 🚀 Usage

- **Content Creation**: Use the Studio UI to add/edit posts, authors, etc.
- **Deployment**: Host on Sanity's managed hosting or deploy to Vercel/Netlify.
- **Integration**: Content is queried by the React app via Sanity's API.

## 📦 Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start Studio locally     |
| `npm run build` | Build for production   |

## 🤝 Contributing

- Follow Sanity's best practices for schema design.
- Test content changes in the frontend preview.

For more, see the main [`../README.md`](../README.md).
