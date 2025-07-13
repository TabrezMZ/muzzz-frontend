import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';

interface Props {
  toggleTheme: () => void;
  currentMode: 'light' | 'dark';
}

const Navbar = ({ toggleTheme, currentMode }: Props) => {
  const location = useLocation(); // Get current path
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  Handle logout and redirect to login
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  //  Detect current path to conditionally hide Login/Register if already there
  const isOnLoginPage = location.pathname === '/login';

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/*  App Name / Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: '#fff', textDecoration: 'none' }}
        >
          🎵 Muzzzz
        </Typography>

        {/*  Right-side nav actions */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* 🌓 Theme toggle */}
          <IconButton onClick={toggleTheme} color="inherit">
            {currentMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/*  If logged in: show dashboard/logout */}
          {token ? (
            <>
              <Button component={Link} to="/dashboard" color="inherit">
                Dashboard
              </Button>
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            </>
          ) : (
            //  If logged out: show opposite of current auth page
            <>
              {!isOnLoginPage ? 
                <Button component={Link} to="/login" color="inherit">
                  Login
                </Button> :
                <Button component={Link} to="/register" color="inherit">
                  Register
                </Button>
              }
              
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
