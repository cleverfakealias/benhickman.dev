import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Home from '../pages/Home';

const renderHome = () => render(<Home />, { wrapper: BrowserRouter });

describe('Home Page (Obsidian Foundry)', () => {
  describe('Hero', () => {
    it('renders a single agentic <h1>', () => {
      renderHome();
      const headings = screen.getAllByRole('heading', { level: 1 });
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent(/built from the model up/i);
    });

    it('exposes the ⌘K "ask my work" trigger as a labeled control', () => {
      renderHome();
      expect(screen.getByRole('button', { name: /ask my work/i })).toBeInTheDocument();
    });

    it('has the primary and secondary hero CTAs', () => {
      renderHome();
      const contact = screen.getAllByRole('link', { name: /start a conversation/i });
      expect(contact.length).toBeGreaterThanOrEqual(1);
      contact.forEach((link) => expect(link).toHaveAttribute('href', '/contact'));
      expect(screen.getByRole('link', { name: /see the work/i })).toHaveAttribute(
        'href',
        '/experience'
      );
    });
  });

  describe('Proof strip', () => {
    it('renders the three verified proof points', () => {
      renderHome();
      expect(screen.getByText(/enterprise SaaS platform/i)).toBeInTheDocument();
      expect(screen.getByText(/Astro \+ Cloudflare Workers/i)).toBeInTheDocument();
      expect(
        screen.getByText(/from-scratch GPT, QLoRA fine-tune, GGUF export/i)
      ).toBeInTheDocument();
    });
  });

  describe('Featured work bento', () => {
    it('features only the verified project set', () => {
      renderHome();
      ['zenn_ai', 'ZenMind', 'model-training', 'token-counter', 'zennlogic.com'].forEach((name) => {
        expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument();
      });
    });

    it('badges zennlogic.com as shipped', () => {
      renderHome();
      expect(screen.getByText('shipped')).toBeInTheDocument();
    });

    // Regression guard: these are never Ben's to feature (content-plan 06).
    it.each(['llmfit', 'agent-spec-lab', 'java-spring-ai', 'zennlogic_ai'])(
      'never surfaces the unverified project %s',
      (forbidden) => {
        const { container } = renderHome();
        expect(container.textContent?.toLowerCase()).not.toContain(forbidden.toLowerCase());
      }
    );

    it('links to all work', () => {
      renderHome();
      expect(screen.getByRole('link', { name: /all work/i })).toHaveAttribute(
        'href',
        '/experience'
      );
    });
  });

  describe('Stack band', () => {
    it('renders the three capability rows', () => {
      renderHome();
      expect(screen.getByText('AI / ML')).toBeInTheDocument();
      expect(screen.getByText('Languages')).toBeInTheDocument();
      expect(screen.getByText('Web / Infra')).toBeInTheDocument();
    });
  });

  describe('Writing teasers', () => {
    it('renders three upcoming pieces that link to the blog', () => {
      renderHome();
      const links = screen.getAllByRole('link', { name: /read →/i });
      expect(links).toHaveLength(3);
      links.forEach((link) => expect(link).toHaveAttribute('href', '/blog'));
    });
  });

  describe('Contact CTA', () => {
    it('renders the closing heading and verified social links', () => {
      renderHome();
      expect(
        screen.getByRole('heading', { level: 2, name: /ready to build agents that think/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
        'href',
        'https://github.benhickman.dev'
      );
      expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
        'href',
        'https://linkedin.benhickman.dev'
      );
    });
  });

  describe('Semantics', () => {
    it('labels each landmark section', () => {
      const { container } = renderHome();
      const sections = container.querySelectorAll('section');
      // hero, proof, work, stack, writing, contact
      expect(sections).toHaveLength(6);
    });
  });
});
