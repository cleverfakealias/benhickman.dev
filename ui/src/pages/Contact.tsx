import React from 'react';
import FormspreeContactForm from '../components/common/FormspreeContactForm';
import ContactInformation from '../components/common/ContactInformation';
import { Card, CardContent, useTheme, Container, Box, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';

const Contact: React.FC = () => {
  const theme = useTheme() as Theme;
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            mb: 2,
          }}
        >
          Contact
        </Typography>
        <Typography
          variant="h5"
          sx={{
            maxWidth: '600px',
            mx: 'auto',
            color: theme.palette.text.secondary,
            opacity: theme.palette.mode === 'dark' ? 0.9 : 0.7,
          }}
        >
          Get in touch for project inquiries, collaboration, or just to say hello!
        </Typography>
      </Box>
      {/* Contact Card */}
      <Box>
        <Card
          sx={{
            borderRadius: 4,
            background: theme.custom.gradients.hero[theme.palette.mode],
            border: theme.custom.borders.card[theme.palette.mode],
            boxShadow: theme.custom.shadows.card[theme.palette.mode],
            position: 'relative',
            overflow: 'hidden',
            mb: 4,
            width: '100%',
            transition: theme.custom.transitions.smooth,
            '&:hover': {
              boxShadow: theme.custom.shadows.card.hover[theme.palette.mode],
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              borderRadius: 4,
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Box sx={{ borderRadius: 0, p: 0 }}>
              <ContactInformation />
            </Box>
            <Box sx={{ mt: 4, borderRadius: 0, p: 0 }}>
              <FormspreeContactForm />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Contact;
