import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Box,
  useTheme,
  Container,
  Avatar,
  Chip,
  styled,
} from "@mui/material";

export interface TimelineItemData {
  title: string;
  subtitle: string;
  description: string;
  timestamp: string;
  color: "primary" | "secondary" | "success" | "warning" | "error";
  icon: React.ReactNode;
  startDate: string; // For sorting
}

interface CareerTimelineProps {
  timelineData: TimelineItemData[];
  title?: string;
  description?: string;
  header?: React.ReactNode;
}

const TimelineContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2, 0),
  "&::before": {
    content: '""',
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: "2px",
    backgroundColor: theme.palette.divider,
    transform: "translateX(-50%)",
    [theme.breakpoints.down("md")]: {
      left: "0.75rem",
    },
    [theme.breakpoints.down("sm")]: {
      left: "0.5rem",
    },
  },
}));

const TimelineItem = styled(Box)<{ index: number }>(({ theme, index }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(4),
  flexDirection: index % 2 === 0 ? "row" : "row-reverse",
  [theme.breakpoints.down("md")]: {
    flexDirection: "row",
    paddingLeft: { xs: theme.spacing(1), sm: theme.spacing(1.5), md: theme.spacing(2) },
    marginBottom: { xs: theme.spacing(2), sm: theme.spacing(3), md: theme.spacing(4) },
  },
}));

const TimelineContent = styled(Box)<{ index: number }>(({ theme, index }) => ({
  width: "45%",
  [theme.breakpoints.down("md")]: {
    width: "calc(100vw - 4rem)",
    marginLeft: { xs: theme.spacing(0.5), sm: theme.spacing(1) },
    paddingRight: 0,
    paddingLeft: 0,
  },
  ...(index % 2 === 0
    ? {
        paddingRight: theme.spacing(4),
        [theme.breakpoints.down("md")]: {
          paddingRight: 0,
        },
      }
    : {
        paddingLeft: theme.spacing(4),
        [theme.breakpoints.down("md")]: {
          paddingLeft: 0,
        },
      }),
}));

const TimelineDot = styled(Avatar)<{ color: string }>(({ theme, color }) => ({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  width: "3.5rem",
  height: "3.5rem",
  zIndex: 2,
  boxShadow: theme.shadows[4],
  [theme.breakpoints.down("md")]: {
    left: "0.75rem",
    width: "1.5rem",
    height: "1.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    left: "0.5rem",
    width: "1.25rem",
    height: "1.25rem",
  },
  ...(color === "primary" && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  }),
  ...(color === "secondary" && {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  }),
  ...(color === "success" && {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  }),
  ...(color === "warning" && {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  }),
  ...(color === "error" && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  }),
}));

const CareerTimeline: React.FC<CareerTimelineProps> = ({
  timelineData,
  title,
  description,
  header,
}) => {
  const theme = useTheme();
  const sortedTimelineData = [...timelineData].sort(
    (a, b) => parseInt(b.startDate) - parseInt(a.startDate),
  );
  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 2, sm: 3, md: 4 },
      px: { xs: 0, sm: 0.5, md: 1 },
    }}>
      {(title || description || header) && (
        <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4, md: 6 } }}>
          {title && (
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              }}
            >
              {title}
            </Typography>
          )}
          {description && (
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ 
                maxWidth: "600px", 
                mx: "auto",
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
              }}
            >
              {description}
            </Typography>
          )}
          {header}
        </Box>
      )}
      <TimelineContainer>
        {sortedTimelineData.map((item, index) => (
          <TimelineItem key={index} index={index}>
            <TimelineDot color={item.color}>{item.icon}</TimelineDot>
            <TimelineContent index={index}>
              <Card
                elevation={3}
                sx={{
                  width: "100%",
                  minWidth: "100%",
                  maxWidth: "100%",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[8],
                  },
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent sx={{ 
                  p: { xs: 1, sm: 1.5, md: 2 },
                  "&:last-child": { pb: { xs: 1, sm: 1.5, md: 2 } }
                }}>
                  <Chip
                    label={item.timestamp}
                    color={item.color}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      mb: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" }
                    }}
                  />
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                      lineHeight: { xs: 1.3, sm: 1.4 },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      mb: { xs: 1, sm: 1.5 },
                      fontWeight: 500,
                      fontSize: { xs: "0.875rem", sm: "0.9rem", md: "1rem" },
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.5,
                      textAlign: "left",
                      fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </TimelineContainer>
    </Container>
  );
};

export default CareerTimeline;
