import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import AuthPageShell from "./AuthPageShell";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register(form.email, form.password);
    setLoading(false);
    if (result.success) navigate("/");
    else setError(result.message);
  };

  return (
    <AuthPageShell eyebrow="Get started" title="Create your account" subtitle="Build multilingual audience reports and keep every analysis organized.">
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
              helperText="Use at least 8 characters."
              inputProps={{ minLength: 8 }}
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
              {loading ? "Creating account..." : "Register"}
            </Button>
            </Stack>
          </form>

          <Typography variant="body2" mt={3} color="text.secondary">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
    </AuthPageShell>
  );
}
