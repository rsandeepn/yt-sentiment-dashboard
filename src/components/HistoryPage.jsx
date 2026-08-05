import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAnalysis } from "../context/useAnalysis";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { setResult } = useAnalysis();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/analyses")
      .then((response) => setItems(response.data))
      .catch((requestError) => {
        setError(requestError.response?.data?.detail || "Unable to load analysis history.");
      })
      .finally(() => setLoading(false));
  }, []);

  const openAnalysis = async (id) => {
    setError("");
    try {
      const response = await api.get(`/analyses/${id}`);
      setResult(response.data.result);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to load this analysis.");
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: { xs: 2, sm: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>Analysis History</Typography>
        <Button variant="outlined" onClick={() => navigate("/")}>Back to Dashboard</Button>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">Your completed analyses will appear here.</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <Paper key={item.id} sx={{ p: 3 }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
                <Box>
                  <Typography fontWeight={700}>Video {item.video_id}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                    {item.video_url}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Button variant="contained" onClick={() => openAnalysis(item.id)}>Open Results</Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
