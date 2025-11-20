# 🧩 Sanity CMS Feature Generation Prompt (TypeScript)

Use this prompt to generate a new feature or schema for **Sanity CMS** in **TypeScript**, complete with examples and best practices.

---

### Prompt

> You are an expert full-stack engineer specializing in **Sanity CMS** and **TypeScript**.  
> Generate a complete, production-ready feature for a Sanity Studio project. The feature should:
>
> - Be written in **modern TypeScript (ES2022+)**.  
> - Use **Sanity v3 APIs** and schema conventions (`defineType`, `defineField`, `definePlugin`, etc.).  
> - Be **modular** and easy to import into `sanity.config.ts`.  
> - Include **clear inline comments** explaining key logic and configuration.  
> - Include **example usage** inside a Sanity Studio environment.  
>
> **Example feature ideas:**
> - “Feature Spotlight” document type with fields for image, title, summary, and CTA link.  
> - “Global Settings” singleton with site metadata, social links, and contact info.  
> - “Team Member” schema with portrait, role, and bio, including a preview configuration.  
> - Custom input component that fetches external API data and stores it in a field.  
>
> **Output requirements:**
> - A **fully working `.ts` module** implementing the feature.  
> - An **example import statement** for `sanity.config.ts`.  
> - A **short explanation** of what the feature does and how it integrates with Sanity Studio.

---

### Example Usage

Copy the above into your AI assistant (like GPT-5 or GitHub Copilot Chat) and run:

> “Generate a new **Team Member schema** using this prompt.”

It will output a ready-to-use `.ts` file that can be dropped into your `/schemas` or `/plugins` folder.
