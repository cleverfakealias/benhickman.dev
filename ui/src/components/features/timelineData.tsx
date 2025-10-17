import {
  Work as WorkIcon,
  RocketLaunch as RocketLaunchIcon,
  Construction as ConstructionIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import type { TimelineItemData } from './CareerTimeline';

export const timelineData: TimelineItemData[] = [
  {
    title: 'Founder & Principal Software Engineer',
    subtitle: 'BenHickman.dev – Independent Consultancy',
    description:
      'Design and ship full-stack cloud apps end-to-end: UX, React/Next.js frontends, API/CMS integrations, AWS/Vercel hosting, CI/CD, monitoring, and domain/DNS/SSL. Build reusable component libraries and a multi-tenant CMS architecture to accelerate client delivery; provide ongoing SEO and accessibility improvements.',
    timestamp: 'Jan 2024 – Present',
    color: 'primary',
    icon: <RocketLaunchIcon />,
    startDate: '2024',
  },
  {
    title: 'Software Engineer',
    subtitle: 'SPS Commerce – Minneapolis, MN',
    description:
      'Led overhaul of a data-ingestion pipeline, reducing error rates ~40%. Implemented QoS routing with Valkey (Redis) to stabilize throughput, improving processing under load. Drove a pattern for containerized Java services that cut deployment friction and cost; mentored juniors and supported hiring/interviews.',
    timestamp: 'May 2021 – Present',
    color: 'secondary',
    icon: <WorkIcon />,
    startDate: '2021',
  },
  {
    title: 'Associate Software Engineer II',
    subtitle: 'SPS Commerce',
    description:
      'Advanced full-stack delivery using TypeScript/Java and React UI. Built a data-integration platform with reliable ingestion, persistence, and visualization. Deployed HA workloads to AWS with CloudFormation/Helm and maintained quality via robust unit/integration tests.',
    timestamp: 'Jan 2020 – May 2021',
    color: 'success',
    icon: <ConstructionIcon />,
    startDate: '2020',
  },
  {
    title: 'Associate Software Engineer I',
    subtitle: 'SPS Commerce',
    description:
      'Built internal tools with Python (Flask API) and React for SOQL operations, replacing manual Salesforce updates. Automated scripts on AWS Lambda/Jenkins, improved reliability with Pytest/Jest, and debugged REST services via Postman and CloudWatch; supported CI/CD and multi-account env configs.',
    timestamp: 'Feb 2019 – Jan 2020',
    color: 'success',
    icon: <ConstructionIcon />,
    startDate: '2019',
  },

  {
    title: 'Chisago Lakes Freemasons — Public Website',
    subtitle: 'Next.js + Vercel + Cloudflare',
    description:
      'Responsive site with modern UX, SEO best practices, and accessibility improvements across devices; integrated content workflows and ongoing enhancements.',
    timestamp: '2025',
    color: 'primary',
    icon: <LanguageIcon />,
    startDate: '2024',
  },

  // Certifications / Education
  {
    title: 'Associate of Applied Science, Artificial Intelligence',
    subtitle: 'Expected Spring 2028',
    description:
      'Pursuing my AAS in AI through Hennepin Technical College, focusing on machine learning, neural networks, natural language processing, and ethics of Artificial Intelligence.',
    timestamp: 'In Progress',
    color: 'warning',
    icon: <SchoolIcon />,
    startDate: '2026',
  },
  {
    title: 'AWS Certified Solutions Architect – Professional',
    subtitle: 'Targeting Winter 2025',
    description:
      'Completing advanced design and operations across distributed, secure, cost-optimized AWS architectures.',
    timestamp: 'In Progress',
    color: 'warning',
    icon: <SchoolIcon />,
    startDate: '2025',
  },
  {
    title: 'AWS Associate Courses Completed',
    subtitle: 'Developer • SysOps Administrator',
    description:
      'Coursework completed toward AWS Developer and SysOps Associate — reinforcing cloud operations and delivery.',
    timestamp: '2024',
    color: 'warning',
    icon: <SchoolIcon />,
    startDate: '2024',
  },
];
