import React from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GridViewIcon from '@mui/icons-material/GridView';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import InsightsIcon from '@mui/icons-material/Insights';
import SecurityIcon from '@mui/icons-material/Security';
import MemoryIcon from '@mui/icons-material/Memory';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CareerTimeline from '../components/features/CareerTimeline';
import { timelineData } from '../components/features/timelineData';

type Item = {
  title: string;
  icon: React.ReactNode;
  points: string[]; // 2–4 bullets shown by default
  long?: string; // optional details (collapsed)
  tags?: string[]; // small chips
};

type Catalog = Record<
  'Frontend' | 'Backend' | 'Platform' | 'AI' | 'Data' | 'Practices' | 'Security',
  Item[]
>;

const catalog: Catalog = {
  Frontend: [
    {
      title: 'Frontend Architecture',
      icon: <GridViewIcon />,
      points: [
        'React, Next.js, and Vue/Vuetify applications with TypeScript foundations',
        'Storybook-driven component systems with reusable design tokens',
        'Automated performance, accessibility, and regression validation',
      ],
      tags: ['React', 'Next.js', 'Vue', 'Vuetify', 'Storybook', 'Playwright'],
      long: 'Architect modular front-end systems designed for long-term stability and composability. Emphasize predictable component behavior, accessibility compliance, and efficient hydration strategies for modern client applications.',
    },
    {
      title: 'Client Data & APIs',
      icon: <InsightsIcon />,
      points: [
        'OpenAPI and gRPC contract generation for typed client interfaces',
        'Data synchronization with React Query, SWR, and caching layers',
        'End-to-end type safety across API boundaries',
      ],
      tags: ['OpenAPI', 'gRPC', 'React Query', 'SWR', 'TypeScript'],
      long: 'Design client data layers that mirror backend domain models. Favor explicit contracts and consistent versioning to reduce runtime ambiguity and improve developer feedback loops.',
    },
  ],
  Backend: [
    {
      title: 'Service Design & Integration',
      icon: <CodeIcon />,
      points: [
        'Event-driven microservices with asynchronous orchestration',
        'Queue-first design using Kafka, SQS, SNS, and AMQ',
        'REST-based service boundaries with idempotency and structured retries',
      ],
      tags: ['Java', 'Python', 'Node.js', 'Kafka', 'AWS Lambda'],
      long: 'Design backend systems around durable messaging and clear ownership boundaries. Apply event-driven principles to decouple workloads, improve scalability, and provide operational transparency.',
    },
    {
      title: 'Reliability & Observability',
      icon: <BuildCircleIcon />,
      points: [
        'SLIs and SLOs defined collaboratively with product and operations',
        'LaunchDarkly-based feature control, rollback safety, and progressive delivery',
        'End-to-end telemetry via Prometheus, Grafana, Sumo Logic, and CloudWatch',
      ],
      tags: [
        'LaunchDarkly',
        'Prometheus',
        'Grafana',
        'Sumo Logic',
        'CloudWatch',
        'CloudTrail',
        'XRay',
      ],
      long: 'Integrate monitoring, logging, and tracing directly into service lifecycles. Treat observability as a design constraint rather than an afterthought, ensuring every deployed system remains measurable and accountable.',
    },
  ],
  Platform: [
    {
      title: 'Infrastructure & Automation',
      icon: <BuildCircleIcon />,
      points: [
        'Cloud-native architecture with AWS, Vercel, and Cloudflare',
        'Infrastructure-as-code via CloudFormation and policy-as-code validation',
        'Self-managed Kubernetes clusters with declarative configuration',
      ],
      tags: ['Kubernetes', 'CloudFormation', 'AWS', 'Vercel', 'Cloudflare'],
      long: 'Automate infrastructure provisioning and service configuration across environments. Favor immutable deployments and declarative pipelines to ensure reproducibility and operational consistency.',
    },
    {
      title: 'Continuous Delivery',
      icon: <BuildCircleIcon />,
      points: [
        'Trunk-based development with CI/CD gates for quality enforcement',
        'GitHub Actions and Azure Pipelines for build, test, and deploy automation',
        'Canary and blue/green deployment support with automated rollbacks',
      ],
      tags: ['GitHub Actions', 'Azure Pipelines', 'CI/CD', 'Canary'],
      long: 'Engineer delivery pipelines to prioritize feedback speed and deployment safety. Each pipeline is a controlled system of verification, gating, and rollback aligned with operational standards.',
    },
  ],
  Data: [
    {
      title: 'Data Modeling & Storage',
      icon: <StorageIcon />,
      points: [
        'Relational schema design using Liquibase migrations',
        'Hybrid data models across Postgres, Oracle, SQL Server, and DynamoDB',
        'Redis and Valkey for distributed caching and workload routing',
      ],
      tags: ['Postgres', 'Oracle', 'SQL Server', 'DynamoDB', 'Redis', 'Valkey'],
      long: 'Model data systems for durability, transparency, and query efficiency. Apply explicit versioning, partitioning, and cache strategies to balance scale and consistency under load.',
    },
    {
      title: 'Performance & Migration',
      icon: <StorageIcon />,
      points: [
        'Zero-downtime schema migrations and data validation pipelines',
        'Query analysis with EXPLAIN and performance instrumentation',
        'Automated regression alerts tied to storage-layer metrics',
      ],
      tags: ['Liquibase', 'SQL', 'EXPLAIN Plans', 'Profiling'],
      long: 'Treat data evolution as an engineering discipline. Each schema change and index adjustment is validated for downstream effects and reversibility before deployment.',
    },
  ],
  AI: [
    {
      title: 'AI Systems & Orchestration',
      icon: <MemoryIcon />,
      points: [
        'Retrieval-Augmented Generation (RAG) with LangChain, LangGraph, and ChromaDB',
        'Multi-agent orchestration and prompt chaining for reasoning tasks',
        'LLM evaluation, semantic caching, and structured token control',
      ],
      tags: [
        'LangChain',
        'LangGraph',
        'ChromaDB',
        'OpenAI',
        'Hugging Face',
        'LLM',
        'Vector Search',
      ],
      long: 'Engineer AI-driven architectures that integrate structured data with language models for contextual reasoning. Build RAG pipelines, orchestration layers, and agentic workflows capable of adapting to complex developer and data interactions.',
    },
    {
      title: 'Applied AI Development',
      icon: <PsychologyIcon />,
      points: [
        'Prompt engineering and chain optimization for reproducible inference',
        'Domain-specific embeddings and retrieval design',
        'Tool-augmented reasoning and data-grounded content generation',
      ],
      tags: ['Prompt Engineering', 'Embeddings', 'RAG', 'Agents', 'LLM Tools'],
      long: 'Explore the practical limits of generative AI through iterative experimentation and domain adaptation. Focus on systems that combine deterministic structure with flexible language model reasoning.',
    },
  ],
  Practices: [
    {
      title: 'Engineering Operations',
      icon: <InsightsIcon />,
      points: [
        'Incident response playbooks and system runbooks',
        'Unified dashboards for SLA and error-budget visibility',
        'Cost governance through FinOps and proactive monitoring',
      ],
      tags: ['Grafana', 'Sumo Logic', 'LogicMonitor', 'FinOps'],
      long: 'Promote engineering discipline through transparent operational processes. Each service carries a defined ownership model, escalation policy, and financial awareness.',
    },
    {
      title: 'Quality & Testing Strategy',
      icon: <InsightsIcon />,
      points: [
        'Comprehensive testing across unit, integration, and load levels',
        'Static analysis and dependency security audits integrated into CI',
        'Continuous load testing with K6 and Locust under production conditions',
      ],
      tags: ['Jest', 'Cypress', 'JUnit', 'Pytest', 'K6', 'Locust', 'OWASP'],
      long: 'Quality is embedded in the delivery path. Automated test gates and continuous performance validation ensure every deployment upholds defined quality and security thresholds.',
    },
  ],
  Security: [
    {
      title: 'Security & Compliance',
      icon: <SecurityIcon />,
      points: [
        'Annual compliance training in HIPAA, SOX, ISO 27001, and OWASP principles',
        'Secure development lifecycle integrated into all applications',
        'Encryption in transit and at rest, secrets management, and least-privilege IAM',
      ],
      tags: ['HIPAA', 'SOX', 'ISO 27001', 'OWASP', 'IAM', 'Encryption'],
      long: 'Security is treated as an architectural baseline, not an afterthought. Systems are designed for least-privilege access, full encryption coverage, and compliance alignment across major frameworks. Regular training and auditing reinforce a culture of secure-by-default engineering.',
    },
  ],
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
    <Typography
      component="h1"
      sx={{
        fontWeight: 800,
        letterSpacing: '-0.01em',
        fontSize: { xs: '1.8rem', md: '2.2rem' },
        color: 'var(--color-text)',
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        color: 'var(--color-text-secondary-hex)',
        maxWidth: 720,
        mx: 'auto',
        mt: 1,
      }}
    >
      {subtitle}
    </Typography>
    <Box
      sx={{
        width: { xs: 64, md: 92 },
        height: 3,
        borderRadius: 2,
        background: 'var(--color-secondary-hex)',
        mx: 'auto',
        mt: 2,
      }}
    />
  </Box>
);

