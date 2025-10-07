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
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
      }}
    >
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
          }}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default Socials;
