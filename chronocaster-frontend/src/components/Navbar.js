// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useColorMode } from '../theme/ThemeProvider';

const Navbar = () => {
  const { toggleColorMode } = useColorMode();
  const mode = document.body.classList.contains('dark') ? 'dark' : 'light';

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
      <h1>ChronoCaster Dashboard</h1>
      <div>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/programs">Programs</Link>
        <Link to="/units">Units</Link>
        <Link to="/segments">Segments</Link>
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </div>
    </nav>
  );
};

export default Navbar;