const CardItem: React.FC<{ item: Item }> = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Card
      variant="outlined"
      sx={{
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-1)',
        borderRadius: 'var(--radius-lg)',
        transition:
          'transform 150ms var(--easing-standard), box-shadow 150ms var(--easing-standard)',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-2)' },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 'var(--radius-sm)',
              background: 'color-mix(in oklch, var(--color-accent) 12%, transparent)',
              color: 'var(--color-accent-hex)',
            }}
          >
            {item.icon}
          </Box>
          <Typography sx={{ fontWeight: 700, color: 'var(--color-text)' }}>{item.title}</Typography>
        </Box>

        <ul
          style={{
            margin: 0,
            paddingLeft: '1.1rem',
            color: 'var(--color-text-secondary-hex)',
            lineHeight: 1.7,
          }}
        >
          {item.points.map((p, i) => (
            <li key={i} style={{ marginBottom: '0.25rem' }}>
              {p}
            </li>
          ))}
        </ul>

        {item.tags && (
          <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {item.tags.map((t) => (
              <Chip
                key={t}
                label={t}
                size="small"
                variant="outlined"
                sx={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted-hex)' }}
              />
            ))}
          </Box>
        )}

        {item.long && (
          <>
            <IconButton
              aria-label="Show details"
              onClick={() => setOpen((v) => !v)}
              size="small"
              className="icon-btn"
              sx={{ mt: 0.5 }}
            >
              <ExpandMoreIcon
                sx={{
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 150ms',
                }}
              />
            </IconButton>
            <Collapse in={open}>
              <Typography sx={{ color: 'var(--color-text-muted-hex)' }}>{item.long}</Typography>
            </Collapse>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const DevelopmentExperience: React.FC = () => {
  const tabs = Object.keys(catalog) as Array<keyof Catalog>;
  const [tab, setTab] = React.useState<keyof Catalog>('Frontend');

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 4 } }}>
      <SectionHeader
        title="Development Experience"
        subtitle="Modern engineering across the stack—focused on reliability, speed, and measurable outcomes."
      />

      {/* Segmented tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 3, md: 4 } }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 0 },
            '& .MuiTabs-indicator': { height: 2, background: 'var(--color-secondary-hex)' },
          }}
        >
          {tabs.map((t) => (
            <Tab
              key={t}
              value={t}
              label={t}
              iconPosition="start"
              icon={
                t === 'Frontend' ? (
                  <GridViewIcon fontSize="small" />
                ) : t === 'Backend' ? (
                  <CodeIcon fontSize="small" />
                ) : t === 'Platform' ? (
                  <BuildCircleIcon fontSize="small" />
                ) : t === 'Data' ? (
                  <StorageIcon fontSize="small" />
                ) : (
                  <InsightsIcon fontSize="small" />
                )
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Responsive grid of cards */}
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2.5, md: 3 },
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(280px, 1fr))' },
          mb: { xs: 5, md: 7 },
        }}
      >
        {catalog[tab].map((item) => (
          <CardItem key={item.title} item={item} />
        ))}
      </Box>

      {/* Timeline section (kept, but visually separated) */}
      <Box sx={{ mt: { xs: 4, md: 6 } }}>
        <CareerTimeline
          timelineData={timelineData}
          title="Career Timeline"
          description="Selected milestones across roles, platforms, and outcomes"
        />
      </Box>
    </Container>
  );
};

export default DevelopmentExperience;
