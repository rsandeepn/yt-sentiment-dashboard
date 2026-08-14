import { useState } from "react";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import AuthPageShell from "./AuthPageShell";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState(token ? "" : "This password reset link is invalid.");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password: form.password,
        confirm_password: form.confirmPassword,
      });
      setMessage(response.data.message);
      setForm({ password: "", confirmPassword: "" });
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "Unable to reset your password. Please request a new link.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      eyebrow="Account recovery"
      title="Choose a new password"
      subtitle="Use at least eight characters. After resetting, sign in again on your devices."
    >
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      {!message && (
        <form onSubmit={submit}>
          <Stack spacing={2.25}>
            <TextField
              label="New password"
              type="password"
              required
              fullWidth
              inputProps={{ minLength: 8 }}
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            <TextField
              label="Confirm new password"
              type="password"
              required
              fullWidth
              inputProps={{ minLength: 8 }}
              autoComplete="new-password"
              error={Boolean(form.confirmPassword && form.password !== form.confirmPassword)}
              helperText={
                form.confirmPassword && form.password !== form.confirmPassword
                  ? "Passwords do not match."
                  : " "
              }
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !token}
              size="large"
            >
              {loading ? "Resetting password..." : "Reset password"}
            </Button>
          </Stack>
        </form>
      )}

      <Typography variant="body2" mt={3} color="text.secondary">
        <Link to="/login">Return to sign in</Link>
      </Typography>
    </AuthPageShell>
  );
}
