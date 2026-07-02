import React from 'react';
import './Socials.css';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { socialProfiles } from '../../config/socialLinks';

// URLs come from the single shared source; this component owns the icon set and
// the rendered order (LinkedIn first, then GitHub).
const urlFor = (name: string) => socialProfiles.find((p) => p.name === name)?.url ?? '';

const socials = [
  {
    name: 'LinkedIn',
    url: urlFor('LinkedIn'),
    icon: <FaLinkedin size={24} />,
  },
  {
    name: 'GitHub',
    url: urlFor('GitHub'),
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
