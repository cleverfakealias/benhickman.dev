import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface TimelineItemData {
  title: string;
  subtitle: string;
  description: string;
  timestamp: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  icon: React.ReactNode;
  startDate: string; // e.g. "202312" or "2023"
}

interface CareerTimelineProps {
  timelineData: TimelineItemData[];
  title?: string;
  description?: string;
  header?: React.ReactNode;
  recentYearsToShow?: number; // default 3
}

const CareerTimeline: React.FC<CareerTimelineProps> = ({
  timelineData,
  title,
  description,
  header,
  recentYearsToShow = 3,
}) => {
  // Normalize + sort desc by startDate
  const sorted = [...timelineData].sort((a, b) => parseInt(b.startDate) - parseInt(a.startDate));

  // Group by year
  const groups = sorted.reduce<Record<string, TimelineItemData[]>>((acc, item) => {
    const y = item.startDate.slice(0, 4);
    (acc[y] ||= []).push(item);
    return acc;
  }, {});
  const years = Object.keys(groups).sort((a, b) => parseInt(b) - parseInt(a));

  const [showOlder, setShowOlder] = React.useState(false);
  const recentYears = years.slice(0, recentYearsToShow);
  const olderYears = years.slice(recentYearsToShow);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 4 } }}>
      {(title || description || header) && (
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          {title && (
            <Typography
              component="h2"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.01em',
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                color: 'var(--color-text)',
                mb: 1,
              }}
            >
              {title}
            </Typography>
          )}
          {description && (
            <Typography
              sx={{
                color: 'var(--color-text-secondary-hex)',
                maxWidth: 720,
                mx: 'auto',
              }}
            >
              {description}
            </Typography>
          )}
          {header}
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
      )}

      {/* Left rail */}
      <Box sx={{ position: 'relative' }}>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'var(--color-border)',
            borderRadius: 1,
          }}
        />

        {/* YEARS — Recent first */}
        {recentYears.map((year) => (
          <YearSection key={year} year={year} items={groups[year] || []} />
        ))}

        {/* Older years (collapsed) */}
        {olderYears.length > 0 && (
          <Box sx={{ mt: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 0 }}>
              <Typography sx={{ fontWeight: 700, color: 'var(--color-text)' }}>
                Older entries
              </Typography>
              <IconButton
                className="icon-btn"
                aria-expanded={showOlder}
                aria-label={showOlder ? 'Collapse older entries' : 'Show older entries'}
                onClick={() => setShowOlder((v) => !v)}
                size="small"
              >
                <ExpandMoreIcon
                  sx={{
                    transform: showOlder ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 150ms',
                  }}
                />
              </IconButton>
            </Box>
            <Collapse in={showOlder}>
              {olderYears.map((year) => (
                <YearSection key={year} year={year} items={groups[year] || []} />
              ))}
            </Collapse>
          </Box>
        )}
      </Box>
    </Container>
  );
};

const YearSection: React.FC<{
  year: string;
  items: TimelineItemData[];
}> = ({ year, items }) => {
  return (
    <Box sx={{ ml: { xs: 3, md: 4 }, mb: { xs: 4, md: 6 } }}>
      {/* Year label */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--color-secondary-hex)',
            boxShadow: '0 0 0 3px color-mix(in oklch, var(--color-secondary) 25%, transparent)',
          }}
        />
        <Typography
          component="h3"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.01em',
            color: 'var(--color-text)',
          }}
        >
          {year}
        </Typography>
      </Box>

      {/* Cards grid */}
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2.5, md: 3 },
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fit, minmax(280px, 1fr))',
          },
        }}
      >
        {items.map((item, idx) => (
          <TimelineCard key={`${year}-${idx}`} item={item} />
        ))}
      </Box>
    </Box>
  );
};

const TimelineCard: React.FC<{ item: TimelineItemData }> = ({ item }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-1)',
        borderRadius: 'var(--radius-lg)',
        transition:
          'transform 150ms var(--easing-standard), box-shadow 150ms var(--easing-standard)',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-2)' },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              display: 'grid',
              placeItems: 'center',
              background: 'color-mix(in oklch, var(--color-accent) 12%, transparent)',
              color: 'var(--color-accent-hex)',
            }}
          >
            {item.icon}
          </Box>
          <Chip
            label={item.timestamp}
            size="small"
            variant="outlined"
            color={item.color}
            sx={{ ml: 'auto' }}
          />
        </Box>

        <Typography
          component="h4"
          sx={{
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.3,
            mb: 0.5,
            fontSize: { xs: '1rem', md: '1.1rem' },
          }}
        >
          {item.title}
        </Typography>
        <Typography
          sx={{
            color: 'var(--color-accent-hex)',
            fontWeight: 600,
            mb: 1,
            fontSize: { xs: '.9rem', md: '1rem' },
          }}
        >
          {item.subtitle}
        </Typography>
        <Typography sx={{ color: 'var(--color-text-secondary-hex)', lineHeight: 1.6 }}>
          {item.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CareerTimeline;
