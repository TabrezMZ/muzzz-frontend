import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useLoginMutation } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { setToken } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState("");

  //  Validate inputs before submit
  const validate = () => {
    const errors: typeof formErrors = {};

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Invalid email format";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
    setApiError(""); 
  };

  // Handle login submission
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await login(form).unwrap();
      dispatch(setToken(res?.data?.token));
      navigate("/dashboard");
    } catch (err: any) {
      setApiError(err?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={6}
      px={isMobile ? 2 : 0} 
    >
      <Typography variant={isMobile ? "h6" : "h5"} mb={2} textAlign="center">
        Login
      </Typography>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      {/* Email Field */}
      <TextField
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        error={!!formErrors.email}
        helperText={formErrors.email}
        fullWidth
        margin="normal"
      />

      {/* Password Field */}
      <TextField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        error={!!formErrors.password}
        helperText={formErrors.password}
        fullWidth
        margin="normal"
      />

      {/* Login Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      {/* Register Redirect */}
      <Box mt={3} textAlign="center">
        <Typography variant="body2" component="span">
          Don't have an account?{" "}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={() => navigate("/register")}
          sx={{ padding: 0, minWidth: "auto" }} 
        >
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
