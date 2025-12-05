// src/components/ExploreComments.jsx
import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";

export default function ExploreComments() {
  const navigate = useNavigate();
  const { result } = useAnalysis(); // from global context

  const [searchTerm, setSearchTerm] = useState("");
  const [topNPositive, setTopNPositive] = useState(5);
  const [topNNegative, setTopNNegative] = useState(5);

  // NEW pagination state
  const [page, setPage] = useState(1);
  const commentsPerPage = 50;

  // If no result yet → Ask user to run analysis first
  if (!result) {
    return (
      <Box p={4}>
        <Typography variant="h5">No analysis available ❗</Typography>
        <Typography mt={1} color="text.secondary">
          Please analyze a YouTube video from the dashboard.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  const allComments = result.all_comments || [];

  // -----------------------------------------
  // 🔍 SEARCH COMMENTS
  // -----------------------------------------
  const searchResults = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    if (!t) return [];

    return allComments.filter((c) => c.text.toLowerCase().includes(t));
  }, [searchTerm, allComments]);

  // -----------------------------------------
  // ⭐ TOP N POSITIVE
  // -----------------------------------------
  const topPositive = useMemo(() => {
    return [...allComments]
      .filter((c) => c.sentiment === "positive")
      .sort((a, b) => b.score - a.score)
      .slice(0, topNPositive);
  }, [allComments, topNPositive]);

  // -----------------------------------------
  // ⚠️ TOP N NEGATIVE
  // -----------------------------------------
  const topNegative = useMemo(() => {
    return [...allComments]
      .filter((c) => c.sentiment === "negative")
      .sort((a, b) => a.score - b.score)
      .slice(0, topNNegative);
  }, [allComments, topNNegative]);

  // -----------------------------------------
  // 📜 PAGINATED COMMENTS (NEW)
  // -----------------------------------------
  const paginatedComments = useMemo(() => {
    const start = (page - 1) * commentsPerPage;
    const end = start + commentsPerPage;
    return allComments.slice(start, end);
  }, [page, allComments]);

  const totalPages = Math.ceil(allComments.length / commentsPerPage);

  return (
    <Box p={4}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🔍 Explore Comments
      </Typography>

      <Typography mb={3} color="text.secondary">
        Search comments, view top reactions, and explore all viewer responses.
      </Typography>

      {/* BACK BUTTON */}
      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate("/")}>
        ← Back to Summary
      </Button>

      <Grid container spacing={3}>
        {/* -----------------------------------------
           🔍 Search comments
        ------------------------------------------ */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">🔍 Search by Keyword</Typography>

            <TextField
              fullWidth
              label="Enter keyword (hero, song, boring...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mt: 2 }}
            />

            {/* Search Summary */}
            <Typography variant="body2" sx={{ mt: 2 }}>
              {searchTerm && searchResults.length > 0
                ? `Found ${searchResults.length} comments`
                : searchTerm
                ? "No matching comments"
                : "Start typing to search comments"}
            </Typography>

            <Box sx={{ maxHeight: 260, overflowY: "auto", mt: 2 }}>
              {searchResults.map((c, idx) => (
                <Box key={idx} sx={{ mb: 1.5 }}>
                  <Chip
                    label={c.sentiment}
                    size="small"
                    color={
                      c.sentiment === "positive"
                        ? "success"
                        : c.sentiment === "negative"
                        ? "error"
                        : "default"
                    }
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" component="span">
                    {c.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* -----------------------------------------
           ⭐ Top Positive / Negative
        ------------------------------------------ */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
              ⭐ Top Positive / ⚠️ Top Negative
            </Typography>

            {/* Number inputs */}
            <Box display="flex" gap={2} mt={2} mb={2}>
              <TextField
                label="Top Positive"
                type="number"
                value={topNPositive}
                onChange={(e) =>
                  setTopNPositive(Math.max(1, Number(e.target.value)))
                }
                sx={{ width: 140 }}
              />

              <TextField
                label="Top Negative"
                type="number"
                value={topNNegative}
                onChange={(e) =>
                  setTopNNegative(Math.max(1, Number(e.target.value)))
                }
                sx={{ width: 140 }}
              />
            </Box>

            <Grid container spacing={2}>
              {/* Positive List */}
              <Grid item xs={12} sm={6}>
                <Typography color="success.main" fontWeight="bold">
                  ⭐ Top Positive
                </Typography>
                <Box sx={{ maxHeight: 200, overflowY: "auto", mt: 1 }}>
                  {topPositive.map((c, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                      • {c.text}
                    </Typography>
                  ))}
                </Box>
              </Grid>

              {/* Negative List */}
              <Grid item xs={12} sm={6}>
                <Typography color="error.main" fontWeight="bold">
                  ⚠️ Top Negative
                </Typography>
                <Box sx={{ maxHeight: 200, overflowY: "auto", mt: 1 }}>
                  {topNegative.map((c, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                      • {c.text}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* -----------------------------------------
          📜 FULL COMMENT LIST WITH PAGINATION
      ------------------------------------------ */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6">
          📜 All Comments ({allComments.length})
        </Typography>

        {/* Pagination Controls (Top) */}
        <Box display="flex" justifyContent="center" mt={2} mb={2}>
          <Pagination
            page={page}
            count={totalPages}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="medium"
          />
        </Box>

        {/* Paginated Comments */}
        <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
          {paginatedComments.map((c, idx) => (
            <Box key={idx} sx={{ mb: 1.5 }}>
              <Chip
                label={c.sentiment}
                size="small"
                color={
                  c.sentiment === "positive"
                    ? "success"
                    : c.sentiment === "negative"
                    ? "error"
                    : "default"
                }
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" component="span">
                {c.text}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Pagination Controls (Bottom) */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            page={page}
            count={totalPages}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="medium"
          />
        </Box>
      </Paper>
    </Box>
  );
}
