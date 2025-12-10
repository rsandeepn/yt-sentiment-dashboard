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
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";

export default function ExploreComments() {
  const navigate = useNavigate();
  const { result } = useAnalysis();

  if (!result) {
    return (
      <Box p={4}>
        <Typography variant="h5">No analysis found ❗</Typography>
        <Typography mt={1} color="text.secondary">
          Analyze a YouTube video first.
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

  // -------------------------------
  // 🔍 SEARCH
  // -------------------------------
  const [searchTerm, setSearchTerm] = useState("");

  const searchResults = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    if (!t) return [];
    return allComments.filter((c) => c.text.toLowerCase().includes(t));
  }, [searchTerm, allComments]);

  // -------------------------------
  // ⭐ TOP POSITIVE / NEGATIVE
  // -------------------------------
  const [topNPositive, setTopNPositive] = useState("");
  const [topNNegative, setTopNNegative] = useState("");

  const handlePositiveChange = (e) => {
    const val = e.target.value;
    if (val === "") setTopNPositive("");
    else setTopNPositive(Math.max(1, Number(val)));
  };

  const handleNegativeChange = (e) => {
    const val = e.target.value;
    if (val === "") setTopNNegative("");
    else setTopNNegative(Math.max(1, Number(val)));
  };

  const topPositive = useMemo(() => {
    const n = Number(topNPositive) || 0;
    return [...allComments]
      .filter((c) => c.sentiment === "positive")
      .sort((a, b) => b.score - a.score)
      .slice(0, n);
  }, [allComments, topNPositive]);

  const topNegative = useMemo(() => {
    const n = Number(topNNegative) || 0;
    return [...allComments]
      .filter((c) => c.sentiment === "negative")
      .sort((a, b) => a.score - b.score)
      .slice(0, n);
  }, [allComments, topNNegative]);

  // -------------------------------
  // 📄 PAGINATION
  // -------------------------------
  const COMMENTS_PER_PAGE = 50;
  const [page, setPage] = useState(1);

  const paginatedComments = useMemo(() => {
    const start = (page - 1) * COMMENTS_PER_PAGE;
    return allComments.slice(start, start + COMMENTS_PER_PAGE);
  }, [page, allComments]);

  const totalPages = Math.ceil(allComments.length / COMMENTS_PER_PAGE);

  // -------------------------------
  // 🔍 Highlight search text
  // -------------------------------
  const highlight = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  return (
    <Box p={4}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🔍 Explore Comments
      </Typography>

      <Typography mb={3} color="text.secondary">
        Search thousands of comments, find top reactions, and explore sentiment
        in depth.
      </Typography>

      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate("/")}>
        ← Back to Summary
      </Button>

      <Grid container spacing={3}>
        {/* -----------------------------------------
            🔍 SEARCH CARD
        ------------------------------------------ */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              🔍 Search Comments
            </Typography>

            <TextField
              fullWidth
              label="ex: 'hero', 'song', 'bore', 'fight'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mt: 1 }}
            />

            <Typography variant="body2" sx={{ mt: 2 }}>
              {searchTerm && searchResults.length > 0
                ? `Found ${searchResults.length} matching comments`
                : searchTerm
                ? "No matches found."
                : "Start typing to search..."}
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
                  <Typography
                    variant="body2"
                    component="span"
                    dangerouslySetInnerHTML={{
                      __html: highlight(c.text, searchTerm),
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* -----------------------------------------
            ⭐ TOP POSITIVE / NEGATIVE
        ------------------------------------------ */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              ⭐ Top Positive & ⚠️ Top Negative Comments
            </Typography>

            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Top N Positive"
                type="number"
                value={topNPositive}
                onChange={handlePositiveChange}
                sx={{ width: 150 }}
              />
              <TextField
                label="Top N Negative"
                type="number"
                value={topNNegative}
                onChange={handleNegativeChange}
                sx={{ width: 150 }}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  color="success.main"
                  gutterBottom
                >
                  ⭐ Top Positive
                </Typography>
                <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                  {topPositive.map((c, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                      • {c.text}
                    </Typography>
                  ))}

                  {topPositive.length === 0 && (
                    <Typography color="text.secondary">
                      No positive comments found.
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="error.main" gutterBottom>
                  ⚠️ Top Negative
                </Typography>
                <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                  {topNegative.map((c, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                      • {c.text}
                    </Typography>
                  ))}

                  {topNegative.length === 0 && (
                    <Typography color="text.secondary">
                      No negative comments found.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* -----------------------------------------
          📜 PAGINATED COMMENTS
      ------------------------------------------ */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
          📜 All Comments ({allComments.length})
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ maxHeight: 400, overflowY: "scroll", pr: 1 }}>
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

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      </Paper>
    </Box>
  );
}
