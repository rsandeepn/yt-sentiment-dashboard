import { useState } from "react";
import { Alert, Box, Divider, Typography } from "@mui/material";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "../context/authContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

function GoogleButton({ disabled, onAuthenticated }) {
  const { googleLogin } = useAuth();
  const [error, setError] = useState("");

  const authenticate = async (credentialResponse) => {
    setError("");
    if (disabled) {
      setError("Please agree to the Terms of Use and Privacy Policy to continue.");
      return;
    }
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) onAuthenticated();
    else setError(result.message);
  };

  return (
    <>
      <Divider sx={{ my: 3 }}>
        <Typography variant="caption" color="text.secondary">OR</Typography>
      </Divider>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box
        aria-disabled={disabled}
        sx={{
          display: "flex",
          justifyContent: "center",
          minHeight: 44,
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        <GoogleLogin
          onSuccess={authenticate}
          onError={() => setError("Google sign-in was cancelled or could not be completed.")}
          shape="rectangular"
          size="large"
          text="continue_with"
          theme="outline"
          width="420"
        />
      </Box>
    </>
  );
}

export default function GoogleSignInButton({ disabled = false, onAuthenticated }) {
  if (!GOOGLE_CLIENT_ID) return null;
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleButton disabled={disabled} onAuthenticated={onAuthenticated} />
    </GoogleOAuthProvider>
  );
}
