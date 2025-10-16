import React from 'react';
import FormspreeContactForm from '../components/common/FormspreeContactForm';
import ContactInformation from '../components/common/ContactInformation';
import { Card, CardContent, useTheme, Container, Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
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
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha('#fff', 0.06)} 100%)`
                : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha('#000', 0.02)} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2],
            position: 'relative',
            overflow: 'hidden',
            mb: 4,
            width: '100%',
            transition: theme.transitions.create('box-shadow', {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut,
            }),
            '&:hover': {
              boxShadow: theme.shadows[3],
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
