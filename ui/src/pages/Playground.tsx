import { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Paper, Button, Typography, useTheme, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AccentBar from '../components/common/AccentBar';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { getDomainConfig } from '../config/domainConfig';

const DEFAULT_CODE = `console.log('Hello, world!');`;

export default function Playground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const theme = useTheme();
  const workerRef = useRef<Worker | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const { hCaptchaSiteKey } = getDomainConfig();

  const runCode = () => {
    if (!captchaVerified) {
      setOutput('Please verify that you are human before running code.\n');
      return;
    }

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    const script = `
      self.console = {
        log: (...args) => {
          self.postMessage({ type: 'log', message: args.join(' ') });
        },
        error: (...args) => {
          self.postMessage({ type: 'error', message: args.join(' ') });
        },
        warn: (...args) => {
          self.postMessage({ type: 'warn', message: args.join(' ') });
        },
        info: (...args) => {
          self.postMessage({ type: 'info', message: args.join(' ') });
        }
      };

      self.onerror = (msg, src, lineno, colno, err) => {
        self.postMessage({ type: 'error', message: err?.toString?.() || msg });
      };

      self.onunhandledrejection = (e) => {
        self.postMessage({ type: 'error', message: e.reason?.toString?.() || 'Unhandled promise rejection' });
      };

      self.onmessage = function(e) {
        const timeoutId = setTimeout(() => {
          self.postMessage({ type: 'error', message: 'Execution timed out.' });
          self.close();
        }, 3000);

        try {
          new Function(e.data)();
          clearTimeout(timeoutId);
        } catch (err) {
          self.postMessage({ type: 'error', message: err.toString() });
          clearTimeout(timeoutId);
        }
      };
    `;

    const blob = new Blob([script], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;
    setOutput('');

    worker.onmessage = (e) => {
      const { type, message } = e.data;
      if (type === 'log' || type === 'warn' || type === 'info') {
        console[type as 'log' | 'warn' | 'info'](message);
        setOutput((prev) => prev + message + '\n');
      } else if (type === 'error') {
        console.error(message);
        setOutput((prev) => prev + 'Error: ' + message + '\n');
      }
    };

    worker.postMessage(code);
  };

  const onCaptchaVerified = (token: string | null) => {
    setCaptchaVerified(!!token);
  };

  const onCaptchaExpired = () => {
    setCaptchaVerified(false);
  };

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 4 },
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha('#fff', 0.06)} 100%)`
            : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha('#000', 0.02)} 100%)`,
        boxShadow: theme.shadows[2],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        gap: 3,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 480,
        maxWidth: 900,
        margin: '32px auto',
        width: '100%',
      }}
    >
      <AccentBar />
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
        Just a place to play with JavaScript
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Editor
          height="40vh"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{ fontSize: 16, minimap: { enabled: false } }}
        />
      </Box>
      <Button
        onClick={runCode}
        variant="contained"
        color="primary"
        sx={{ alignSelf: 'flex-start', mt: 1, mb: 1 }}
      >
        Run
      </Button>
      <Box sx={{ alignSelf: 'flex-start', mb: 2 }}>
        <HCaptcha
          ref={captchaRef}
          sitekey={hCaptchaSiteKey}
          onVerify={onCaptchaVerified}
          onExpire={onCaptchaExpired}
          theme={theme.palette.mode}
        />
      </Box>
      <Box
        sx={{
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          minHeight: 80,
          padding: 2,
          fontFamily: 'monospace',
          width: '100%',
          overflowX: 'auto',
          borderRadius: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}
        >
          Output:
        </Typography>
        <pre style={{ margin: 0 }}>{output}</pre>
      </Box>
    </Paper>
  );
}
