import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";
import { Code, Cloud, Architecture, Work } from "@mui/icons-material";
import GradientDivider from "../components/common/GradientDivider";

const About: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const skills = [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "GraphQL",
    "REST APIs",
    "CI/CD",
    "Microservices",
    "System Design",
  ];

  const highlights = [
    {
      icon: <Work />,
      title: "Enterprise SaaS Experience",
      description:
        "Building scalable cloud solutions at SPS Commerce since 2017",
      color: "primary",
    },
    {
      icon: <Architecture />,
      title: "System Architecture",
      description:
        "Designing robust, scalable architectures for complex business problems",
      color: "secondary",
    },
    {
      icon: <Cloud />,
      title: "Cloud-Native Development",
      description:
        "Expertise in AWS, containerization, and modern DevOps practices",
      color: "success",
    },
    {
      icon: <Code />,
      title: "Full-Stack Development",
      description:
        "Proficient across the entire technology stack from frontend to infrastructure",
      color: "warning",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          About Me
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: "600px", mx: "auto" }}
        >
          Passionate software engineer dedicated to building impactful solutions
        </Typography>
      </Box>

      {/* Technical Skills Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Box sx={{ mb: 4 }}>
          <GradientDivider />
        </Box>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 4,
          }}
        >
          Technical Skills
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
          }}
        >
          {skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              variant="outlined"
              sx={{
                fontSize: "0.9rem",
              }}
            />
          ))}
        </Box>
        <Box sx={{ mt: 4 }}>
          <GradientDivider />
        </Box>
      </Box>
      {/* Introduction Section */}
      <Grid container spacing={4} sx={{ mb: 6 }} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.dark,
              mb: 2,
              fontFamily: "Inter, Montserrat, Roboto, Arial, sans-serif",
            }}
          >
            Hello, I’m Ben — the developer behind Zengineer Cloud Development.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontSize: "1.15rem",
              lineHeight: 1.8,
              color: theme.palette.text.primary,
            }}
          >
            I’m a seasoned software engineer with over 15 years in tech and 7+
            years building scalable SaaS applications. I specialize in
            architecting and delivering cloud-native systems with a strong focus
            on usability, reliability, and performance.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: theme.palette.text.secondary,
            }}
          >
            My journey began in 2007 in technical support roles, where I gained
            firsthand experience with real-world systems and user needs. That
            foundation still informs my work today — I believe great software
            starts with empathy for the end user and an obsession with
            operational excellence.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: theme.palette.text.primary,
            }}
          >
            Over the years, I’ve grown into a full-stack engineer fluent in
            Java, TypeScript, and modern cloud ecosystems — particularly AWS,
            where I’m actively completing advanced architecture certifications.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: theme.palette.text.secondary,
            }}
          >
            I'm especially passionate about clean system design, developer
            experience, and mentoring newer engineers. When I’m not refining
            backend infrastructure or pushing pixels on a UI, I’m likely hiking
            Minnesota’s trails or working on new tools under the Zengineer
            banner.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Avatar
              sx={{
                width: 240,
                height: 240,
                border: `4px solid ${theme.palette.primary.main}`,
                boxShadow: isDark
                  ? theme.custom.shadows.card.dark
                  : theme.custom.shadows.card.light,
              }}
              src="/images/ABE.png"
              alt="Ben Hickman"
            >
              BH
            </Avatar>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Box sx={{ mb: 4 }}>
          <GradientDivider />
        </Box>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 4,
          }}
        >
          What I Bring
        </Typography>
        <Grid container spacing={3}>
          {highlights.map((highlight, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mx: "auto",
                      mb: 2,
                      bgcolor:
                        highlight.color === "primary"
                          ? theme.palette.primary.main
                          : highlight.color === "secondary"
                            ? theme.palette.secondary.main
                            : highlight.color === "success"
                              ? theme.palette.success.main
                              : theme.palette.warning.main,
                    }}
                  >
                    {highlight.icon}
                  </Avatar>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {highlight.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {highlight.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default About;
