import React, { useEffect } from 'react';
import { Container, Typography, Box, Divider, List, ListItem, ListItemText } from '@mui/material';
import FormspreeContactForm from '../components/common/FormspreeContactForm';

const PrivacyPolicy: React.FC = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' } }}
      >
        Privacy Policy
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Last Updated: {new Date().toLocaleDateString()}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" paragraph>
          Welcome to <strong>benhickman.dev</strong>. We are committed to protecting your personal
          data and respecting your privacy. This policy explains how we collect, use, and safeguard
          your information when you visit our website.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Section title="1. Data We Collect">
          <Typography variant="body1" paragraph>
            We collect different types of data depending on how you interact with our site. We
            categorize this data into "Functional" (necessary) and "Analytics" (optional).
          </Typography>

          <Subsection title="Functional & Necessary Data">
            <Typography variant="body1" paragraph>
              This data is required for the website to function securely and correctly. You cannot
              opt-out of these without affecting site functionality.
            </Typography>
            <List dense>
              <ProcessorItem
                name="Formspree"
                purpose="Contact Form Submissions"
                detail="When you send a message via our contact form, your name, email address, and message content are processed by Formspree to deliver the email to us."
              />
              <ProcessorItem
                name="hCaptcha"
                purpose="Spam Protection"
                detail="We use hCaptcha to protect our contact forms from bots and spam. It analyzes user behavior (like mouse movements) to distinguish humans from automated scripts."
              />
              <ProcessorItem
                name="Sanity.io"
                purpose="Content Delivery"
                detail="Our website content is hosted on Sanity. Requests to load content may log basic technical data (IP address, user agent) for security and performance monitoring."
              />
            </List>
          </Subsection>

          <Subsection title="Analytics Data (Optional)">
            <Typography variant="body1" paragraph>
              We use <strong>Google Analytics</strong> to understand how visitors interact with our
              site (e.g., which pages are most popular). This helps us improve our content.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>This data is NOT collected unless you explicitly consent</strong> via our
              Cookie Banner or Settings. If you consent, Google Analytics places cookies to track
              session data. IP anonymization is enabled where possible.
            </Typography>
          </Subsection>
        </Section>

        <Section title="2. Cookies">
          <Typography variant="body1" paragraph>
            We use cookies to manage your consent preferences and to enable the analytics described
            above.
          </Typography>
          <List>
            <ListItem disablePadding>
              <ListItemText
                primary="Essential Cookies"
                secondary="Used to remember your privacy choices (e.g., 'benhickman_consent_v1')."
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary="Analytics Cookies (Google Analytics)"
                secondary="Used to track site usage. Only set if you click 'Accept' or enable Analytics in settings."
              />
            </ListItem>
          </List>
          <Typography variant="body2" sx={{ mt: 1 }}>
            You can manage your preferences at any time by clicking "Cookie Preferences" in the
            footer.
          </Typography>
        </Section>

        <Section title="3. Your Rights (GDPR & CCPA)">
          <Typography variant="body1" paragraph>
            Depending on your location, you have rights regarding your personal data:
          </Typography>
          <List sx={{ listStyleType: 'disc', pl: 4 }}>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="The right to access the personal data we hold about you." />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="The right to request correction of inaccurate data." />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="The right to request deletion of your data ('Right to be forgotten')." />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="The right to withdraw consent at any time." />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            To exercise these rights, please contact us using the form on the homepage or via the
            details below.
          </Typography>
        </Section>

        <Section title="4. Contact Us">
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy or our data practices, please
            contact us.
          </Typography>
          <Box sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
            {/* @ts-expect-error - defaultSubject is defined in types but sometimes tsc lags */}
            <FormspreeContactForm defaultSubject="Privacy Policy Inquiry" />
          </Box>
        </Section>
      </Box>
    </Container>
  );
};

// Helper components for layout
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box component="section" sx={{ mb: 6 }}>
    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const Subsection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <Box sx={{ mb: 4, pl: 2, borderLeft: '4px solid', borderColor: 'divider' }}>
    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const ProcessorItem: React.FC<{ name: string; purpose: string; detail: string }> = ({
  name,
  purpose,
  detail,
}) => (
  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
    <ListItemText
      primary={
        <Typography variant="subtitle1" component="span" sx={{ fontWeight: 600 }}>
          {name}{' '}
          <Typography component="span" variant="body2" color="text.secondary">
            ({purpose})
          </Typography>
        </Typography>
      }
      secondary={
        <Typography
          variant="body2"
          color="text.secondary"
          component="span"
          sx={{ display: 'block', mt: 0.5 }}
        >
          {detail}
        </Typography>
      }
    />
  </ListItem>
);

export default PrivacyPolicy;
