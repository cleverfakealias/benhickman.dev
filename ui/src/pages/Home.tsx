import React from 'react';
import { Box } from '@mui/material';
import { HeroSection } from '../components/features/home/HeroSection';
import { ProofStrip } from '../components/features/home/ProofStrip';
import { FeaturedWork } from '../components/features/home/FeaturedWork';
import { StackBand } from '../components/features/home/StackBand';
import { WritingTeasers } from '../components/features/home/WritingTeasers';
import { ContactCta } from '../components/features/home/ContactCta';

/**
 * Home — the Obsidian Foundry homepage (design `home-v1`). Agentic hero with a
 * ⌘K bar, a verified proof strip, a bento of the verified project set only,
 * the stack band, upcoming writing, and the closing contact CTA.
 */
export default function Home(): React.ReactElement {
  return (
    <Box sx={{ width: '100%' }}>
      <HeroSection />
      <ProofStrip />
      <FeaturedWork />
      <StackBand />
      <WritingTeasers />
      <ContactCta />
    </Box>
  );
}
