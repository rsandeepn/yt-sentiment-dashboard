import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="90vh"
    >
      <Card sx={{ width: 380, p: 2 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Create Account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

          <form onSubmit={submit}>
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              margin="normal"
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
              margin="normal"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>

          <Typography variant="body2" mt={2}>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
