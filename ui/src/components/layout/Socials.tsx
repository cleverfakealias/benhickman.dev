import React from 'react';
import './Socials.css';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const socials = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.benhickman.dev',
    icon: <FaLinkedin size={24} />,
  },
  {
    name: 'GitHub',
    url: 'https://github.benhickman.dev',
    icon: <FaGithub size={24} />,
  },
];

const Socials: React.FC = () => {
  return (
    <div
      className="socials"
      style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}
    >
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default Socials;
