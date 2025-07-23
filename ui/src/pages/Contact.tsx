import React from "react";
import FormspreeContactForm from "../components/common/FormspreeContactForm";
import ContactInformation from "../components/common/ContactInformation";
import {
  Card,
  CardContent,
  useTheme,
  Container,
  Box,
  Typography,
} from "@mui/material";
import GradientDivider from "../components/common/GradientDivider";

const Contact: React.FC = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            mb: 2,
          }}
        >
          Contact
        </Typography>
        <Typography
          variant="h5"
          sx={{
            maxWidth: "600px",
            mx: "auto",
            color: theme.palette.text.secondary,
            opacity: theme.palette.mode === "dark" ? 0.9 : 0.7,
          }}
        >
          Get in touch for project inquiries, collaboration, or just to say
          hello!
        </Typography>
        {/* Decorative line */}
        <Box sx={{ mt: 3 }}>
          <GradientDivider
            width={{ xs: "100px", md: "150px" }}
            height="4px"
            gradient={
              theme.palette.mode === "dark"
                ? theme.custom.gradients.primaryDark
                : theme.custom.gradients.primary
            }
          />
        </Box>
      </Box>
      {/* Contact Card */}
      <Box>
        <Card
            sx={{
              borderRadius: theme.shape.borderRadius,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)"
                : "linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)",
            boxShadow: "0 8px 24px rgba(65, 42, 145, 0.10)",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "visible",
            position: "relative",
            mb: 4,
            width: "100%",
            "&:hover": {
              boxShadow: "0 20px 40px rgba(65, 42, 145, 0.15)",
              ...(theme.palette.mode === "dark" && {
                background:
                  "linear-gradient(145deg, rgba(50,50,50,0.95) 0%, rgba(60,60,60,0.95) 100%)",
              }),
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  borderRadius: theme.shape.borderRadius,
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
