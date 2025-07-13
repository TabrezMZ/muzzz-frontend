import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { getTheme } from './theme';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlaylistDetail from './pages/PlaylistDetail';

const App = () => {
  // Dark/light theme mode state
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  // Toggle between dark and light
  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Create MUI theme based on mode
  const theme = getTheme(mode);

  // Auth check using token from localStorage
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar toggleTheme={toggleTheme} currentMode={mode} />
        <Routes>
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/playlist/:id" element={<PlaylistDetail />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
