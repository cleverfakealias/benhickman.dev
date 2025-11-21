// import { useParams } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Typography,
//   CircularProgress,
//   Alert,
//   List,
//   ListItem,
//   ListItemText,
// } from '@mui/material';
// import { VisualEditing } from '@sanity/visual-editing/react';
// import { useSanityHomePage } from '../hooks/useSanityHomePage';
// import HomeHero from '../components/features/home/HomeHero';
// import HomeContentSection from '../components/features/home/HomeContentSection';
// import { HomeModule } from '../components/features/sanity/types/home';
// import { useEffect, useState } from 'react';
// import { debugFetchAllHomePages } from '../components/features/sanity/sanityClient';

// interface DebugPage {
//   _id: string;
//   organizationId?: string;
//   internalTitle?: string;
// }

// interface DebugInfo {
//   pagesFound?: number;
//   fetchError?: string;
//   projectId?: string;
//   dataset?: string;
//   orgIdParam?: string;
// }

// export default function HomePreview() {
//   const { organizationId: rawOrgId } = useParams<{ organizationId: string }>();
//   // Normalize organizationId to lowercase to match Sanity data
//   const organizationId = rawOrgId?.toLowerCase() || 'benhickman.dev';
//   // Force preview mode fetching
//   const { homePage, loading, error } = useSanityHomePage(organizationId || 'benhickman.dev', true);
//   const [availablePages, setAvailablePages] = useState<DebugPage[]>([]);
//   const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

//   useEffect(() => {
//     if (!homePage && !loading) {
//       debugFetchAllHomePages()
//         .then((pages: unknown) => {
//           const typedPages = pages as DebugPage[];
//           setAvailablePages(typedPages);
//           setDebugInfo((prev) => ({ ...prev, pagesFound: typedPages.length }));
//         })
//         .catch((err) => {
//           console.error('Debug fetch failed', err);
//           setDebugInfo((prev) => ({ ...prev, fetchError: err.message }));
//         });

//       // Collect config info
//       setDebugInfo((prev) => ({
//         ...prev,
//         projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
//         dataset: import.meta.env.VITE_SANITY_DATASET,
//         orgIdParam: organizationId,
//       }));
//     }
//   }, [homePage, loading, organizationId]);

//   if (loading) {
//     return (
//       <Container
//         maxWidth="lg"
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           minHeight: '60vh',
//           py: 8,
//         }}
//       >
//         <CircularProgress />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 8 }}>
//         <Alert severity="error">
//           <Typography variant="h6" gutterBottom>
//             Error Loading Home Page
//           </Typography>
//           <Typography variant="body2">
//             {error.message || 'Failed to load home page data'}
//           </Typography>
//         </Alert>
//       </Container>
//     );
//   }

//   if (!homePage) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 8 }}>
//         <Alert severity="info" sx={{ mb: 4 }}>
//           <Typography variant="h6" gutterBottom>
//             No Home Page Found
//           </Typography>
//           <Typography variant="body2" paragraph>
//             No home page has been created for organization: <strong>{organizationId}</strong>
//           </Typography>
//           <Typography variant="body2">Create one in Sanity Studio to see it here.</Typography>
//         </Alert>

//         <Box
//           sx={{
//             mb: 4,
//             p: 2,
//             bgcolor: '#f5f5f5',
//             borderRadius: 1,
//             fontFamily: 'monospace',
//             fontSize: '0.8rem',
//           }}
//         >
//           <Typography variant="subtitle2" gutterBottom>
//             Debug Info:
//           </Typography>
//           <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
//         </Box>

//         {availablePages.length > 0 ? (
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               Available Home Pages in Sanity:
//             </Typography>
//             <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #ddd' }}>
//               {availablePages.map((page) => (
//                 <ListItem key={page._id} divider>
//                   <ListItemText
//                     primary={page.internalTitle || 'Untitled'}
//                     secondary={`Organization ID: ${page.organizationId}`}
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </Box>
//         ) : (
//           <Alert severity="warning">
//             No 'homePage' documents found in the dataset. Are they published?
//           </Alert>
//         )}
//       </Container>
//     );
//   }

//   return (
//     <>
//       <VisualEditing />
//       <Box sx={{ width: '100%' }}>
//         {/* Render modules in sequence */}
//         {homePage.modules.map((module: HomeModule) => {
//           switch (module._type) {
//             case 'homeHeroModule':
//               return <HomeHero key={module._key} module={module} />;
//             case 'homeContentSectionModule':
//               return <HomeContentSection key={module._key} module={module} />;
//             default:
//               return null;
//           }
//         })}
//       </Box>
//     </>
//   );
// }
