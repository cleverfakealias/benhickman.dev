import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Switch,
  Box,
  Divider,
} from '@mui/material';
import { useConsent } from '../../hooks/useConsent';

const CookieSettingsModal: React.FC = () => {
  const { isSettingsOpen, setSettingsOpen, consent, setConsent } = useConsent();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  // Sync local state with global consent when modal opens
  useEffect(() => {
    if (isSettingsOpen) {
      setAnalyticsEnabled(consent === 'granted');
    }
  }, [isSettingsOpen, consent]);

  const handleSave = () => {
    setConsent(analyticsEnabled ? 'granted' : 'denied');
    setSettingsOpen(false);
  };

  const handleClose = () => {
    setSettingsOpen(false);
  };

  return (
    <Dialog open={isSettingsOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Privacy & Cookie Settings</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" paragraph>
          We use cookies to enhance your browsing experience and analyze our traffic. Please choose
          your preferences below.
          <br />
          <Typography
            component="a"
            href="/privacy"
            variant="caption"
            sx={{ textDecoration: 'underline', color: 'inherit', cursor: 'pointer' }}
          >
            Read our full Privacy Policy
          </Typography>
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Essential Cookies
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Required for the site to function.
              </Typography>
            </Box>
            <Switch disabled checked size="small" />
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Analytics
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Helps us improve our content.
              </Typography>
            </Box>
            <Switch
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              size="small"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} color="inherit" size="small">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" size="small" disableElevation>
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CookieSettingsModal;
