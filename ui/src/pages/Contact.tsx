import React from 'react';
import FormspreeContactForm from '../components/common/FormspreeContactForm';
import ContactInformation from '../components/common/ContactInformation';
import { Container, Box, Typography } from '@mui/material';

const Contact: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
        <Typography
          component="h1"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.01em',
            fontSize: { xs: '1.8rem', md: '2.2rem' },
            color: 'var(--color-text)',
            mb: 2,
          }}
        >
          Get in Touch
        </Typography>
        <Typography
          sx={{
            color: 'var(--color-text-secondary-hex)',
            maxWidth: 640,
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Let's discuss your project, collaboration opportunities, or just connect.
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

      {/* Contact Card */}
      <Box component="section">
        <Box
          sx={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-1)',
            borderRadius: 'var(--radius-lg)',
            p: { xs: 3, md: 5 },
            transition: 'box-shadow 150ms var(--easing-standard)',
            '&:hover': {
              boxShadow: 'var(--shadow-2)',
            },
          }}
        >
          {/* Contact Information Section */}
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography
              component="h2"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.01em',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                color: 'var(--color-text)',
                mb: 3,
              }}
            >
              Contact Information
            </Typography>
            <ContactInformation />
          </Box>

          {/* Divider */}
          <Box
            sx={{
              height: 1,
              background: 'var(--color-border)',
              my: { xs: 4, md: 5 },
            }}
          />

          {/* Contact Form Section */}
          <Box>
            <Typography
              component="h2"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.01em',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                color: 'var(--color-text)',
                mb: 3,
              }}
            >
              Send a Message
            </Typography>
            <FormspreeContactForm />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Contact;
