import { useState } from "react";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import api from "../api";
import AuthPageShell from "./AuthPageShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "Unable to request a password reset. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Enter the email associated with your account and we’ll send you a secure reset link."
    >
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <form onSubmit={submit}>
        <Stack spacing={2.25}>
          <TextField
            label="Email ID"
            type="email"
            required
            fullWidth
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading} size="large">
            {loading ? "Sending reset link..." : "Send reset link"}
          </Button>
        </Stack>
      </form>

      <Typography variant="body2" mt={3} color="text.secondary">
        Remembered your password? <Link to="/login">Return to sign in</Link>
      </Typography>
    </AuthPageShell>
  );
}
