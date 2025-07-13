import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useRegisterMutation } from "../features/auth/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screen

  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});
  const [apiError, setApiError] = useState("");

  // ✅ Client-side input validation
  const validate = () => {
    const errors: typeof formErrors = {};

    if (!form.username.trim()) {
      errors.username = "Username is required";
    } else if (form.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

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

  // ✅ Update field value and clear errors
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
    setApiError(""); // clear API error when typing
  };

  // ✅ Submit registration form
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await register(form).unwrap();
      alert(res.message || "Registration successful");
      navigate("/login");
    } catch (err: any) {
      setApiError(err?.data?.message || "Registration failed");
    }
  };

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={6}
      px={isMobile ? 2 : 0} // padding for mobile screens
    >
      <Typography variant={isMobile ? "h6" : "h5"} mb={2} textAlign="center">
        Register
      </Typography>

      {/* API error alert */}
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      {/* Username Field */}
      <TextField
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        error={!!formErrors.username}
        helperText={formErrors.username}
        fullWidth
        margin="normal"
      />

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

      {/* Submit Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? "Registering..." : "Register"}
      </Button>

      {/* Login Redirect */}
      <Box mt={3} textAlign="center">
        <Typography variant="body2" component="span">
          Already have an account?{" "}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={() => navigate("/login")}
          sx={{ padding: 0, minWidth: "auto" }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
