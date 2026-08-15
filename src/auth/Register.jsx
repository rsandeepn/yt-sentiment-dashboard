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
import GoogleSignInButton from "./GoogleSignInButton";
import LegalConsent from "./LegalConsent";
import { hasAcceptedLegalTerms, saveLegalAcceptance } from "./legalConsentStorage";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(hasAcceptedLegalTerms);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!acceptedLegal) {
      setError("Please agree to the Terms of Use and Privacy Policy to continue.");
      return;
    }
    setLoading(true);
    const result = await register({
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      password: form.password,
      confirm_password: form.confirmPassword,
    });
    setLoading(false);
    if (result.success) {
      saveLegalAcceptance();
      navigate("/analyze");
    }
    else setError(result.message);
  };

  return (
    <AuthPageShell eyebrow="Get started" title="Create your account" subtitle="Build multilingual audience reports and keep every analysis organized.">
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={submit}>
            <Stack spacing={2.25}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="First name"
                required
                fullWidth
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <TextField
                label="Last name"
                required
                fullWidth
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </Stack>
            <TextField
              label="Email ID"
              type="email"
              required
              fullWidth
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <TextField
              label="Password"
              type="password"
              required
              helperText="Use at least 8 characters."
              inputProps={{ minLength: 8 }}
              autoComplete="new-password"
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <TextField
              label="Confirm password"
              type="password"
              required
              inputProps={{ minLength: 8 }}
              autoComplete="new-password"
              error={Boolean(form.confirmPassword && form.password !== form.confirmPassword)}
              helperText={form.confirmPassword && form.password !== form.confirmPassword ? "Passwords do not match." : " "}
              fullWidth
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />

            <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
              {loading ? "Creating account..." : "Register"}
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
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
    </AuthPageShell>
  );
}
