import React, { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

const buildTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#ff2d55' },
      secondary: { main: '#00e5ff' },
      success: { main: '#00d68f' },
      warning: { main: '#ffb020' },
      background:
        mode === 'dark'
          ? { default: '#0b0d12', paper: '#13161d' }
          : { default: '#f4f5f7', paper: '#ffffff' },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontWeight: 600 },
      h2: { fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontWeight: 600 },
      h3: { fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontWeight: 600 },
      h4: { fontWeight: 600 },
      overline: { letterSpacing: 2 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
            backgroundImage: 'none',
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
    },
  });

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  );

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <EmotionThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </EmotionThemeProvider>
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeProvider;
