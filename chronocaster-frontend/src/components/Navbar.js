import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Brightness4, Brightness7, Login, Logout } from '@mui/icons-material';
import { useColorMode } from '../theme/ThemeProvider';
import { useAuth } from '../auth/useAuth';

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

const initials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const UserMenu = () => {
  const { user, logout, isDemo, login, isAuthenticated } = useAuth();
  const [anchor, setAnchor] = useState(null);

  if (!isAuthenticated) {
    return (
      <Button
        size="small"
        variant="contained"
        color="primary"
        startIcon={<Login />}
        onClick={login}
        sx={{ fontWeight: 700, letterSpacing: 1 }}
      >
        Sign in
      </Button>
    );
  }

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        {isDemo && (
          <Chip
            size="small"
            label="DEMO"
            variant="outlined"
            sx={{ height: 20, fontSize: 10, letterSpacing: 1.5 }}
          />
        )}
        <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small">
          <Avatar
            src={user?.picture || undefined}
            sx={{ width: 30, height: 30, fontSize: 13 }}
          >
            {initials(user?.name || 'U')}
          </Avatar>
        </IconButton>
      </Stack>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem disabled>
          <Stack>
            <Typography variant="body2">{user?.name || 'Signed in'}</Typography>
            {user?.email && (
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            )}
          </Stack>
        </MenuItem>
        {!isDemo && (
          <MenuItem
            onClick={() => {
              setAnchor(null);
              logout();
            }}
          >
            <Logout fontSize="small" sx={{ mr: 1 }} />
            Sign out
          </MenuItem>
        )}
      </Menu>
    </>
  );
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

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={0.5}>
          {navLinks.map(({ to, label }) => {
            const active =
              location.pathname === to ||
              (to === '/' && location.pathname === '/dashboard');
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

        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
