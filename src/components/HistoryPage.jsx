import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAnalysis } from "../context/useAnalysis";
import { historyQuery, isActiveAnalysis } from "../utils/analysisJobs";
import { downloadJSONReport } from "../utils/reportInsights";

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
      navigate("/analyze");
      return;
    }
    if (item.status !== "completed") return;
    try {
      const response = await api.get(`/analyses/${item.id}`);
      setCurrentJob(null);
      setResult(response.data.result);
      navigate("/analyze");
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
      navigate("/analyze");
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

  const downloadAnalysis = async (item) => {
    setError("");
    try {
      const response = await api.get(`/analyses/${item.id}`);
      downloadJSONReport(response.data.result);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to download this report.");
    }
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1480, py: { xs: 4, md: 7 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-end" }} gap={2} mb={4}>
        <Box>
          <Typography variant="overline" color="primary" fontWeight={750}>Report library</Typography>
          <Typography variant="h2" mt={0.5}>Analysis history</Typography>
          <Typography color="text.secondary" mt={1}>Track progress, reopen reports, or run a fresh analysis.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => navigate("/analyze")}>New analysis</Button>
      </Stack>

      <Paper sx={{ p: { xs: 2, md: 2.5 }, mb: 2.5 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by video ID or URL"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            slotProps={{ input: { startAdornment: <SearchRoundedIcon sx={{ mr: 1, color: "text.secondary" }} /> } }}
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
        <Paper sx={{ p: 7, textAlign: "center", bgcolor: "#fafaf9" }}>
          <Typography variant="h5">No reports found</Typography>
          <Typography color="text.secondary" mt={1}>Try changing the filters or analyze a new video.</Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {items.map((item) => (
            <Paper key={item.id} sx={{ p: { xs: 2.25, md: 3 }, transition: "border-color 160ms ease, transform 160ms ease", "&:hover": { borderColor: "#c8c8c3", transform: "translateY(-1px)" } }}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <Typography variant="h6">Video {item.video_id}</Typography>
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
                    <Typography variant="body2" mt={1} fontWeight={600}>{item.status_message} · {item.progress}%</Typography>
                  )}
                  {item.error_message && (
                    <Typography variant="body2" color="error" mt={1}>{item.error_message}</Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  {item.status === "completed" && (
                    <>
                      <Button variant="contained" startIcon={<OpenInNewRoundedIcon />} onClick={() => openAnalysis(item)}>Open report</Button>
                      <Button variant="outlined" color="secondary" startIcon={<RefreshRoundedIcon />} onClick={() => startJob(`/analyses/${item.id}/reanalyze`)}>
                        Analyze Again
                      </Button>
                      <Button color="secondary" startIcon={<DownloadRoundedIcon />} onClick={() => downloadAnalysis(item)}>
                        JSON
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
                    <Button color="error" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => deleteAnalysis(item)}>Delete</Button>
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
    </Container>
  );
}
