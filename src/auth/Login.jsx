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
import LegalConsent from "./LegalConsent";
import { hasAcceptedLegalTerms, saveLegalAcceptance } from "./legalConsentStorage";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(hasAcceptedLegalTerms);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!acceptedLegal) {
      setError("Please agree to the Terms of Use and Privacy Policy to continue.");
      return;
    }
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      saveLegalAcceptance();
      navigate("/analyze");
    }
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

            <Typography variant="body2" textAlign="right" mt={-1}>
              <Link to="/forgot-password">Forgot password?</Link>
            </Typography>

            <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <LegalConsent checked={acceptedLegal} onChange={setAcceptedLegal} />
            </Stack>
          </form>

          <GoogleSignInButton
            disabled={!acceptedLegal}
            onAuthenticated={() => {
              saveLegalAcceptance();
              navigate("/analyze");
            }}
          />

          <Typography variant="body2" mt={3} color="text.secondary">
            Don’t have an account? <Link to="/register">Register</Link>
          </Typography>
    </AuthPageShell>
  );
}
