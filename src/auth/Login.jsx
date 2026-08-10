import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import AuthPageShell from "./AuthPageShell";
import GoogleSignInButton from "./GoogleSignInButton";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate("/");
    else setError(result.message);
  };

  return (
    <AuthPageShell eyebrow="Welcome back" title="Sign in to CommentScope" subtitle="Continue to your analysis dashboard and saved reports.">
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={submit}>
            <Stack spacing={2.25}>
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <TextField
              label="Password"
              type="password"
              required
              inputProps={{ minLength: 8 }}
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            </Stack>
          </form>

          <GoogleSignInButton onAuthenticated={() => navigate("/")} />

          <Typography variant="body2" mt={3} color="text.secondary">
            Don’t have an account? <Link to="/register">Register</Link>
          </Typography>
    </AuthPageShell>
  );
}
