import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAnalysis } from "../context/useAnalysis";
import { historyQuery, isActiveAnalysis } from "../utils/analysisJobs";

const STATUS_COLORS = {
  completed: "success",
  failed: "error",
  running: "primary",
  queued: "warning",
};

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { setResult, setCurrentJob } = useAnalysis();
  const navigate = useNavigate();

  const loadHistory = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const response = await api.get("/analyses", {
        params: historyQuery({ search, status: statusFilter, page, pageSize: 10 }),
      });
      setItems(response.data.items);
      setTotalPages(response.data.total_pages);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to load analysis history.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    loadHistory(true);
  }, [loadHistory]);

  useEffect(() => {
    if (!items.some(isActiveAnalysis)) {
      return undefined;
    }
    const timer = window.setInterval(() => loadHistory(false), 2500);
    return () => window.clearInterval(timer);
  }, [items, loadHistory]);

  const openAnalysis = async (item) => {
    setError("");
    if (isActiveAnalysis(item)) {
      setCurrentJob(item);
      navigate("/");
      return;
    }
    if (item.status !== "completed") return;
    try {
      const response = await api.get(`/analyses/${item.id}`);
      setCurrentJob(null);
      setResult(response.data.result);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to load this analysis.");
    }
  };

  const startJob = async (path) => {
    setError("");
    try {
      const response = await api.post(path);
      setResult(null);
      setCurrentJob(response.data);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to start the analysis.");
    }
  };

  const deleteAnalysis = async (item) => {
    if (!window.confirm(`Delete the analysis for video ${item.video_id}?`)) return;
    try {
      await api.delete(`/analyses/${item.id}`);
      await loadHistory(false);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to delete this analysis.");
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: { xs: 2, sm: 4 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Analysis History</Typography>
          <Typography color="text.secondary">Track progress, reopen results, retry, or analyze again.</Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate("/")}>Back to Dashboard</Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Search by video ID or URL"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="queued">Queued</MenuItem>
            <MenuItem value="running">Running</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">No analyses match the current filters.</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <Paper key={item.id} sx={{ p: 3 }}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <Typography fontWeight={700}>Video {item.video_id}</Typography>
                    <Chip
                      size="small"
                      label={item.status}
                      color={STATUS_COLORS[item.status] || "default"}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                    {item.video_url}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {new Date(item.created_at).toLocaleString()}
                  </Typography>
                  {item.status_message && item.status !== "completed" && (
                    <Typography variant="body2" mt={1}>{item.status_message} · {item.progress}%</Typography>
                  )}
                  {item.error_message && (
                    <Typography variant="body2" color="error" mt={1}>{item.error_message}</Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  {item.status === "completed" && (
                    <>
                      <Button variant="contained" onClick={() => openAnalysis(item)}>Open Results</Button>
                      <Button variant="outlined" onClick={() => startJob(`/analyses/${item.id}/reanalyze`)}>
                        Analyze Again
                      </Button>
                    </>
                  )}
                  {isActiveAnalysis(item) && (
                    <Button variant="contained" onClick={() => openAnalysis(item)}>View Progress</Button>
                  )}
                  {item.status === "failed" && (
                    <Button variant="contained" onClick={() => startJob(`/analyses/${item.id}/retry`)}>Retry</Button>
                  )}
                  {!isActiveAnalysis(item) && (
                    <Button color="error" onClick={() => deleteAnalysis(item)}>Delete</Button>
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      {totalPages > 1 && (
        <Stack alignItems="center" mt={4}>
          <Pagination count={totalPages} page={page} onChange={(_event, value) => setPage(value)} />
        </Stack>
      )}
    </Box>
  );
}
