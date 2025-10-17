import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default function RouteSkeleton() {
  return (
    <Box sx={{ width: '100%', mt: 2 }} role="status" aria-live="polite">
      <Skeleton variant="text" sx={{ fontSize: '2rem', width: '40%' }} />
      <Skeleton
        variant="rectangular"
        height={140}
        sx={{ mt: 2, borderRadius: 'var(--radius-md)' }}
      />
      <Skeleton variant="text" sx={{ mt: 2, width: '85%' }} />
      <Skeleton variant="text" sx={{ width: '78%' }} />
      <Skeleton variant="text" sx={{ width: '65%' }} />
    </Box>
  );
}
