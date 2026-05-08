import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  keyframes,
} from '@mui/material';
import { Brightness4, Brightness7, FiberManualRecord } from '@mui/icons-material';
import { useColorMode } from '../theme/ThemeProvider';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`;

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/programs', label: 'Programs' },
  { to: '/units', label: 'Units' },
  { to: '/segments', label: 'Segments' },
];

const useClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

const Navbar = () => {
  const { toggleColorMode, mode } = useColorMode();
  const location = useLocation();
  const now = useClock();
  const time = now.toLocaleTimeString([], { hour12: false });

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'primary.main',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              fontSize: 14,
              color: 'primary.main',
            }}
          >
            CC
          </Box>
          <Typography
            variant="h6"
            sx={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}
          >
            CHRONOCASTER
          </Typography>
        </Stack>

        <Chip
          size="small"
          icon={
            <FiberManualRecord
              sx={{ animation: `${pulse} 1.4s ease-in-out infinite`, fontSize: 12 }}
            />
          }
          label="ON AIR"
          color="primary"
          sx={{ fontWeight: 700, letterSpacing: 1.5, px: 1 }}
        />

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={0.5}>
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to || (to === '/' && location.pathname === '/dashboard');
            return (
              <Button
                key={to}
                component={Link}
                to={to}
                size="small"
                color="inherit"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  opacity: active ? 1 : 0.65,
                  borderBottom: active ? '2px solid' : '2px solid transparent',
                  borderColor: active ? 'primary.main' : 'transparent',
                  borderRadius: 0,
                }}
              >
                {label}
              </Button>
            );
          })}
        </Stack>

        <Typography
          sx={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 16,
            color: 'text.secondary',
            minWidth: 80,
            textAlign: 'right',
          }}
        >
          {time}
        </Typography>

        <IconButton onClick={toggleColorMode} size="small" color="inherit">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
